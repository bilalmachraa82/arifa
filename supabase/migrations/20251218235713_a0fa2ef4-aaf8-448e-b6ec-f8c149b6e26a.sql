-- Drop existing policies for message attachments
DROP POLICY IF EXISTS "Authenticated users can upload message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view message attachments" ON storage.objects;

-- Create new policies with user-scoped paths

-- Allow authenticated users to upload to their own message-attachments folder
CREATE POLICY "Users can upload their own message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = 'message-attachments'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow admins to view all message attachments
CREATE POLICY "Admins can view all message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = 'message-attachments'
  AND has_role(auth.uid(), 'admin')
);

-- Allow clients to view message attachments in conversations they're part of
CREATE POLICY "Clients can view their conversation attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = 'message-attachments'
  AND (
    -- User is the owner of the attachment
    (storage.foldername(name))[2] = auth.uid()::text
    OR
    -- User is the client_id in a message that contains this attachment
    EXISTS (
      SELECT 1 FROM client_messages 
      WHERE client_id = auth.uid()
      AND attachments::text LIKE '%' || storage.filename(name) || '%'
    )
  )
);