# Architecture Reference

## Frontend Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui primitives (~54 components)
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
├── pages/              # Route components (25 pages)
└── App.tsx             # Root with routes + providers
```

## State Management

- **Auth**: `AuthContext` wraps the app, provides `useAuth()` hook
- **Language**: `LanguageContext` with inline translation object (not external i18n lib)
- **Server state**: TanStack Query for caching/refetching
- **Forms**: React Hook Form + Zod validation

## Authentication & Authorization

- Supabase Auth (email/password)
- Roles defined in `user_roles` table: `admin`, `client`, `investor`
- Auth events logged to `audit_logs` table via `log_auth_event()` RPC
- Use `has_role(_user_id, _role)` RPC to check permissions

## Database Schema (Key Tables)

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

## Edge Functions (Deno)

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
| `send-quote-email` | Quote email delivery | No |
| `send-invitation` | User invitation emails | No |
| `validate-invitation` | Invitation token validation | No |
| `boldsign-webhook` | Boldsign webhook handler | No |
| `get-boldsign-signing-url` | Signing URL generation | Yes |
| `optimize-image` | Image optimization | No |
| `sitemap` | SEO sitemap | No |

Email provider: Resend (requires `RESEND_API_KEY` env var).

## Routing

React Router DOM with routes defined in `App.tsx`. Key routes:
- `/` - Landing page
- `/portfolio` - Project showcase
- `/blog` - Blog listing
- `/contacto` - Contact form
- `/servicos` - Services page
- `/quem-somos` - About page
- `/insights` - Insights page
- `/empresas` - B2B page
- `/investidores` - Investors page
- `/auth` - Login/signup
- `/client-dashboard` - Client portal (protected)
- `/admin-dashboard` - Admin panel (admin only)

## Styling

- Tailwind CSS with custom design tokens in `tailwind.config.ts`
- CSS variables for theming in `src/index.css`
- Use `cn()` from `@/lib/utils` for conditional className merging
- ARIFA brand colors: Coral (primary), Yellow, Blue, Gray scale
- Dark mode support via CSS variables

## Internationalization

Translations are inline in `LanguageContext.tsx`:
```tsx
const { t, language } = useLanguage();
t("nav.home") // "Inicio" or "Home"
```

To add a new translation, add the key to both `translations.pt` and `translations.en` objects.

## PWA Configuration

- Service worker with cache strategies (cache-first for assets, network-first for API)
- Offline fallback page
- Configured in `vite.config.ts` with `vite-plugin-pwa`
- Manual chunks: vendor-react, vendor-ui, vendor-3d, vendor-charts, vendor-forms, vendor-date
