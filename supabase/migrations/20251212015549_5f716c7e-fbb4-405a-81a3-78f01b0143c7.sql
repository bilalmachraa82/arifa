-- Create blog_categories table
CREATE TABLE public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert existing categories
INSERT INTO public.blog_categories (name, slug) VALUES
  ('Arquitetura', 'arquitetura'),
  ('Sustentabilidade', 'sustentabilidade'),
  ('Design', 'design'),
  ('Tendências', 'tendencias'),
  ('Projetos', 'projetos');

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories
CREATE POLICY "Anyone can read categories" ON public.blog_categories
  FOR SELECT USING (true);

-- Admins can insert categories
CREATE POLICY "Admins can insert categories" ON public.blog_categories
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update categories
CREATE POLICY "Admins can update categories" ON public.blog_categories
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete categories
CREATE POLICY "Admins can delete categories" ON public.blog_categories
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));