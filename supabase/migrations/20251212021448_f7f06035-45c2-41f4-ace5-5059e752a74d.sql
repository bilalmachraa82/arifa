-- Create table for project milestones
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase TEXT NOT NULL DEFAULT 'study',
  name TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  completed_date DATE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- Admins can manage all milestones
CREATE POLICY "Admins can manage all milestones"
ON public.project_milestones
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Clients can view milestones of their projects
CREATE POLICY "Clients can view milestones of their projects"
ON public.project_milestones
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_milestones.project_id
    AND p.client_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_project_milestones_project_id ON public.project_milestones(project_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_project_milestones_updated_at
BEFORE UPDATE ON public.project_milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for milestones
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_milestones;