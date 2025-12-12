-- Create document_folders table for hierarchical folder navigation
CREATE TABLE public.document_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.document_folders(id) ON DELETE CASCADE,
  path TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add folder_path to client_documents
ALTER TABLE public.client_documents 
ADD COLUMN folder_id UUID REFERENCES public.document_folders(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.document_folders ENABLE ROW LEVEL SECURITY;

-- RLS policies for document_folders
CREATE POLICY "Admins can manage all folders"
ON public.document_folders
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own folders"
ON public.document_folders
FOR SELECT
USING (auth.uid() = client_id);

-- Trigger for updated_at
CREATE TRIGGER update_document_folders_updated_at
BEFORE UPDATE ON public.document_folders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_document_folders_client_id ON public.document_folders(client_id);
CREATE INDEX idx_document_folders_parent_id ON public.document_folders(parent_id);
CREATE INDEX idx_client_documents_folder_id ON public.client_documents(folder_id);