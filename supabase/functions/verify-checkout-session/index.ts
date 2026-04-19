import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil",
    });

    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Active reconciliation: query Stripe API directly
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const metadata = session.metadata || {};
    const orderId = metadata.order_id;
    const serviceTitle = metadata.service_id;

    // If paid, ensure DB is updated (reconciliation)
    if (session.payment_status === "paid" && orderId) {
      const { data: order } = await supabase
        .from("orders")
        .select("id, status, service_title_snapshot, audit_trail")
        .eq("id", orderId)
        .maybeSingle();

      if (order && order.status !== "paid") {
        const paymentIntent =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null;

        const existingAudit = Array.isArray(order.audit_trail)
          ? order.audit_trail
          : [];

        await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent: paymentIntent,
            stripe_customer_id:
              typeof session.customer === "string"
                ? session.customer
                : session.customer?.id || null,
            paid_at: new Date().toISOString(),
            updated_by: "api_reconciliation",
            audit_trail: [
              ...existingAudit,
              {
                action: "api_reconciliation",
                timestamp: new Date().toISOString(),
                by: "api_reconciliation",
              },
            ],
          })
          .eq("id", orderId);
      }

      return new Response(
        JSON.stringify({
          verified: true,
          status: "paid",
          service_title: order?.service_title_snapshot || metadata.email || "",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Not yet paid
    return new Response(
      JSON.stringify({
        verified: false,
        status: session.payment_status,
        service_title: "",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Verify error:", err);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
