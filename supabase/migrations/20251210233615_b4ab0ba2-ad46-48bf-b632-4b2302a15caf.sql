-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-images', 'project-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Create storage bucket for client documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('client-documents', 'client-documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'application/zip', 'application/x-dwg', 'image/vnd.dwg']);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- RLS Policies for project-images (public read, admin write)
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'));

-- RLS Policies for blog-images (public read, admin write)
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

-- RLS Policies for client-documents (private, admin can manage, clients can view their own)
CREATE POLICY "Clients can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-documents' AND 
  (
    has_role(auth.uid(), 'admin') OR
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Admins can upload client documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-documents' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update client documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'client-documents' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete client documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'client-documents' AND has_role(auth.uid(), 'admin'));