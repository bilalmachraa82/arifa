
-- Odoo Contracts table
CREATE TABLE public.odoo_contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  external_id text,
  contract_number text,
  title text NOT NULL,
  description text,
  total_amount numeric DEFAULT 0,
  paid_amount numeric DEFAULT 0,
  currency text DEFAULT 'EUR',
  start_date date,
  end_date date,
  status text DEFAULT 'active',
  raw_data jsonb DEFAULT '{}'::jsonb,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(external_id)
);

ALTER TABLE public.odoo_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all odoo_contracts"
  ON public.odoo_contracts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view odoo_contracts for their projects"
  ON public.odoo_contracts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.id = odoo_contracts.project_id AND p.client_id = auth.uid()
  ));

-- Odoo Invoices table
CREATE TABLE public.odoo_invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  contract_id uuid REFERENCES public.odoo_contracts(id) ON DELETE SET NULL,
  external_id text,
  invoice_number text,
  description text,
  amount numeric NOT NULL DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'EUR',
  issue_date date,
  due_date date,
  payment_date date,
  payment_status text DEFAULT 'pending',
  raw_data jsonb DEFAULT '{}'::jsonb,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(external_id)
);

ALTER TABLE public.odoo_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all odoo_invoices"
  ON public.odoo_invoices FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view odoo_invoices for their projects"
  ON public.odoo_invoices FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.id = odoo_invoices.project_id AND p.client_id = auth.uid()
  ));

-- DALUX Documents table
CREATE TABLE public.dalux_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  external_id text,
  title text NOT NULL,
  description text,
  document_type text DEFAULT 'plan',
  file_url text,
  thumbnail_url text,
  version text,
  phase text,
  raw_data jsonb DEFAULT '{}'::jsonb,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(external_id)
);

ALTER TABLE public.dalux_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all dalux_documents"
  ON public.dalux_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view dalux_documents for their projects"
  ON public.dalux_documents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.id = dalux_documents.project_id AND p.client_id = auth.uid()
  ));

-- DALUX Models table (3D/BIM)
CREATE TABLE public.dalux_models (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  external_id text,
  name text NOT NULL,
  description text,
  model_type text DEFAULT 'ifc',
  file_url text,
  viewer_url text,
  thumbnail_url text,
  file_size bigint,
  raw_data jsonb DEFAULT '{}'::jsonb,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(external_id)
);

ALTER TABLE public.dalux_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all dalux_models"
  ON public.dalux_models FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view dalux_models for their projects"
  ON public.dalux_models FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.id = dalux_models.project_id AND p.client_id = auth.uid()
  ));

-- Add audit triggers
CREATE TRIGGER audit_odoo_contracts AFTER INSERT OR UPDATE OR DELETE ON public.odoo_contracts FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_odoo_invoices AFTER INSERT OR UPDATE OR DELETE ON public.odoo_invoices FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_dalux_documents AFTER INSERT OR UPDATE OR DELETE ON public.dalux_documents FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_dalux_models AFTER INSERT OR UPDATE OR DELETE ON public.dalux_models FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Add updated_at triggers
CREATE TRIGGER update_odoo_contracts_updated_at BEFORE UPDATE ON public.odoo_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_odoo_invoices_updated_at BEFORE UPDATE ON public.odoo_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dalux_documents_updated_at BEFORE UPDATE ON public.dalux_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dalux_models_updated_at BEFORE UPDATE ON public.dalux_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
