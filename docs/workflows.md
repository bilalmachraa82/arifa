# Development Workflows

## Adding a new page component

1. Create component in `src/pages/YourPage.tsx`
2. Add route in `App.tsx`: `<Route path="/your-page" element={<YourPage />} />`
3. Add translations to `LanguageContext.tsx`
4. Add navigation link if needed in `components/layout/Navbar.tsx`

## Database changes

1. Create migration: `supabase migration new your_change`
2. Edit SQL in `supabase/migrations/`
3. Apply: `supabase db push`
4. Regenerate types: `supabase gen types typescript --local > src/integrations/supabase/types.ts`

## Working with Supabase

```tsx
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Query
const { data } = await supabase.from('projects').select('*').eq('is_published', true);

// Insert
const { data: newLead } = await supabase.from('leads').insert({
  email: 'user@example.com',
  name: 'John Doe',
}).select().single();
```

## Component patterns

- Use shadcn/ui components from `@/components/ui/` as building blocks
- Follow existing component structure in feature folders
- Use `useLanguage()` for all user-facing text
- Use `useAuth()` for auth-dependent logic
- Server state via TanStack Query's `useQuery` and `useMutation`

## Edge Function development

Edge functions use Deno runtime. Located in `supabase/functions/`.

```bash
# Create new function
supabase functions new my-function

# Test locally
supabase functions serve my-function

# Deploy
supabase functions deploy my-function
```

## Supabase RLS

RLS (Row Level Security) is enabled. Always check policies when modifying DB access.
Auth events are logged for GDPR compliance — do not remove audit logging.
