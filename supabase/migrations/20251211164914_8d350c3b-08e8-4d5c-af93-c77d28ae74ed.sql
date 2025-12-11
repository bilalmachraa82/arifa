-- Create document_versions table for tracking file versions
CREATE TABLE public.document_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.client_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_versions_created_at ON public.document_versions(created_at DESC);

-- Enable RLS
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- Clients can view versions of their documents
CREATE POLICY "Clients can view versions of their documents"
ON public.document_versions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.client_documents cd
    WHERE cd.id = document_versions.document_id
    AND cd.client_id = auth.uid()
  )
);

-- Admins can view all versions
CREATE POLICY "Admins can view all document versions"
ON public.document_versions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert versions
CREATE POLICY "Admins can insert document versions"
ON public.document_versions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete versions
CREATE POLICY "Admins can delete document versions"
ON public.document_versions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add current_version column to client_documents to track latest version
ALTER TABLE public.client_documents 
ADD COLUMN current_version INTEGER NOT NULL DEFAULT 1;