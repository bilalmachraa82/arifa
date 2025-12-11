-- Create enum for activity types
CREATE TYPE lead_activity_type AS ENUM ('call', 'email', 'note', 'meeting', 'whatsapp', 'status_change');

-- Create lead_activities table
CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type lead_activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_created_at ON public.lead_activities(created_at DESC);
CREATE INDEX idx_lead_activities_type ON public.lead_activities(activity_type);

-- Enable RLS
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can manage activities
CREATE POLICY "Admins can view all activities"
ON public.lead_activities FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert activities"
ON public.lead_activities FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update activities"
ON public.lead_activities FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete activities"
ON public.lead_activities FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add audit trigger
CREATE TRIGGER audit_lead_activities
AFTER INSERT OR UPDATE OR DELETE ON public.lead_activities
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();