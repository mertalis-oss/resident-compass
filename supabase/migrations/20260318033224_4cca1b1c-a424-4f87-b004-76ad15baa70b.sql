
-- Drop dependent tables first
DROP TABLE IF EXISTS service_bundles CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Drop old tables that will be recreated
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- 1. ENUMS (MANDATORY)
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'fulfilled', 'cancelled');
CREATE TYPE refund_status AS ENUM ('none', 'requested', 'refunded', 'disputed');
CREATE TYPE visibility_scope AS ENUM ('tr', 'global', 'both');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'converted', 'lost');

-- 2. SERVICES
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    features JSONB,
    faq JSONB,
    slug TEXT UNIQUE NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    image_url TEXT,
    category TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    stripe_price_id TEXT NOT NULL,
    stripe_description TEXT,
    calendly_url TEXT,
    delivery_time_days NUMERIC,
    location TEXT,
    capacity INTEGER,
    visible_on visibility_scope DEFAULT 'both',
    is_bundle BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. SERVICE BUNDLES (WITH CASCADE)
CREATE TABLE service_bundles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bundle_id UUID REFERENCES services(id) ON DELETE CASCADE,
    item_id UUID REFERENCES services(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0
);

-- 4. ORDERS
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT NOT NULL,
    customer_whatsapp TEXT,
    country TEXT,
    source_domain TEXT,
    utm_source TEXT,
    utm_campaign TEXT,
    service_id UUID REFERENCES services(id),
    service_title_snapshot TEXT,
    stripe_session_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_payment_intent TEXT,
    amount NUMERIC,
    currency TEXT DEFAULT 'USD',
    refund_status refund_status DEFAULT 'none',
    status order_status DEFAULT 'pending',
    notes TEXT,
    assigned_to TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. LEADS
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT NOT NULL,
    customer_whatsapp TEXT,
    source_domain TEXT,
    created_from TEXT,
    service_id UUID REFERENCES services(id),
    recommended_service_id UUID REFERENCES services(id),
    score NUMERIC,
    quiz_answers JSONB,
    status lead_status DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. INDEXES
CREATE INDEX idx_services_visible ON services(visible_on, is_active);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_leads_email ON leads(email);

-- 7. TRIGGERS (CRITICAL FOR ADMIN OS)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 8. RLS POLICIES
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Services: public read active, admin manage
CREATE POLICY "Anyone can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage services" ON services FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::user_role));

-- Service Bundles: public read, admin manage
CREATE POLICY "Anyone can read service bundles" ON service_bundles FOR SELECT USING (true);
CREATE POLICY "Admins manage service bundles" ON service_bundles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::user_role));

-- Orders: admin/agent manage
CREATE POLICY "Staff manage orders" ON orders FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'agent'::user_role));

-- Leads: anon can insert, staff can read
CREATE POLICY "Anyone can create leads" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff read leads" ON leads FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'agent'::user_role));
