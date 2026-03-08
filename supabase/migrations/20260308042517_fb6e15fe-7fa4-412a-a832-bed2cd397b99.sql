
-- Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'agent', 'client');
CREATE TYPE public.enrollment_status AS ENUM ('lead', 'applicant', 'pending_deposit', 'deposit_paid', 'doc_verification', 'filing', 'active_resident', 'refund_pending', 'refunded', 'rejected', 'archived', 'compliance_alert', 'cancelled');
CREATE TYPE public.visa_program_type AS ENUM ('dtv', 'wellness', 'mice', 'motor', 'elite', 'retirement', 'education');
CREATE TYPE public.currency_code AS ENUM ('THB', 'TRY', 'USD', 'EUR');
CREATE TYPE public.payment_provider AS ENUM ('stripe', 'manual_transfer');

-- Profiles (references auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role user_role DEFAULT 'client',
  phone text,
  preferred_language text DEFAULT 'tr',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  country text,
  interest visa_program_type,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_address text,
  consent_marketing boolean,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX leads_created_idx ON public.leads(created_at);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  description text,
  price numeric,
  currency currency_code,
  stripe_link text,
  program visa_program_type,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX products_program_idx ON public.products(program);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Enrollments
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  product_id uuid REFERENCES public.products(id),
  status enrollment_status DEFAULT 'lead',
  payment_provider payment_provider DEFAULT 'stripe',
  deposit_amount numeric,
  currency currency_code,
  stripe_customer_id text,
  payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX enrollments_user_idx ON public.enrollments(user_id);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Visa Entries
CREATE TABLE public.visa_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  country text,
  entry_date date,
  exit_date date,
  visa_type text,
  port_of_entry text,
  notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX visa_entries_user_idx ON public.visa_entries(user_id, entry_date);
ALTER TABLE public.visa_entries ENABLE ROW LEVEL SECURITY;

-- Status History
CREATE TABLE public.status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES public.enrollments(id),
  old_status enrollment_status,
  new_status enrollment_status,
  reason text,
  changed_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- Compliance Flags
CREATE TABLE public.compliance_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  product_id uuid REFERENCES public.products(id),
  reason text,
  severity text,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.compliance_flags ENABLE ROW LEVEL SECURITY;

-- Stripe Webhook Events
CREATE TABLE public.stripe_webhook_events (
  id text PRIMARY KEY,
  type text,
  processed_at timestamptz DEFAULT now()
);
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- AI Messages
CREATE TABLE public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX ai_messages_rate_idx ON public.ai_messages(user_id, created_at);
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  event_type text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
