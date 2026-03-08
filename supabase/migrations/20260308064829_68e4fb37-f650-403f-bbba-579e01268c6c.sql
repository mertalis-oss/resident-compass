
-- Services table for dynamic service pages
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  hero_image_url text,
  pain_points text[],
  value_propositions text[],
  process_steps jsonb,
  trust_points text[],
  cta_text text DEFAULT 'Begin Your Journey',
  seo_title text,
  seo_description text,
  schema_type text DEFAULT 'Service',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Packages for each service
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric,
  currency text DEFAULT 'USD',
  features text[],
  is_stripe_enabled boolean DEFAULT false,
  stripe_payment_url text,
  is_featured boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Anyone can read active services
CREATE POLICY "Anyone can read active services" ON services FOR SELECT USING (is_active = true);
-- Admins manage services
CREATE POLICY "Admins manage services" ON services FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Anyone can read packages
CREATE POLICY "Anyone can read packages" ON packages FOR SELECT USING (true);
-- Admins manage packages
CREATE POLICY "Admins manage packages" ON packages FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Seed initial services
INSERT INTO services (slug, title, subtitle, description, seo_title, seo_description, schema_type, sort_order) VALUES
('dtv-thailand', 'Digital Nomad Visa (DTV)', 'Thailand''s 5-Year Multi-Entry Visa for Remote Professionals', 'The DTV program is Thailand''s landmark visa for digital nomads, remote workers, and freelancers. 5-year validity with multiple entries, designed for location-independent professionals seeking a strategic base in Southeast Asia.', 'Thailand Digital Nomad Visa (DTV) | Plan B Asia', 'Apply for Thailand''s 5-year Digital Nomad Visa. Expert guidance for remote workers and freelancers relocating to Thailand.', 'Service', 1),
('thailand-retreat', 'Wellness & Medical Visa', 'Premium Healthcare & Wellness Relocation', 'Access Thailand''s world-class medical infrastructure and wellness ecosystem. From medical tourism to long-term wellness-focused residency, our program connects you with accredited hospitals, luxury wellness resorts, and specialist practitioners.', 'Thailand Wellness & Medical Visa | Plan B Asia', 'Thailand wellness and medical visa program. Premium healthcare access and wellness-focused relocation for global citizens.', 'Service', 2),
('mice-thailand', 'Corporate Retreats (MICE)', 'Strategic Business Events in Southeast Asia', 'Leverage Thailand''s MICE visa program for corporate retreats, conferences, and team-building experiences. Full event logistics, visa facilitation, and luxury venue coordination for organizations seeking impactful offsite experiences.', 'Corporate Retreats Thailand MICE | Plan B Asia', 'MICE visa program for corporate retreats in Thailand. Full logistics, visa facilitation, and luxury venue coordination.', 'Service', 3),
('ha-giang-motor-expedition', 'Hà Giang Motor Expedition', 'Vietnam''s Most Spectacular Mountain Road Journey', 'An exclusive guided motorcycle expedition through Vietnam''s Hà Giang province — dramatic limestone karst landscapes, minority village stays, and one of the most breathtaking road journeys in Southeast Asia.', 'Hà Giang Motor Expedition Vietnam | Plan B Asia', 'Guided motorcycle expedition through Vietnam''s Hà Giang province. Dramatic landscapes and cultural immersion.', 'Service', 4);
