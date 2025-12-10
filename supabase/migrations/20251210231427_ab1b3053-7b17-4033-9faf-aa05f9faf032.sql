-- =============================================
-- FASE 2: Projetos e Blog Posts
-- =============================================

-- Tabela de Projetos do Portfolio
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  segment TEXT, -- privado, empresa, investidor
  location TEXT,
  area TEXT,
  year TEXT,
  status TEXT DEFAULT 'Em projeto',
  description TEXT,
  full_description TEXT,
  featured_image TEXT,
  images TEXT[], -- Array de URLs
  client_id UUID REFERENCES public.profiles(id),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Artigos do Blog
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id),
  read_time TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Subscrições Newsletter
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies para Projects
-- =============================================

-- Todos podem ver projetos publicados
CREATE POLICY "Anyone can view published projects"
ON public.projects FOR SELECT
USING (is_published = true);

-- Admins podem ver todos os projetos
CREATE POLICY "Admins can view all projects"
ON public.projects FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem inserir projetos
CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins podem atualizar projetos
CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem eliminar projetos
CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Clientes podem ver os próprios projetos
CREATE POLICY "Clients can view own projects"
ON public.projects FOR SELECT
USING (client_id = auth.uid());

-- =============================================
-- RLS Policies para Blog Posts
-- =============================================

-- Todos podem ver posts publicados
CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (is_published = true);

-- Admins podem ver todos os posts
CREATE POLICY "Admins can view all posts"
ON public.blog_posts FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem inserir posts
CREATE POLICY "Admins can insert posts"
ON public.blog_posts FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins podem atualizar posts
CREATE POLICY "Admins can update posts"
ON public.blog_posts FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem eliminar posts
CREATE POLICY "Admins can delete posts"
ON public.blog_posts FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS Policies para Newsletter
-- =============================================

-- Qualquer pessoa pode subscrever
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

-- Admins podem ver todas as subscrições
CREATE POLICY "Admins can view all subscribers"
ON public.newsletter_subscribers FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem gerir subscrições
CREATE POLICY "Admins can manage subscribers"
ON public.newsletter_subscribers FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Triggers para updated_at
-- =============================================

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Dados de exemplo para Portfolio
-- =============================================

INSERT INTO public.projects (title, slug, category, segment, location, area, year, status, description, featured_image, is_featured, is_published) VALUES
('Residência Costa Nova', 'residencia-costa-nova', 'Residencial', 'privado', 'Aveiro, Portugal', '320 m²', '2024', 'Em construção', 'Projeto de habitação unifamiliar com vista para a ria de Aveiro. Design contemporâneo integrado na paisagem natural.', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true, true),
('Sede Empresa Tech', 'sede-empresa-tech', 'Corporativo', 'empresa', 'Lisboa, Portugal', '2.500 m²', '2023', 'Concluído', 'Espaço de trabalho moderno e sustentável para empresa de tecnologia. Certificação LEED Gold.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true, true),
('Empreendimento Tejo Gardens', 'empreendimento-tejo-gardens', 'Multi-familiar', 'investidor', 'Oeiras, Portugal', '8.000 m²', '2024', 'Em projeto', 'Condomínio de luxo com 24 apartamentos e áreas comuns premium. ROI projetado de 12%.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', true, true),
('Hotel Boutique Alfama', 'hotel-boutique-alfama', 'Hotelaria', 'investidor', 'Lisboa, Portugal', '1.800 m²', '2023', 'Concluído', 'Reabilitação de edifício histórico em hotel boutique de 5 estrelas. Preservação do património com design contemporâneo.', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', false, true),
('Moradia Serra da Estrela', 'moradia-serra-estrela', 'Residencial', 'privado', 'Covilhã, Portugal', '280 m²', '2024', 'Em construção', 'Casa de montanha com design bioclimático e materiais locais. Integração total na paisagem serrana.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', false, true),
('Centro Logístico Verde', 'centro-logistico-verde', 'Industrial', 'empresa', 'Setúbal, Portugal', '15.000 m²', '2024', 'Em projeto', 'Armazém logístico net-zero com painéis solares e sistema de gestão energética inteligente.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', false, true);

-- =============================================
-- Dados de exemplo para Blog
-- =============================================

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, featured_image, read_time, is_featured, is_published, published_at) VALUES
('Tendências de Arquitetura Sustentável para 2024', 'tendencias-arquitetura-sustentavel-2024', 'Descubra as principais tendências que estão a transformar o setor da construção sustentável em Portugal e no mundo.', 'A sustentabilidade deixou de ser uma opção para se tornar uma necessidade no setor da construção. Em 2024, vemos várias tendências emergentes que prometem revolucionar a forma como projetamos e construímos...', 'Sustentabilidade', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', '5 min', true, true, now()),
('Como o BIM Está a Revolucionar a Construção', 'bim-revolucionar-construcao', 'O Building Information Modeling está a transformar projetos de arquitetura, engenharia e construção. Saiba como esta tecnologia pode beneficiar o seu projeto.', 'O BIM representa uma mudança de paradigma na forma como a indústria da construção opera. Mais do que um software, é uma metodologia que permite a colaboração integrada entre todas as disciplinas envolvidas num projeto...', 'Tecnologia', 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', '7 min', true, true, now()),
('Guia: Processo de Licenciamento em Portugal', 'guia-licenciamento-portugal', 'Tudo o que precisa saber sobre o processo de licenciamento de obras em Portugal: prazos, documentos e dicas práticas.', 'O processo de licenciamento de obras em Portugal pode parecer complexo, mas com a informação certa, torna-se muito mais simples de navegar. Neste guia completo, explicamos passo a passo...', 'Legislação', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', '10 min', false, true, now()),
('Design Bioclimático: Conforto Natural', 'design-bioclimatico-conforto-natural', 'Como projetar espaços que aproveitam os recursos naturais para maximizar o conforto e minimizar o consumo energético.', 'O design bioclimático é uma abordagem que considera as condições climáticas locais como ponto de partida para o projeto arquitetónico. O objetivo é criar edifícios que respondam naturalmente ao ambiente...', 'Design', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', '6 min', false, true, now());