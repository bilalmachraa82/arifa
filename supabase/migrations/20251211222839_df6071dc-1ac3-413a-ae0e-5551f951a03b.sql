-- Create enum for audit actions
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  table_name TEXT NOT NULL,
  record_id TEXT,
  action audit_action NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_record_id ON public.audit_logs(record_id);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can view, no one can modify or delete (immutability)
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Create the generic audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  changed TEXT[];
  current_user_id UUID;
  current_user_email TEXT;
  key_record TEXT;
BEGIN
  -- Get user_id from auth context
  current_user_id := auth.uid();
  
  -- Get email from auth.users if available
  IF current_user_id IS NOT NULL THEN
    SELECT email INTO current_user_email 
    FROM auth.users WHERE id = current_user_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    -- Get record id
    key_record := OLD.id::TEXT;
    
    INSERT INTO audit_logs (user_id, user_email, table_name, record_id, action, old_values)
    VALUES (current_user_id, current_user_email, TG_TABLE_NAME, key_record, 'DELETE', old_data);
    RETURN OLD;
    
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    key_record := NEW.id::TEXT;
    
    -- Identify changed fields
    SELECT array_agg(o.key) INTO changed
    FROM jsonb_each(old_data) o
    WHERE o.value IS DISTINCT FROM (new_data -> o.key);
    
    INSERT INTO audit_logs (user_id, user_email, table_name, record_id, action, old_values, new_values, changed_fields)
    VALUES (current_user_id, current_user_email, TG_TABLE_NAME, key_record, 'UPDATE', old_data, new_data, changed);
    RETURN NEW;
    
  ELSIF TG_OP = 'INSERT' THEN
    new_data := to_jsonb(NEW);
    key_record := NEW.id::TEXT;
    
    INSERT INTO audit_logs (user_id, user_email, table_name, record_id, action, new_values)
    VALUES (current_user_id, current_user_email, TG_TABLE_NAME, key_record, 'INSERT', new_data);
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create function to log auth events (login/logout)
CREATE OR REPLACE FUNCTION public.log_auth_event(
  _action audit_action,
  _metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT email INTO current_user_email 
    FROM auth.users WHERE id = current_user_id;
  END IF;
  
  INSERT INTO audit_logs (user_id, user_email, table_name, action, metadata)
  VALUES (current_user_id, current_user_email, 'auth', _action, _metadata);
END;
$$;

-- Apply triggers to critical tables

-- Profiles
CREATE TRIGGER audit_profiles
AFTER INSERT OR UPDATE OR DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Leads
CREATE TRIGGER audit_leads
AFTER INSERT OR UPDATE OR DELETE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Client Messages
CREATE TRIGGER audit_client_messages
AFTER INSERT OR UPDATE OR DELETE ON public.client_messages
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Client Documents
CREATE TRIGGER audit_client_documents
AFTER INSERT OR UPDATE OR DELETE ON public.client_documents
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Projects
CREATE TRIGGER audit_projects
AFTER INSERT OR UPDATE OR DELETE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Blog Posts
CREATE TRIGGER audit_blog_posts
AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- User Roles
CREATE TRIGGER audit_user_roles
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Document Versions
CREATE TRIGGER audit_document_versions
AFTER INSERT OR UPDATE OR DELETE ON public.document_versions
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Client Invitations
CREATE TRIGGER audit_client_invitations
AFTER INSERT OR UPDATE OR DELETE ON public.client_invitations
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();