-- Drop and recreate to avoid conflicts
DROP TRIGGER IF EXISTS audit_projects ON public.projects;
DROP TRIGGER IF EXISTS audit_client_documents ON public.client_documents;
DROP TRIGGER IF EXISTS audit_client_messages ON public.client_messages;
DROP TRIGGER IF EXISTS audit_leads ON public.leads;
DROP TRIGGER IF EXISTS audit_quotes ON public.quotes;
DROP TRIGGER IF EXISTS audit_contracts ON public.contracts;
DROP TRIGGER IF EXISTS audit_project_milestones ON public.project_milestones;
DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;

CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_client_documents AFTER INSERT OR UPDATE OR DELETE ON public.client_documents FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_client_messages AFTER INSERT OR UPDATE OR DELETE ON public.client_messages FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_leads AFTER INSERT OR UPDATE OR DELETE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_quotes AFTER INSERT OR UPDATE OR DELETE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_contracts AFTER INSERT OR UPDATE OR DELETE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_project_milestones AFTER INSERT OR UPDATE OR DELETE ON public.project_milestones FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();