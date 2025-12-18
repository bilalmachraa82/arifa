-- Create contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  document_url TEXT,
  boldsign_document_id TEXT,
  boldsign_signing_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  signed_document_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all contracts"
  ON public.contracts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own contracts"
  ON public.contracts FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Clients can update their own pending contracts"
  ON public.contracts FOR UPDATE
  USING (client_id = auth.uid() AND status = 'pending');

-- Trigger for updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add audit trigger
CREATE TRIGGER contracts_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.contracts;