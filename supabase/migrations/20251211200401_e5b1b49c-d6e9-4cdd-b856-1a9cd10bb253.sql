-- Add attachments column to client_messages table
ALTER TABLE public.client_messages 
ADD COLUMN attachments jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.client_messages.attachments IS 'Array of attachment objects with url, name, size, and type';