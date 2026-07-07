import { createClient } from "npm:@supabase/supabase-js@2.57.2";
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

function resolveOrigin(req: Request): string | null {
  const o = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(o) || LOVABLE_PREVIEW.test(o) || VERCEL_PREVIEW.test(o)) return o;
  return null;
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const str200 = z.string().max(200).optional().nullable();

// mcp_source enum — AI agent attribution. Any string permitted (agent
// senders identify themselves), but common values are logged for audit:
// "mcp_claude" | "mcp_chatgpt" | "mcp_perplexity" | "mcp_cursor" | "mcp_unknown"
const mcpSourceStr = z.string().trim().max(50)
  .regex(/^[a-z0-9_-]+$/i, "mcp_source must be alphanumeric+underscore")
  .optional().nullable();

const LeadSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  name: str200,
  customer_whatsapp: str200,
  source_domain: str200,
  source_site: str200,
  created_from: str200,
  language: str200,
  intent: str200,
  timeline: str200,
  budget: str200,
  funnel_stage: str200,
  entry_point: str200,
  page_path: str200,
  page_query: str200,
  referrer: str200,
  session_id: str200,
  submit_iso: str200,
  service_id: z.string().uuid().optional().nullable(),
  recommended_service_id: z.string().uuid().optional().nullable(),
  utm_source_first: str200,
  utm_medium_first: str200,
  utm_campaign_first: str200,
  utm_source_last: str200,
  utm_medium_last: str200,
  utm_campaign_last: str200,
  // AI-agent attribution — set by MCP server when a lead comes from an LLM tool call
  // instead of a human-filled web form. Enables funnel analysis: which LLM sends
  // the highest-converting leads?
  mcp_source: mcpSourceStr,
  submit_timestamp: z.number().int().optional().nullable(),
  quiz_answers: z
    .record(z.union([z.string().max(500), z.number(), z.boolean(), z.null()]))
    .superRefine((v, ctx) => {
      if (Object.keys(v).length > 50) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Too many fields" });
      }
    })
    .optional()
    .default({}),
  company_website: z.string().max(200).optional().nullable(),
  score: z.number().int().min(0).max(100).nullable().optional(),
}).strip();

const intentMap: Record<string, number> = {
  relocating_now: 30, relocate: 30,
  planning_6_12: 20, explore: 15,
  exploring: 10, info: 5,
};
const timelineMap: Record<string, number> = {
  now: 30, immediate: 30,
  "3m": 20, "6m": 10,
  later: 5,
};
const budgetMap: Record<string, number> = {
  over_10k: 40, premium: 40,
  "3_to_10k": 25, mid: 25,
  under_3k: 10, low: 10,
};

function genericError(origin: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: "Invalid request" }), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

// ── In-memory rate limiter (per-instance sliding window) ──
// 5 requests / 60s per fingerprint (IP + user-agent hash prefix). Multi-
// instance Vercel/Supabase edge means an attacker could rotate across
// instances, but this stops naive spam without requiring a database write
// on every submission. Postgres-backed rate limit is planned for Sprint 5
// when we may see actual attack traffic. Keep the Map bounded so a memory
// leak from unique fingerprints can't crash the function.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAP_MAX = 5000;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function fingerprint(req: Request): string {
  const ip = req.headers.get("cf-connecting-ip")
    || req.headers.get("x-real-ip")
    || (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim()
    || "unknown";
  const ua = req.headers.get("user-agent") || "";
  return `${ip}|${ua.slice(0, 40)}`;
}

function checkRateLimit(fp: string): boolean {
  const now = Date.now();

  // Bound the map: if we ever grow beyond RATE_LIMIT_MAP_MAX, drop expired entries.
  if (rateLimitMap.size >= RATE_LIMIT_MAP_MAX) {
    for (const [key, entry] of rateLimitMap) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(fp);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(fp, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
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
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(origin) });
  }

  // Rate limit BEFORE JSON parse to protect against payload-flooding.
  const fp = fingerprint(req);
  if (!checkRateLimit(fp)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Rate limit exceeded. Please try again in a minute." }),
      {
        status: 429,
        headers: {
          ...corsHeaders(origin),
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return genericError(origin, 400);
  }

  // Honeypot: silent success
  if (raw && typeof raw === "object" && (raw as Record<string, unknown>).company_website) {
    const hp = (raw as Record<string, unknown>).company_website;
    if (typeof hp === "string" && hp.trim().length > 0) {
      return new Response(null, {
        status: 204,
        headers: { ...corsHeaders(origin), "Content-Length": "0" },
      });
    }
  }

  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("[submit-lead] zod", parsed.error.flatten());
    return genericError(origin, 400);
  }

  const { company_website: _hp, score: clientScore, ...data } = parsed.data;
  const normalizedEmail = data.email.trim().toLowerCase();

  const lead_score = Math.min(
    100,
    (data.intent ? (intentMap[data.intent] ?? 0) : 0) +
      (data.timeline ? (timelineMap[data.timeline] ?? 0) : 0) +
      (data.budget ? (budgetMap[data.budget] ?? 0) : 0),
  );

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: { persistSession: false },
        global: {
          fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(8000) }),
        },
      },
    );

    const payload = {
      ...data,
      email: normalizedEmail,
      lead_score,
      ...(data.created_from === "quiz" && typeof clientScore === "number"
        ? { score: clientScore }
        : {}),
    };

    const { data: inserted, error } = await supabase
      .from("leads")
      .upsert(payload, { onConflict: "email", ignoreDuplicates: false })
      .select("id")
      .single();

    if (error) {
      console.error("[submit-lead] insert", error);
      return genericError(origin, 400);
    }

    return new Response(JSON.stringify({ ok: true, id: inserted.id }), {
      status: 200,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[submit-lead] fatal", err);
    return genericError(origin, 400);
  }
});
