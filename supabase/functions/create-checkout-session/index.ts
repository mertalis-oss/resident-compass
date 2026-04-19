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

    const body = await req.json();
    const {
      service_id,
      source_domain,
      agreed_to_terms,
      utm_source,
      utm_campaign,
      utm_medium,
      email,
      lead_id,
      source,
    } = body;

    if (!service_id) {
      return new Response(JSON.stringify({ error: "service_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch service
    const { data: service, error: svcErr } = await supabase
      .from("services")
      .select("id, title, price, currency, stripe_price_id, slug")
      .eq("id", service_id)
      .eq("is_active", true)
      .single();

    if (svcErr || !service) {
      return new Response(JSON.stringify({ error: "Service not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // STEP 5: Strict stripe_price_id validation
    if (!service.stripe_price_id || !service.stripe_price_id.startsWith("price_")) {
      console.error("Invalid stripe_price_id for service:", service.id, service.stripe_price_id);
      return new Response(
        JSON.stringify({ error: "INVALID_PRICE_ID", message: "Service payment configuration is incomplete" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for authenticated user (optional - guest checkout allowed)
    let userId: string | null = null;
    let userEmail: string | null = email ? email.toLowerCase().trim() : null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const anonClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await anonClient.auth.getUser(token);
      if (userData?.user) {
        userId = userData.user.id;
        userEmail = userData.user.email || userEmail;
      }
    }

    // Resolve lead_id: if missing but email present, fallback lookup
    let resolvedLeadId = lead_id || null;
    if (!resolvedLeadId && userEmail) {
      const { data: leadRow } = await supabase
        .from("leads")
        .select("id")
        .ilike("email", userEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (leadRow) resolvedLeadId = leadRow.id;
    }

    // ANTI-DUPLICATE: Check for recent initiated/pending order
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    let existingOrderId: string | null = null;

    if (userEmail) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("customer_email", userEmail)
        .eq("service_id", service_id)
        .in("status", ["initiated", "pending"])
        .gte("created_at", fifteenMinsAgo)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        existingOrderId = existing.id;
      }
    }

    // Create or reuse order
    const orderId = existingOrderId || crypto.randomUUID();

    if (!existingOrderId) {
      const { error: insertErr } = await supabase.from("orders").insert({
        id: orderId,
        customer_email: userEmail || "unknown@checkout.pending",
        service_id: service.id,
        service_title_snapshot: service.title,
        amount: service.price,
        currency: service.currency || "USD",
        status: "initiated",
        source_domain: source_domain || null,
        utm_source: utm_source || null,
        utm_campaign: utm_campaign || null,
        lead_id: resolvedLeadId || null,
        audit_trail: [
          {
            action: "order_created",
            timestamp: new Date().toISOString(),
            by: "checkout_function",
            source: source || "direct",
          },
        ],
      });

      if (insertErr) {
        console.error("Order insert error:", insertErr);
        return new Response(
          JSON.stringify({ error: "Failed to create order" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Build Stripe metadata (strings only)
    const metadata: Record<string, string> = {
      order_id: orderId,
      service_id: service.id,
      source_domain: source_domain || "",
      email: userEmail || "",
      amount: String(service.price),
      currency: service.currency || "USD",
      lead_id: resolvedLeadId || "",
      source: source || "direct",
    };

    const origin = req.headers.get("origin") || `https://${source_domain}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail || undefined,
      line_items: [{ price: service.stripe_price_id, quantity: 1 }],
      mode: "payment",
      metadata,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(service.title)}`,
      cancel_url: `${origin}/services/${service.slug}?canceled=true`,
    });

    // Update order with session ID -> pending
    await supabase
      .from("orders")
      .update({
        stripe_session_id: session.id,
        status: "pending",
        updated_by: "checkout_function",
        audit_trail: [
          {
            action: "order_created",
            timestamp: new Date().toISOString(),
            by: "checkout_function",
          },
          {
            action: "checkout_session_created",
            session_id: session.id,
            timestamp: new Date().toISOString(),
            by: "checkout_function",
          },
        ],
      })
      .eq("id", orderId);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
