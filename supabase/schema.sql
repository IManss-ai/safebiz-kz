-- SafeBiz KZ — Supabase Schema
-- НК РК ЗРК № 214-VIII (2026)

CREATE TABLE businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  bin_iin varchar(12) NOT NULL,
  entity_type varchar(3) CHECK (entity_type IN ('ИП', 'ТОО')),
  tax_regime varchar(20),
  oked_codes text[],
  region varchar(50),
  employee_count int DEFAULT 0,
  vat_registered boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE tax_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id),
  input_data jsonb,
  result_data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE transfer_risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id),
  score int,
  level varchar(10),
  risk_factors jsonb,
  recommendations jsonb,
  assessed_at timestamptz DEFAULT now()
);
