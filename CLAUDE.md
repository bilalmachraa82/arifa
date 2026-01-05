# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ARIFA Core Stakeholder Portal is a bilingual (PT/EN) architecture firm platform with three interfaces:
- **Public site**: Landing pages, portfolio showcase, blog, contact forms
- **Client dashboard**: Project tracking, documents, messages, budgets, contracts
- **Admin dashboard**: Lead management, project management, KPIs, audit logs

Built with Lovable.dev as a React + Vite + TypeScript application using Supabase for backend/auth/storage.

## Quick Start

```bash
npm i              # Install dependencies
npm run dev        # Start dev server (port 8080)
npm run build      # Production build
npm run lint       # ESLint
```

Environment variables required in `.env`:
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

## Architecture

### Frontend Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui primitives (56+ components)
│   ├── admin/          # Admin dashboard components
│   ├── client/         # Client portal components
│   ├── auth/           # Login/signup forms
│   └── [feature]/      # Other feature-based folders
├── contexts/           # Global state providers
│   ├── AuthContext.tsx     # Supabase auth state
│   └── LanguageContext.tsx # i18n translations (PT/EN)
├── hooks/              # Custom React hooks
├── integrations/supabase/  # Supabase client + types
├── lib/                # Utilities (cn() for className merging)
├── pages/              # Route components (22 pages)
└── App.tsx             # Root with routes + providers
```

### State Management

- **Auth**: `AuthContext` wraps the app, provides `useAuth()` hook
- **Language**: `LanguageContext` with inline translation object (not external i18n lib)
- **Server state**: TanStack Query for caching/refetching
- **Forms**: React Hook Form + Zod validation

### Authentication & Authorization

- Supabase Auth (email/password)
- Roles defined in `user_roles` table: `admin`, `client`, `investor`
- Auth events logged to `audit_logs` table via `log_auth_event()` RPC
- Use `has_role(_user_id, _role)` RPC to check permissions

### Database Schema (Key Tables)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles linked to auth.users |
| `user_roles` | Role assignments |
| `leads` | Contact form submissions with AI scoring |
| `projects` | Architecture projects |
| `project_milestones` | Project timeline milestones |
| `project_photos` | Progress photos by phase |
| `project_budgets` | Budget tracking |
| `client_documents` | Document management with versioning |
| `client_messages` | Admin-client messaging |
| `quotes` | Quote proposals with items |
| `contracts` | Boldsign e-signature integration |
| `blog_posts` | Blog content |
| `audit_logs` | All DB changes tracked |

Full types in `src/integrations/supabase/types.ts`.

### Edge Functions (Deno)

Located in `supabase/functions/`:

| Function | Purpose | JWT Required |
|----------|---------|--------------|
| `send-contact-email` | Contact form submissions | No |
| `send-welcome-email` | New user onboarding | No |
| `ai-chat` | AI chatbot for public site | No |
| `score-lead` | Lead scoring algorithm | No |
| `generate-quote-pdf` | PDF generation for quotes | Yes |
| `generate-project-report` | Project reports | Yes |
| `create-boldsign-contract` | Contract creation via Boldsign | Yes |
| `send-milestone-notification` | Milestone alerts | No |
| `generate-weekly-update` | AI weekly project summary | Yes |
| `sitemap` | SEO sitemap | No |

Email provider: Resend (requires `RESEND_API_KEY` env var).

### Routing

React Router DOM with routes defined in `App.tsx`. Key routes:
- `/` - Landing page
- `/portfolio` - Project showcase
- `/blog` - Blog listing
- `/contacto` - Contact form
- `/auth` - Login/signup
- `/client-dashboard` - Client portal (protected)
- `/admin-dashboard` - Admin panel (admin only)

### Styling

- Tailwind CSS with custom design tokens in `tailwind.config.ts`
- CSS variables for theming in `src/index.css`
- Use `cn()` from `@/lib/utils` for conditional className merging
- ARIFA brand colors: Coral (primary), Yellow, Blue, Gray scale
- Dark mode support via CSS variables

### Internationalization

Translations are inline in `LanguageContext.tsx`:
```tsx
const { t, language } = useLanguage();
t("nav.home") // "Início" or "Home"
```

To add a new translation, add the key to both `translations.pt` and `translations.en` objects.

### PWA Configuration

- Service worker with cache strategies (cache-first for assets, network-first for API)
- Offline fallback page
- Configured in `vite.config.ts` with `vite-plugin-pwa`

## Development Workflow

### Adding a new page component

1. Create component in `src/pages/YourPage.tsx`
2. Add route in `App.tsx`: `<Route path="/your-page" element={<YourPage />} />`
3. Add translations to `LanguageContext.tsx`
4. Add navigation link if needed in `components/layout/Navbar.tsx`

### Database changes

1. Create migration: `supabase migration new your_change`
2. Edit SQL in `supabase/migrations/`
3. Apply: `supabase db push`
4. Regenerate types: `supabase gen types typescript --local > src/integrations/supabase/types.ts`

### Working with Supabase

```tsx
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Query
const { data } = await supabase.from('projects').select('*').eq('is_published', true);

// Insert
const { data: newLead } = await supabase.from('leads').insert({
  email: 'user@example.com',
  name: 'John Doe',
  // ...
}).select().single();
```

### Component patterns

- Use shadcn/ui components from `@/components/ui/` as building blocks
- Follow existing component structure in feature folders
- Use `useLanguage()` for all user-facing text
- Use `useAuth()` for auth-dependent logic
- Server state via TanStack Query's `useQuery` and `useMutation`

## Important Notes

- No testing framework is currently configured
- TypeScript is configured with relaxed settings (`noImplicitAny: false`)
- The app was originally built with Lovable.dev - some patterns may reflect that origin
- RLS (Row Level Security) is enabled on Supabase - always check policies when modifying DB access
- Auth events are logged for GDPR compliance - do not remove
