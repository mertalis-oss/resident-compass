Update the `BodySchema` in `supabase/functions/create-checkout-session/index.ts` so optional string fields sent as `""` are coerced to `null` before validation, preventing 400 errors when the frontend omits them.

Changes
- Add a reusable preprocessor:
  ```ts
  const emptyStringToNull = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((v) => (v === "" ? null : v), schema);
  ```
- Wrap the affected fields with it:
  - `email` → `emptyStringToNull(z.string().trim().toLowerCase().email().max(200).optional().nullable())`
  - `lead_id` → `emptyStringToNull(z.string().uuid().optional().nullable())`
  - `source` → `emptyStringToNull(z.string().max(50).optional().nullable())`
  - `utm_source`, `utm_medium`, `utm_campaign` → `emptyStringToNull(z.string().max(200).optional().nullable())`
- Leave required and non-string fields unchanged.

Verification
- Deploy the updated `create-checkout-session` edge function.
- Use the live preview or curl to submit a checkout request with empty `email`, `lead_id`, and UTM fields; expect a 200 response containing `{ url: "..." }` instead of 400.
- End-to-end: open the TR DTV service page, accept terms, click "Danışmanlığa Devam Et", and confirm Stripe Checkout opens.