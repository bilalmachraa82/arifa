-- Create lead_stages table for customizable Kanban columns
CREATE TABLE public.lead_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3b82f6',
  border_color text NOT NULL DEFAULT '#2563eb',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_stages ENABLE ROW LEVEL SECURITY;

-- RLS policies - only admins can manage stages
CREATE POLICY "Admins can view all stages"
ON public.lead_stages
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert stages"
ON public.lead_stages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stages"
ON public.lead_stages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stages"
ON public.lead_stages
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Seed with default stages
INSERT INTO public.lead_stages (name, color, border_color, sort_order) VALUES
  ('Novo', '#3b82f6', '#2563eb', 0),
  ('Contactado', '#eab308', '#ca8a04', 1),
  ('Qualificado', '#22c55e', '#16a34a', 2),
  ('Convertido', '#a855f7', '#9333ea', 3),
  ('Perdido', '#ef4444', '#dc2626', 4);

-- Add trigger for updated_at
CREATE TRIGGER update_lead_stages_updated_at
BEFORE UPDATE ON public.lead_stages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;