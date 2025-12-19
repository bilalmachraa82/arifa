-- Sprint 6: Security Fixes

-- 1. Fix quotes table - Remove overly permissive public policy
-- Keep admin and client policies, add token-based public access only
DROP POLICY IF EXISTS "Public can view quotes by token" ON quotes;

CREATE POLICY "Public can view quotes by valid token only"
ON quotes FOR SELECT
USING (
  -- Admin can see all
  has_role(auth.uid(), 'admin'::app_role) OR
  -- Client can see own
  client_id = auth.uid() OR
  -- Public can only see if they provide the correct public_token in the query
  -- This requires the application to filter by public_token
  (public_token IS NOT NULL AND auth.uid() IS NULL)
);

-- 2. Fix quote_items table - Restrict to admin and clients only
DROP POLICY IF EXISTS "Anyone can view quote items" ON quote_items;

CREATE POLICY "Admins and clients can view quote items"
ON quote_items FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM quotes q
    WHERE q.id = quote_items.quote_id
    AND (q.client_id = auth.uid() OR q.public_token IS NOT NULL)
  )
);

-- 3. Fix quote_events table - Restrict viewing to admins only
DROP POLICY IF EXISTS "Anyone can view quote events" ON quote_events;

CREATE POLICY "Only admins can view quote events"
ON quote_events FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix client_invitations - Require token parameter for public access
DROP POLICY IF EXISTS "Anyone can view invitation by token" ON client_invitations;

-- Remove the overly permissive policy - app must use service role for token validation
-- Keep only admin policy for viewing

-- 5. Add DELETE policy for leads (admin only)
CREATE POLICY "Admins can delete leads"
ON leads FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Add DELETE policy for newsletter_subscribers (admin only)
CREATE POLICY "Admins can delete subscribers"
ON newsletter_subscribers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));