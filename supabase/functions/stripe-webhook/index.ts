import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const STATUS_PRIORITY: Record<string, number> = {
  initiated: 0,
  pending: 1,
  paid: 2,
  processing: 3,
  fulfilled: 4,
  refunded: 5,
  disputed: 6,
  cancelled: 7,
  abandoned: 8,
  failed: 9,
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2025-08-27.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  // Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // RAW LOGGING FIRST - always log before processing
  try {
    await supabase.from("webhook_logs").insert({
      event_id: event.id,
      type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });
  } catch (logErr) {
    console.error("Failed to log webhook:", logErr);
  }

  // EVENT FILTERING - only handle known events
  const handledEvents = [
    "checkout.session.completed",
    "checkout.session.expired",
    "charge.refunded",
    "charge.dispute.created",
  ];

  if (!handledEvents.includes(event.type)) {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  try {
    // DUPLICATE EVENT GUARD
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();

    if (existingOrder) {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
      });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const orderId = metadata.order_id;
      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null;

      // SMART ORDER MATCHING
      let order: any = null;
      if (orderId) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .maybeSingle();
        order = data;
      }
      if (!order && paymentIntent) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_payment_intent", paymentIntent)
          .maybeSingle();
        order = data;
      }
      if (!order && session.id) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_session_id", session.id)
          .maybeSingle();
        order = data;
      }

      if (!order) {
        console.error("Order not found for event:", event.id, metadata);
        return new Response(
          JSON.stringify({ received: true, error: "order_not_found" }),
          { status: 200 }
        );
      }

      // PRICE & CURRENCY GUARD
      const stripeAmountInUnits = (session.amount_total || 0) / 100;
      const stripeCurrency = (session.currency || "").toUpperCase();
      const dbCurrency = (order.currency || "USD").toUpperCase();

      if (
        order.amount !== null &&
        (Math.abs(stripeAmountInUnits - Number(order.amount)) > 0.01 ||
          stripeCurrency !== dbCurrency)
      ) {
        console.error(
          `CRITICAL: Price/currency mismatch! Stripe: ${stripeAmountInUnits} ${stripeCurrency}, DB: ${order.amount} ${dbCurrency}`
        );
        return new Response(
          JSON.stringify({ received: true, error: "amount_mismatch" }),
          { status: 200 }
        );
      }

      // STATE PRIORITY CHECK
      const currentPriority = STATUS_PRIORITY[order.status || "initiated"] ?? 0;
      const newPriority = STATUS_PRIORITY["paid"] ?? 2;
      if (currentPriority >= newPriority) {
        return new Response(
          JSON.stringify({ received: true, skipped: "higher_state" }),
          { status: 200 }
        );
      }

      // Build audit entry
      const existingAudit = Array.isArray(order.audit_trail)
        ? order.audit_trail
        : [];
      const auditEntry = {
        action: "payment_confirmed",
        event_id: event.id,
        old_status: order.status,
        new_status: "paid",
        timestamp: new Date().toISOString(),
        by: "webhook",
      };

      // UPDATE ORDER
      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_event_id: event.id,
          stripe_payment_intent: paymentIntent,
          stripe_customer_id:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id || null,
          customer_email:
            session.customer_details?.email || order.customer_email,
          customer_name:
            session.customer_details?.name || order.customer_name,
          paid_at: new Date().toISOString(),
          updated_by: "webhook",
          audit_trail: [...existingAudit, auditEntry],
        })
        .eq("id", order.id);

      // TODO: Trigger client receipt email (e.g., via Resend/SMTP)
      // await sendReceiptEmail(order.customer_email, service.title, order.amount);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const orderId = metadata.order_id;

      if (orderId) {
        const { data: order } = await supabase
          .from("orders")
          .select("status, audit_trail")
          .eq("id", orderId)
          .maybeSingle();

        if (order) {
          const currentPriority =
            STATUS_PRIORITY[order.status || "initiated"] ?? 0;
          if (currentPriority < (STATUS_PRIORITY["cancelled"] ?? 7)) {
            const existingAudit = Array.isArray(order.audit_trail)
              ? order.audit_trail
              : [];
            await supabase
              .from("orders")
              .update({
                status: "cancelled",
                stripe_event_id: event.id,
                updated_by: "webhook",
                audit_trail: [
                  ...existingAudit,
                  {
                    action: "session_expired",
                    event_id: event.id,
                    timestamp: new Date().toISOString(),
                    by: "webhook",
                  },
                ],
              })
              .eq("id", orderId);
          }
        }
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntent =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id || null;

      if (paymentIntent) {
        const { data: order } = await supabase
          .from("orders")
          .select("id, status, audit_trail")
          .eq("stripe_payment_intent", paymentIntent)
          .maybeSingle();

        if (order) {
          const existingAudit = Array.isArray(order.audit_trail)
            ? order.audit_trail
            : [];
          await supabase
            .from("orders")
            .update({
              status: "refunded" as any,
              refund_status: "refunded",
              stripe_event_id: event.id,
              updated_by: "webhook",
              audit_trail: [
                ...existingAudit,
                {
                  action: "refunded",
                  event_id: event.id,
                  timestamp: new Date().toISOString(),
                  by: "webhook",
                },
              ],
            })
            .eq("id", order.id);
        }
      }
    }

    if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as Stripe.Dispute;
      const paymentIntent =
        typeof dispute.payment_intent === "string"
          ? dispute.payment_intent
          : dispute.payment_intent?.id || null;

      if (paymentIntent) {
        const { data: order } = await supabase
          .from("orders")
          .select("id, status, audit_trail")
          .eq("stripe_payment_intent", paymentIntent)
          .maybeSingle();

        if (order) {
          const existingAudit = Array.isArray(order.audit_trail)
            ? order.audit_trail
            : [];
          await supabase
            .from("orders")
            .update({
              status: "disputed" as any,
              refund_status: "disputed",
              stripe_event_id: event.id,
              updated_by: "webhook",
              audit_trail: [
                ...existingAudit,
                {
                  action: "dispute_created",
                  event_id: event.id,
                  timestamp: new Date().toISOString(),
                  by: "webhook",
                },
              ],
            })
            .eq("id", order.id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ received: true, error: err.message }), {
      status: 200,
    });
  }
});
