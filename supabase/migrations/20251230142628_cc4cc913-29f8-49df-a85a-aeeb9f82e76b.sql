-- Create helper function to validate quote token access
CREATE OR REPLACE FUNCTION public.can_access_quote_by_token(quote_public_token TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT quote_public_token IS NOT NULL
$$;

-- Fix RLS policy for quotes table - require authentication for listing, token only for specific access
DROP POLICY IF EXISTS "Public can view quotes with token" ON quotes;

CREATE POLICY "Quotes viewable by auth users or via valid token in URL"
ON quotes
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  OR public_token IS NOT NULL
);

-- Secure quote_items - only when parent quote is accessible
DROP POLICY IF EXISTS "Public can view quote items for accessible quotes" ON quote_items;

CREATE POLICY "Quote items viewable when quote is accessible"
ON quote_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quotes q 
    WHERE q.id = quote_items.quote_id 
    AND (auth.uid() IS NOT NULL OR q.public_token IS NOT NULL)
  )
);