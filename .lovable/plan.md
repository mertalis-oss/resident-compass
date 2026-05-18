
# FAZ 1 — Zero-Downtime Enterprise Güvenlik Geçişi

`leads` tablosundaki anon INSERT policy'leri ve grant'lar **bu fazda değiştirilmez**. Yeni `submit-lead` edge function paralel yazma yolu olarak devreye alınır.

## Ortak yardımcılar (her iki edge function'da)

```ts
const ALLOWED_ORIGINS = new Set([
  "https://planbasia.com",
  "https://www.planbasia.com",
  "https://planbasya.com",
  "https://www.planbasya.com",
  "https://planbasia-com.lovable.app",
]);
const LOVABLE_PREVIEW = /^https:\/\/[a-z0-9-]+\.lovable\.app$/i;

function resolveOrigin(req: Request): string | null {
  const o = req.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(o) || LOVABLE_PREVIEW.test(o)) return o;
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
```

OPTIONS handler:
```ts
if (req.method === "OPTIONS") {
  const origin = resolveOrigin(req);
  if (!origin) return new Response("Forbidden", { status: 403 });
  return new Response(null, { status: 204, headers: { ...corsHeaders(origin), "Content-Length": "0" } });
}
```

JSON parse guard:
```ts
let body: unknown;
try { body = await req.json(); }
catch {
  return new Response(JSON.stringify({ ok: false, error: "Invalid request" }),
    { status: 400, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } });
}
```

Timeout'lu Supabase client:
```ts
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(8000) }) },
});
```

## DEPLOY 1 — `supabase/functions/submit-lead/index.ts`

- `supabase/config.toml` → `[functions.submit-lead]\nverify_jwt = false` eklenir.
- Sadece `POST`/`OPTIONS`; diğer metodlar 405.
- Honeypot: `body.company_website` truthy → 204 (boş, CORS header'lı).
- Zod (`.strip()` — `lead_score`, `status`, `id`, `created_at` reddedilir):
  - `email`: `z.string().trim().toLowerCase().email().max(200)` (zorunlu)
  - String alanlar (`.max(200).optional().nullable()`): `name, customer_whatsapp, source_domain, source_site, created_from, language, intent, timeline, budget, funnel_stage, entry_point, page_path, page_query, referrer, session_id, submit_iso`
  - `service_id, recommended_service_id`: `z.string().uuid().optional().nullable()`
  - 6 UTM alanı (`utm_{source,medium,campaign}_{first,last}`): `.max(200).optional().nullable()`
  - `submit_timestamp`: `z.number().int().optional()`
  - `quiz_answers`:
    ```ts
    z.record(z.union([z.string().max(500), z.number(), z.boolean(), z.null()]))
      .superRefine((v, ctx) => {
        if (Object.keys(v).length > 50)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Too many fields" });
      }).optional().default({})
    ```
- Server-side scoring:
  ```ts
  const intentMap   = { relocate: 30, explore: 15, info: 5 } as const;
  const timelineMap = { immediate: 30, "3m": 20, "6m": 10, later: 5 } as const;
  const budgetMap   = { premium: 40, mid: 25, low: 10 } as const;
  const lead_score = Math.min(100,
    (intentMap[d.intent] ?? 0) + (timelineMap[d.timeline] ?? 0) + (budgetMap[d.budget] ?? 0));
  ```
  `status` DB default'una bırakılır (`'new'`).
- Insert: `.from('leads').insert({...sanitized, lead_score}).select('id').single()`.
- Hata yönetimi: tüm catch → `console.error("[submit-lead]", err)` + client'a `{ ok: false, error: "Invalid request" }` (400). Başarı: `{ ok: true, id }` (200). Detay sızıntısı yok.

## DEPLOY 2 — Frontend paralel geçiş

`supabase.from('leads').insert(...)` → `supabase.functions.invoke('submit-lead', { body })`. Toast, catch, success UX, `successRef` scroll, honeypot davranışı, analytics çağrıları **birebir korunur**.

- `src/components/PlanBForm.tsx` — payload: `name, email, customer_whatsapp, source_domain, created_from, service_id`. Yanıttaki `data.id` (lead_id) varsa mevcut akışta kullanılan yerlere aktarılır.
- `src/components/advisory/AdvisoryForm.tsx` — payload: `name, email, customer_whatsapp, source_domain, created_from, quiz_answers, company_website` (honeypot artık server'a iletilir; client tarafındaki silent-success guard korunur).
- `src/components/home/SimplifiedAssessmentModal.tsx` — payload: mevcut alanlar + `intent, timeline, budget, quiz_answers`. Client artık `lead_score` göndermez (server hesaplar).

Admin SELECT/UPDATE yolları (`AdminLeads`, `AdminCustomers`) **değiştirilmez**.

## DEPLOY 3 — `supabase/functions/create-checkout-session/index.ts` sertleştirme

- Wildcard `*` CORS kaldırılır; Deploy 1'in `resolveOrigin` + `corsHeaders` + OPTIONS (204 + `Content-Length: 0`) + JSON parse guard + 8s timeout client deseni aynen uygulanır.
- Origin eşleşmezse anında 403 (header yok). Tüm cevaplara `corsHeaders(origin)` eklenir.
- Zod gövde:
  ```ts
  z.object({
    service_id: z.string().uuid(),
    source_domain: z.string().max(200).optional().nullable(),
    agreed_to_terms: z.boolean().optional(),
    email: z.string().trim().toLowerCase().email().max(200).optional().nullable(),
    lead_id: z.string().uuid().optional().nullable(),
    source: z.string().max(50).optional().nullable(),
    utm_source:   z.string().max(200).optional().nullable(),
    utm_medium:   z.string().max(200).optional().nullable(),
    utm_campaign: z.string().max(200).optional().nullable(),
  }).strip()
  ```
  Parse fail → 400 `{ error: "Invalid request" }` (detay yok, log'a yazılır).
- **Trusted Origin Derivation**:
  ```ts
  const origin = resolveOrigin(req);
  if (!origin) return new Response("Forbidden", { status: 403 });
  // ...
  success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(service.title)}`,
  cancel_url:  `${origin}/services/${service.slug}?canceled=true`,
  ```
  Client'tan gelen `source_domain` URL inşasında kullanılmaz (yalnız metadata/order kaydı).
- Anti-duplicate, order create/update, `stripe_price_id` doğrulama, audit trail iş mantığı korunur. Backend rate-limit YOK.

## DEPLOY 4 — `src/components/ErrorBoundary.tsx`

- `dangerouslySetInnerHTML` + `<script>` tamamen kaldırılır.
- Class field: `private redirectTimer: number | null = null`.
- `componentDidCatch(error)`:
  ```ts
  console.error('[ErrorBoundary]', error);
  const target = this.props.fallbackPath || '/';
  if (typeof window !== 'undefined' && window.location.pathname !== target) {
    this.redirectTimer = window.setTimeout(() => window.location.assign(target), 3000);
  }
  ```
- `componentWillUnmount() { if (this.redirectTimer !== null) { clearTimeout(this.redirectTimer); this.redirectTimer = null; } }`
- Fallback UI'daki manuel `<a href={path}>` korunur.

## DEPLOY 5 — SQL Migration `<ts>_phase1_revoke_grant_internal.sql`

Yalnız trigger/arka plan fonksiyonlarına dokunulur. Her biri idempotent `DO $$ BEGIN ... END $$;` bloğunda; `pg_proc`+`pg_namespace` kontrolü → `REVOKE EXECUTE ... FROM PUBLIC, anon, authenticated` → ardından `GRANT EXECUTE ... TO service_role`.

Hedef fonksiyonlar (signature'lı):
- `public.update_updated_at_column()`
- `public.auto_assign_founder_admin()`
- `public.handle_new_user()`
- `public.lock_profile_role()`
- `public.enforce_state_transition()`
- `public.enforce_ai_rate_limit()`
- `public.prevent_ledger_modification()`
- `public.enqueue_email(text, jsonb)`
- `public.read_email_batch(text, integer, integer)`
- `public.delete_email(text, bigint)`
- `public.move_to_dlq(text, text, bigint, jsonb)`
- `public.process_stripe_payment(text, text, uuid, uuid, text, integer, integer, boolean)`

Şablon:
```sql
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
  END IF;
END $$;
```

**Dokunulmaz**: `public.has_role(uuid, user_role)`, `public.check_visa_status(uuid)` SECURITY DEFINER + EXECUTE. `leads` policy/grant'ları. Sensitive tablo RLS'leri (`email_send_log`, `email_send_state`, `email_unsubscribe_tokens`, `suppressed_emails`, `stripe_webhook_events`, `stripe_webhook_failures`, `webhook_logs`).

## TS Build & doğrulama

- Edge functions ayrı Deno runtime; frontend tipleri etkilenmez (`leads` şeması değişmedi).
- Invoke tipi: `supabase.functions.invoke<{ ok: boolean; id?: string; error?: string }>('submit-lead', { body })`.
- Sıralama: Deploy 1 → 2 → 3 → 4 → 5.
- Post-deploy: `supabase--deploy_edge_functions(["submit-lead","create-checkout-session"])`, `supabase--curl_edge_functions` ile (geçerli payload → 200, malformed JSON → 400, kötü origin → 403, 51 quiz_answers key → 400, honeypot dolu → 204) testler; preview'da 3 formun submit'i `submit-lead`'e gidiyor mu network panelinden doğrulanır.
