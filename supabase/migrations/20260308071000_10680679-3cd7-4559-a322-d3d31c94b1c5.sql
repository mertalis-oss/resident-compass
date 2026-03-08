ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS timeline text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_range text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mobility_score int;