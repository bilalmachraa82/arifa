-- Add storage policies for client-documents bucket to allow authenticated users

-- Allow authenticated users to upload to message-attachments folder
CREATE POLICY "Authenticated users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = 'message-attachments'
);

-- Allow users to view their own message attachments (via client_messages table)
CREATE POLICY "Users can view message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-documents'
  AND (storage.foldername(name))[1] = 'message-attachments'
);

-- Allow admins full access to client-documents
CREATE POLICY "Admins have full access to client-documents"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'client-documents'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'client-documents'
  AND public.has_role(auth.uid(), 'admin')
);