-- 1. Criar função que insere milestones default quando projeto é criado com client_id
CREATE OR REPLACE FUNCTION public.create_default_milestones()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Só criar se o projeto tem client_id (é um projeto real, não portfolio)
  IF NEW.client_id IS NOT NULL AND 
     (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.client_id IS NULL)) THEN
    
    -- Verificar se já existem milestones para este projeto
    IF NOT EXISTS (SELECT 1 FROM project_milestones WHERE project_id = NEW.id) THEN
      
      -- Fase: Estudo (study)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'study', 'Reunião inicial', 'Levantamento de requisitos e expectativas', 0),
        (NEW.id, 'study', 'Análise do terreno', 'Visita técnica e avaliação do local', 1),
        (NEW.id, 'study', 'Estudo de viabilidade', 'Análise técnica e financeira', 2),
        (NEW.id, 'study', 'Proposta comercial', 'Apresentação de orçamento e cronograma', 3);
      
      -- Fase: Projeto (design)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'design', 'Estudo prévio', 'Conceito e ideias iniciais', 0),
        (NEW.id, 'design', 'Anteprojeto', 'Desenvolvimento da proposta', 1),
        (NEW.id, 'design', 'Projeto de execução', 'Detalhes técnicos completos', 2),
        (NEW.id, 'design', 'Licenciamento', 'Submissão às autoridades', 3);
      
      -- Fase: Construção (construction)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'construction', 'Preparação do terreno', 'Limpeza e fundações', 0),
        (NEW.id, 'construction', 'Estrutura', 'Construção estrutural', 1),
        (NEW.id, 'construction', 'Acabamentos', 'Revestimentos e detalhes', 2),
        (NEW.id, 'construction', 'Instalações', 'Elétrica, canalização, AVAC', 3);
      
      -- Fase: Finalização (finishing)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'finishing', 'Limpeza final', 'Preparação para entrega', 0),
        (NEW.id, 'finishing', 'Inspeções', 'Verificações de qualidade', 1),
        (NEW.id, 'finishing', 'Correções finais', 'Ajustes e afinações', 2);
      
      -- Fase: Entrega (delivery)
      INSERT INTO project_milestones (project_id, phase, name, description, sort_order)
      VALUES 
        (NEW.id, 'delivery', 'Vistoria final', 'Validação com o cliente', 0),
        (NEW.id, 'delivery', 'Documentação', 'Entrega de telas finais', 1),
        (NEW.id, 'delivery', 'Entrega das chaves', 'Conclusão do projeto', 2);
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2. Criar trigger no INSERT e UPDATE da tabela projects
DROP TRIGGER IF EXISTS trigger_create_default_milestones ON projects;
CREATE TRIGGER trigger_create_default_milestones
  AFTER INSERT OR UPDATE OF client_id ON projects
  FOR EACH ROW
  EXECUTE FUNCTION create_default_milestones();