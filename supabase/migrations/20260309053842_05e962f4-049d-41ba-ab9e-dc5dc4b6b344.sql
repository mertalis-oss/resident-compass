
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS theme_color text;

ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS price_range text;

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS preferred_contact text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS program_scope text;

-- Add anon read policies (services already has public read via is_active, but user wants simple anon access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon read services' AND tablename = 'services') THEN
    CREATE POLICY "Anon read services" ON public.services FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon read packages' AND tablename = 'packages') THEN
    CREATE POLICY "Anon read packages" ON public.packages FOR SELECT TO anon USING (true);
  END IF;
END $$;
