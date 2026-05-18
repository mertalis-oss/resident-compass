
# FAZ 2 — Leads Tablosu Nihai Mühür (Lockdown) + Quiz Upsert Desteği

Sıralı 5 deploy. Önce edge function + frontend (kırılma penceresi sıfırlanır), sonra DB lockdown, sonra hafıza ve doğrulama.

## DEPLOY 1 — `supabase/functions/submit-lead/index.ts` güncellemesi

### Zod şeması
Mevcut `LeadSchema`'ya alan eklenir:
```ts
score: z.number().int().min(0).max(100).nullable().optional(),
```
`.strip()` korunur — bilinmeyen alanlar atılır, client-supplied `lead_score`/`status`/`id`/`created_at` hâlâ reddedilir.

### Email normalizasyonu (defense-in-depth)
Zod zaten `.trim().toLowerCase().email().max(200)` uyguluyor; insert öncesi ek olarak:
```ts
const normalizedEmail = data.email.trim().toLowerCase();
```
ve payload'da `email: normalizedEmail` kullanılır. Bu, `leads_email_unique (lower(email))` indeksindeki edge-case'leri eler.

### Skor kuralı
- Sunucu `lead_score`'u `intent/timeline/budget` haritalarından deterministik hesaplar (mevcut davranış).
- `score` alanı SADECE `data.created_from === 'quiz' && typeof data.score === 'number'` ise payload'a eklenir. Diğer tüm yollarda yok sayılır.

### Strict Upsert
`.insert()` yerine:
```ts
const { score, company_website: _hp, ...sanitized } = parsed.data;
const payload = {
  ...sanitized,
  email: normalizedEmail,
  lead_score,
  ...(sanitized.created_from === 'quiz' && typeof score === 'number' ? { score } : {}),
};

const { data: inserted, error } = await supabase
  .from('leads')
  .upsert(payload, { onConflict: 'email', ignoreDuplicates: false })
  .select('id')
  .single();
```
- `onConflict: 'email'` mevcut `unique_email` index'ini kullanır (`lower(email)` uniqueliği `idx_leads_email_unique` ile de korunur; normalize edilmiş lowercase email çakışmayı tetikler).
- Hata yönetimi, CORS, honeypot, 8s timeout, generic 400 yanıtı, başarı `{ok:true,id}` birebir korunur.

Deploy: `supabase--deploy_edge_functions(["submit-lead"])`.

## DEPLOY 2 — `src/pages/MobilityAssessment.tsx`

`handleEmailSubmit` içinde direkt `supabase.from('leads').upsert(...)` bloğu (satır ~183–199) **tamamen** kaldırılır. Yerine:

```ts
const { data: res, error: invokeErr } = await supabase.functions.invoke<{ ok: boolean; id?: string; error?: string }>(
  'submit-lead',
  {
    body: {
      email: cleanEmail,
      source_domain: normalizedHost,
      created_from: 'quiz',
      score,
      quiz_answers: answers,
    },
  },
);

if (invokeErr || !res?.ok || !res.id) {
  throw invokeErr ?? new Error(res?.error ?? 'Lead submit failed');
}

trackPostHogEvent("email_submitted", { source: "quiz", score }, true);
safeSet("planb_lead_id", res.id);
safeSet("planb_lead_email", cleanEmail);
safeSet("planb_last_recommendation", recommendation.slug);
trackPostHogEvent("mobility_assessment_completed", { score, recommendation: recommendation.tier }, true);
setPhase("result");
```

- Toast, `setIsSubmitting`, `normalizeEmail`, validation, `resultEventFired` davranışı değişmez.
- `score` (lokal `calculateScore` çıktısı) sunucuya iletilir; sunucu sadece `created_from==='quiz'` koşulunda kabul eder.

## DEPLOY 3 — SQL Migration `<ts>_phase2_leads_lockdown.sql`

```sql
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'leads'
      AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.leads', pol.policyname);
  END LOOP;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'leads'
  ) THEN
    REVOKE INSERT ON public.leads FROM anon, authenticated;
    GRANT  INSERT ON public.leads TO service_role;
  END IF;
END $$;
```

Sadece INSERT mühürlenir. `Staff read leads`, `Staff update leads`, `Block delete on leads` policy'leri ve admin/staff SELECT/UPDATE grant'ları korunur. `has_role` ve `check_visa_status` SECURITY DEFINER kalır. Diğer hassas tablo RLS'leri (`email_send_log`, `webhook_logs`, vb.) etkilenmez.

**Deploy sırası kritik**: Migration SADECE Deploy 1 ve Deploy 2 başarıyla deploy/build olduktan SONRA uygulanır. Aksi halde quiz akışı kırılır.

## DEPLOY 4 — `.lovable/plan.md` Güvenlik Notu

Dosyanın sonuna yeni bölüm eklenir (mevcut Faz 1 içeriği değiştirilmeden):

```
## Phase 2 — Lockdown (Sealed)
Phase 2 complete: direct client INSERT access to leads is permanently disabled.
submit-lead edge function is now the sole write path. has_role and
check_visa_status intentionally remain SECURITY DEFINER to prevent RLS
recursion (Dashboard guard). Guest checkout is an intentional business
requirement.
```

## DEPLOY 5 — Post-Migration Verification

1. **Anon PostgREST INSERT bloğu**:
   ```
   supabase--curl_edge_functions yerine ham PostgREST:
   curl -X POST "https://gjbuoyxwujpbaprcrnmg.supabase.co/rest/v1/leads" \
     -H "apikey: <anon>" -H "Authorization: Bearer <anon>" \
     -H "Content-Type: application/json" \
     -d '{"email":"lockdown-test@example.com"}'
   ```
   Beklenen: 401/403 veya `permission denied for table leads`.

2. **Edge function başarı (yeni lead)**: `supabase--curl_edge_functions` `POST /submit-lead` (preview origin header), payload `{email:"e2e-new@example.com", created_from:"plan_b_form"}` → 200, `{ok:true,id}`. `supabase--read_query` ile `SELECT id, email, lead_score FROM leads WHERE email='e2e-new@example.com'` doğrulanır.

3. **Quiz upsert idempotency**: aynı emaili tekrar `created_from:"quiz", score:42, quiz_answers:{...}` ile gönder → 200, aynı `id` döner. DB'de tek satır, `score=42`, `quiz_answers` güncel.

4. **Policy/grant teyidi**:
   ```sql
   SELECT cmd, policyname FROM pg_policies WHERE schemaname='public' AND tablename='leads';
   SELECT grantee, privilege_type FROM information_schema.role_table_grants
     WHERE table_schema='public' AND table_name='leads' ORDER BY 1,2;
   ```
   Beklenen: INSERT policy YOK; SELECT/UPDATE/DELETE policy'leri sağlam; `anon`/`authenticated` INSERT YOK; `service_role` INSERT VAR; admin SELECT/UPDATE intaktır.

5. **Admin UI sağlık**: `/admin/leads` ve `/admin/customers` (founder hesabı) — liste yüklenir, status update çalışır.

## TS Build / İskelet Etkisi

- `leads` şeması değişmedi; `src/integrations/supabase/types.ts` üretimi etkilenmez.
- Frontend `invoke` zaten tipli: `{ ok: boolean; id?: string; error?: string }`.
- Yeni `score` alanı edge function Zod'da; client tipinde değişiklik gerekmez.
- Diğer hiçbir dosya, hiçbir RLS okuma/güncelleme politikası, hiçbir SECURITY DEFINER fonksiyon değiştirilmez.
