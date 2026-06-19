import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { z } from "npm:zod@3.23.8";

const ALLOWED_ORIGINS = new Set([
  "https://planbasia.com",
  "https://www.planbasia.com",
  "https://planbasya.com",
  "https://www.planbasya.com",
  "https://planbasia-com.lovable.app",
]);
const LOVABLE_PREVIEW = /^https:\/\/[a-z0-9-]+\.lovable\.app$/i;
const VERCEL_PREVIEW = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

// Phase 0.2 — Strict return-URL host allowlist
const ALLOWED_DOMAINS = ['planbasia.com', 'planbasya.com'] as const;
const HOST_RE = /^[a-z0-9.-]+$/;

function sanitizeHost(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim().toLowerCase();
  if (!v || v.length > 64) return null;
  if (!HOST_RE.test(v)) return null;
  if (v.includes('/') || v.includes(':') || v.includes('?') || v.includes('#')) return null;
  // Override 2 (Option B): canonical-apex stripping — accept www.* variants
  // but always return the clean non-www apex so return_url / cancel_url never
  // scatter across www subdomains.
  const stripped = v.replace(/^www\./, '');
  return (ALLOWED_DOMAINS as readonly string[]).includes(stripped) ? stripped : null;
}

function resolveReturnHost(bodySourceDomain: unknown, originHeader: string | null): string {
  const fromBody = sanitizeHost(bodySourceDomain);
  if (fromBody) return fromBody;
  if (originHeader) {
    try {
      const fromOrigin = sanitizeHost(new URL(originHeader).hostname);
      if (fromOrigin) return fromOrigin;
    } catch { /* ignore */ }
  }
  return 'planbasia.com';
}

function resolveOrigin(req: Request): string | null {
  const o = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(o) || LOVABLE_PREVIEW.test(o)) return o;
  return null;
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const BodySchema = z.object({
  service_id: z.string().uuid(),
  source_domain: z.string().max(200).optional().nullable(),
  agreed_to_terms: z.boolean().optional(),
  email: z.string().trim().toLowerCase().email().max(200).optional().nullable(),
  lead_id: z.string().uuid().optional().nullable(),
  source: z.string().max(50).optional().nullable(),
  utm_source: z.string().max(200).optional().nullable(),
  utm_medium: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
}).strip();

function jsonError(origin: string, status: number, msg = "Invalid request") {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const origin = resolveOrigin(req);

  if (req.method === "OPTIONS") {
    if (!origin) return new Response("Forbidden", { status: 403 });
    return new Response(null, {
      status: 204,
      headers: { ...corsHeaders(origin), "Content-Length": "0" },
    });
  }

  if (!origin) return new Response("Forbidden", { status: 403 });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
      global: {
        fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(8000) }),
      },
    });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil",
    });

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return jsonError(origin, 400);
    }

    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      console.error("[create-checkout-session] zod", parsed.error.flatten());
      return jsonError(origin, 400);
    }

    const {
      service_id,
      source_domain,
      utm_source,
      utm_campaign,
      email,
      lead_id,
      source,
    } = parsed.data;

    // Fetch service
    const { data: service, error: svcErr } = await supabase
      .from("services")
      .select("id, title, price, currency, stripe_price_id, slug")
      .eq("id", service_id)
      .eq("is_active", true)
      .single();

    if (svcErr || !service) {
      return jsonError(origin, 404, "Service not found");
    }

    if (!service.stripe_price_id || !service.stripe_price_id.startsWith("price_")) {
      console.error("Invalid stripe_price_id for service:", service.id, service.stripe_price_id);
      return new Response(
        JSON.stringify({ error: "INVALID_PRICE_ID", message: "Service payment configuration is incomplete" }),
        { status: 422, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
      );
    }

    // Optional auth (guest checkout allowed)
    let userId: string | null = null;
    let userEmail: string | null = email ?? null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await anonClient.auth.getUser(token);
      if (userData?.user) {
        userId = userData.user.id;
        userEmail = userData.user.email || userEmail;
      }
    }

    // Resolve lead_id
    let resolvedLeadId: string | null = lead_id ?? null;
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

    // Anti-duplicate
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

      if (existing) existingOrderId = existing.id;
    }

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
        return jsonError(origin, 500, "Failed to create order");
      }
    }

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

    // Trusted return host: allowlist-sanitized (body → Origin → fallback)
    const returnHost = resolveReturnHost(source_domain, req.headers.get("origin"));
    const baseReturnUrl = `https://${returnHost}`;
    const success_url = `${baseReturnUrl}/success?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(service.title)}`;
    const cancel_url = `${baseReturnUrl}/services/${service.slug}?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail || undefined,
      line_items: [{ price: service.stripe_price_id, quantity: 1 }],
      mode: "payment",
      metadata,
      success_url,
      cancel_url,
    });

    await supabase
      .from("orders")
      .update({
        stripe_session_id: session.id,
        status: "pending",
        updated_by: "checkout_function",
        audit_trail: [
          { action: "order_created", timestamp: new Date().toISOString(), by: "checkout_function" },
          { action: "checkout_session_created", session_id: session.id, timestamp: new Date().toISOString(), by: "checkout_function" },
        ],
      })
      .eq("id", orderId);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return jsonError(origin, 500, "An internal error occurred. Please try again.");
  }
});
