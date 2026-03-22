
-- 1. Add new enum values to order_status
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'initiated';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'abandoned';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'failed';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'disputed';

-- 2. Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT,
  type TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read webhook logs" ON webhook_logs
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::user_role));

-- 3. Add missing columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_event_id TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS lead_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS audit_trail JSONB DEFAULT '[]'::jsonb;

-- 4. Block DELETE on orders and leads
CREATE POLICY "Block delete on orders" ON orders
  FOR DELETE TO authenticated
  USING (false);

CREATE POLICY "Block delete on leads" ON leads
  FOR DELETE TO authenticated
  USING (false);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS services_slug_unique_lower ON services(LOWER(slug));
