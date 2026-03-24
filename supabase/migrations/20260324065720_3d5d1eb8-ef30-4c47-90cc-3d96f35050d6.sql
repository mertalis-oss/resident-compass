-- Add UNIQUE constraint on leads.email for robust upsert
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique ON leads(LOWER(email));

-- Add update policy for leads (needed for upsert)
CREATE POLICY "Allow upsert on leads" ON leads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);