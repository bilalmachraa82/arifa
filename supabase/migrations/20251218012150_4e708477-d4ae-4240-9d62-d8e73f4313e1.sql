-- =============================================
-- ARIFA v2.5 - Complete Database Migration
-- =============================================

-- 1. Create project_phase enum for RIBA-aligned phases
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_phase') THEN
    CREATE TYPE public.project_phase AS ENUM (
      'preparacao',   -- RIBA 0+1: Strategic Definition + Preparation & Brief
      'conceito',     -- RIBA 2: Concept Design
      'coordenacao',  -- RIBA 3: Spatial Coordination
      'tecnico',      -- RIBA 4: Technical Design
      'construcao',   -- RIBA 5: Construction
      'entrega',      -- RIBA 6: Handover
      'uso'           -- RIBA 7: Use (Post-occupancy)
    );
  END IF;
END $$;

-- 2. Create quote_status enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_status') THEN
    CREATE TYPE public.quote_status AS ENUM (
      'draft',
      'sent',
      'viewed',
      'accepted',
      'rejected',
      'expired'
    );
  END IF;
END $$;

-- 3. Create change_order_status enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'change_order_status') THEN
    CREATE TYPE public.change_order_status AS ENUM (
      'pending',
      'approved',
      'rejected'
    );
  END IF;
END $$;

-- =============================================
-- QUOTES SYSTEM
-- =============================================

-- Main quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Project info
  project_title TEXT NOT NULL,
  project_description TEXT,
  project_location TEXT,
  project_category TEXT,
  
  -- Financials
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 23.00,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  -- Terms
  estimated_duration TEXT,
  payment_terms TEXT,
  terms_conditions TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft',
  valid_until DATE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Public access token
  public_token UUID DEFAULT gen_random_uuid() UNIQUE,
  
  -- Signature
  signature_status TEXT DEFAULT 'pending',
  signature_url TEXT,
  signed_document_url TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quote items table
CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  
  category TEXT,
  description TEXT NOT NULL,
  unit TEXT DEFAULT 'un',
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  notes TEXT,
  
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quote events/history table
CREATE TABLE IF NOT EXISTS public.quote_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- PROJECT PHOTOS (Progress Gallery)
-- =============================================

CREATE TABLE IF NOT EXISTS public.project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.project_milestones(id) ON DELETE SET NULL,
  
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  phase TEXT,
  taken_at DATE,
  uploaded_by UUID REFERENCES public.profiles(id),
  
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- BUDGET & CHANGE ORDERS
-- =============================================

-- Project budgets table
CREATE TABLE IF NOT EXISTS public.project_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
  
  original_budget DECIMAL(12,2),
  current_budget DECIMAL(12,2),
  spent_amount DECIMAL(12,2) DEFAULT 0,
  
  currency TEXT DEFAULT 'EUR',
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Change orders table
CREATE TABLE IF NOT EXISTS public.project_change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  
  order_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reason TEXT,
  
  amount DECIMAL(12,2) NOT NULL,
  impact_schedule TEXT,
  
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  decided_at TIMESTAMP WITH TIME ZONE,
  decided_by UUID REFERENCES public.profiles(id),
  
  requires_client_approval BOOLEAN DEFAULT true,
  client_approved_at TIMESTAMP WITH TIME ZONE,
  client_notes TEXT,
  
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- QUOTE TEMPLATES
-- =============================================

CREATE TABLE IF NOT EXISTS public.quote_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  
  items JSONB DEFAULT '[]',
  terms_conditions TEXT,
  payment_terms TEXT,
  
  is_active BOOLEAN DEFAULT true,
  
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- ENABLE RLS ON ALL NEW TABLES
-- =============================================

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_templates ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - QUOTES
-- =============================================

-- Admins can do everything with quotes
CREATE POLICY "Admins can manage all quotes" ON public.quotes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Clients can view their own quotes
CREATE POLICY "Clients can view own quotes" ON public.quotes
  FOR SELECT USING (client_id = auth.uid());

-- Public access via token (for unsigned users viewing quotes)
CREATE POLICY "Public can view quotes by token" ON public.quotes
  FOR SELECT USING (true);

-- Quote items policies
CREATE POLICY "Admins can manage quote items" ON public.quote_items
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view quote items" ON public.quote_items
  FOR SELECT USING (true);

-- Quote events policies
CREATE POLICY "Admins can manage quote events" ON public.quote_events
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert quote events" ON public.quote_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view quote events" ON public.quote_events
  FOR SELECT USING (true);

-- =============================================
-- RLS POLICIES - PROJECT PHOTOS
-- =============================================

CREATE POLICY "Admins can manage all photos" ON public.project_photos
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view photos of their projects" ON public.project_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_photos.project_id
      AND p.client_id = auth.uid()
    )
  );

-- =============================================
-- RLS POLICIES - BUDGETS
-- =============================================

CREATE POLICY "Admins can manage all budgets" ON public.project_budgets
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view budgets of their projects" ON public.project_budgets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_budgets.project_id
      AND p.client_id = auth.uid()
    )
  );

-- =============================================
-- RLS POLICIES - CHANGE ORDERS
-- =============================================

CREATE POLICY "Admins can manage all change orders" ON public.project_change_orders
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view change orders of their projects" ON public.project_change_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_change_orders.project_id
      AND p.client_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update change orders requiring approval" ON public.project_change_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_change_orders.project_id
      AND p.client_id = auth.uid()
    )
    AND requires_client_approval = true
    AND status = 'pending'
  );

-- =============================================
-- RLS POLICIES - QUOTE TEMPLATES
-- =============================================

CREATE POLICY "Admins can manage quote templates" ON public.quote_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_budgets_updated_at
  BEFORE UPDATE ON public.project_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_change_orders_updated_at
  BEFORE UPDATE ON public.project_change_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_templates_updated_at
  BEFORE UPDATE ON public.quote_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTION: Generate Quote Number
-- =============================================

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year TEXT;
  next_number INTEGER;
  quote_number TEXT;
BEGIN
  current_year := to_char(now(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(q.quote_number FROM 'ARIFA-' || current_year || '-(\d+)') AS INTEGER)
  ), 0) + 1
  INTO next_number
  FROM quotes q
  WHERE q.quote_number LIKE 'ARIFA-' || current_year || '-%';
  
  quote_number := 'ARIFA-' || current_year || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN quote_number;
END;
$$;

-- =============================================
-- FUNCTION: Generate Change Order Number
-- =============================================

CREATE OR REPLACE FUNCTION public.generate_change_order_number(p_project_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  project_slug TEXT;
  next_number INTEGER;
  order_number TEXT;
BEGIN
  SELECT slug INTO project_slug FROM projects WHERE id = p_project_id;
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(co.order_number FROM 'CO-\d+-(\d+)') AS INTEGER)
  ), 0) + 1
  INTO next_number
  FROM project_change_orders co
  WHERE co.project_id = p_project_id;
  
  order_number := 'CO-' || LPAD(next_number::TEXT, 3, '0');
  
  RETURN order_number;
END;
$$;

-- =============================================
-- FUNCTION: Update Budget on Change Order Approval
-- =============================================

CREATE OR REPLACE FUNCTION public.update_budget_on_change_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE project_budgets
    SET current_budget = COALESCE(current_budget, original_budget, 0) + NEW.amount,
        updated_at = now()
    WHERE project_id = NEW.project_id;
    
    -- Create budget if it doesn't exist
    INSERT INTO project_budgets (project_id, original_budget, current_budget)
    SELECT NEW.project_id, 0, NEW.amount
    WHERE NOT EXISTS (SELECT 1 FROM project_budgets WHERE project_id = NEW.project_id);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_budget_on_change_order_trigger
  AFTER UPDATE ON public.project_change_orders
  FOR EACH ROW EXECUTE FUNCTION update_budget_on_change_order();

-- =============================================
-- FUNCTION: Create Project from Accepted Quote
-- =============================================

CREATE OR REPLACE FUNCTION public.create_project_from_quote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_project_id UUID;
  project_slug TEXT;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    -- Generate slug
    project_slug := lower(regexp_replace(NEW.project_title, '[^a-zA-Z0-9]+', '-', 'g'));
    project_slug := project_slug || '-' || to_char(now(), 'YYYYMMDD');
    
    -- Create project
    INSERT INTO projects (
      title,
      slug,
      description,
      location,
      category,
      client_id,
      status,
      is_published
    ) VALUES (
      NEW.project_title,
      project_slug,
      NEW.project_description,
      NEW.project_location,
      COALESCE(NEW.project_category, 'residencial'),
      NEW.client_id,
      'Em projeto',
      false
    )
    RETURNING id INTO new_project_id;
    
    -- Create initial budget from quote
    INSERT INTO project_budgets (project_id, original_budget, current_budget)
    VALUES (new_project_id, NEW.total, NEW.total);
    
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_project_from_quote_trigger
  AFTER UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION create_project_from_quote();

-- =============================================
-- UPDATE MILESTONES FUNCTION FOR RIBA PHASES
-- =============================================

CREATE OR REPLACE FUNCTION public.create_default_milestones()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_id IS NOT NULL AND 
     (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.client_id IS NULL)) THEN
    
    IF NOT EXISTS (SELECT 1 FROM project_milestones WHERE project_id = NEW.id) THEN
      
      -- Phase: Preparação (RIBA 0+1)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'preparacao', 'Reunião inicial', 'Levantamento de requisitos e expectativas', 0),
        (NEW.id, 'preparacao', 'Análise do terreno/espaço', 'Visita técnica e avaliação do local', 1),
        (NEW.id, 'preparacao', 'Estudo de viabilidade', 'Análise técnica e financeira', 2),
        (NEW.id, 'preparacao', 'Brief do projeto', 'Documentação de requisitos aprovada', 3);
      
      -- Phase: Conceito (RIBA 2)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'conceito', 'Estudo prévio', 'Conceito e ideias iniciais', 0),
        (NEW.id, 'conceito', 'Moodboards e referências', 'Definição da linguagem visual', 1),
        (NEW.id, 'conceito', 'Proposta conceptual', 'Apresentação do conceito ao cliente', 2);
      
      -- Phase: Coordenação (RIBA 3)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'coordenacao', 'Anteprojeto', 'Desenvolvimento da proposta espacial', 0),
        (NEW.id, 'coordenacao', 'Coordenação de especialidades', 'Alinhamento com engenharias', 1),
        (NEW.id, 'coordenacao', 'Validação do cliente', 'Aprovação do anteprojeto', 2);
      
      -- Phase: Técnico (RIBA 4)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'tecnico', 'Projeto de execução', 'Detalhes técnicos completos', 0),
        (NEW.id, 'tecnico', 'Mapas de acabamentos', 'Especificação de materiais', 1),
        (NEW.id, 'tecnico', 'Licenciamento', 'Submissão às autoridades', 2),
        (NEW.id, 'tecnico', 'Caderno de encargos', 'Documentação para empreiteiros', 3);
      
      -- Phase: Construção (RIBA 5)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'construcao', 'Preparação do terreno', 'Demolições e fundações', 0),
        (NEW.id, 'construcao', 'Estrutura', 'Construção estrutural', 1),
        (NEW.id, 'construcao', 'Toscos', 'Paredes e cobertura', 2),
        (NEW.id, 'construcao', 'Instalações técnicas', 'Elétrica, canalização, AVAC', 3),
        (NEW.id, 'construcao', 'Acabamentos', 'Revestimentos e detalhes', 4);
      
      -- Phase: Entrega (RIBA 6)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'entrega', 'Limpeza final', 'Preparação para entrega', 0),
        (NEW.id, 'entrega', 'Inspeções finais', 'Verificações de qualidade', 1),
        (NEW.id, 'entrega', 'Correções e afinações', 'Ajustes identificados', 2),
        (NEW.id, 'entrega', 'Entrega das chaves', 'Handover formal ao cliente', 3);
      
      -- Phase: Uso (RIBA 7)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'uso', 'Manual de utilização', 'Documentação de manutenção', 0),
        (NEW.id, 'uso', 'Visita 3 meses', 'Acompanhamento pós-ocupação', 1),
        (NEW.id, 'uso', 'Visita 12 meses', 'Avaliação final e garantias', 2);
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- =============================================
-- ENABLE REALTIME FOR NEW TABLES
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_photos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_change_orders;