-- Fix RLS policies for leads table - make them PERMISSIVE instead of RESTRICTIVE
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Fix RLS policies for newsletter_subscribers table
DROP POLICY IF EXISTS "Admins can manage subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Admins can view all subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage subscribers" 
ON public.newsletter_subscribers 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);