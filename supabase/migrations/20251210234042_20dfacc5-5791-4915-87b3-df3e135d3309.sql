-- Enable realtime for client_messages table
ALTER TABLE public.client_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_messages;