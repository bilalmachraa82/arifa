# Auditoria: Pedido do Cliente vs Codebase Actual
# Data: 2026-04-05
# Fontes: Pedido de Orcamento (27/03/2026), Email clarificacoes, Arifa_Documentacao.pdf

---

## LEGENDA
- OK = Implementado e alinhado com pedido
- PARCIAL = Implementado mas incompleto ou com diferencas
- FALTA = Nao implementado
- ERRADO = Construido mas cliente NAO quer / contradiz clarificacoes

---

## 1. WEBSITE INSTITUCIONAL

### Sitemap pedido vs paginas existentes

| Pagina pedida | Route | Ficheiro | Status |
|---|---|---|---|
| Home | `/` | Index.tsx | OK |
| Quem Somos | `/quem-somos` | QuemSomos.tsx | OK |
| Particulares | `/privado` | Privado.tsx | OK |
| Empresas | `/empresas` | Empresas.tsx | OK |
| Investidores | `/investidores` | Investidores.tsx | OK |
| Insights/PDFs download | `/insights` | Insights.tsx | OK — lead magnet com email capture |
| Projetos/Portfolio | `/portfolio` | Portfolio.tsx | OK |
| Testemunhos | - | - | PARCIAL — existe como seccao na Home e nos segmentos, mas sem pagina dedicada |
| Contacto | `/contacto` | Contacto.tsx | OK |

### Funcionalidades do website

| Requisito | Status | Notas |
|---|---|---|
| Design responsivo | OK | Tailwind responsive |
| Navegacao clara | PARCIAL | Header tem links para /blog e /servicos que cliente NAO quer |
| Formulario de contacto | OK | Com selecao de tipo de projecto + captacao como lead |
| WhatsApp flutuante | OK | WhatsAppButton.tsx |
| Botao WhatsApp | OK | Componente presente |
| Lead magnets por segmento | OK | LeadMagnetSection em Privado, Empresas, Investidores |
| Servicos DENTRO dos segmentos | OK | Cada pagina de segmento tem servicos embebidos |

### Problemas encontrados (ERRADO)

| Item | Problema | Accao necessaria |
|---|---|---|
| Blog | Blog.tsx + BlogPost.tsx existem em /blog e /blog/:slug | **REMOVER routes** — cliente disse "Nao queremos BLOG" |
| Pagina Servicos standalone | Servicos.tsx existe em /servicos | **REMOVER route** — cliente quer servicos DENTRO dos segmentos, nao separados |
| Newsletter | NewsletterForm.tsx no footer | **REMOVER** — cliente disse "Nao pedimos newsletter" |
| Links no Header | /blog e /servicos na navegacao | **REMOVER links** — nao fazem parte do sitemap pedido |

---

## 2. PORTAL DO CLIENTE

### Autenticacao e seguranca

| Requisito | Status | Notas |
|---|---|---|
| Login individual | OK | Supabase Auth email/password |
| Sessao segura | OK | JWT + onAuthStateChange |
| Read-only para clientes | OK | showCreateButton={false}, sem upload directo |
| Upload apenas pela ARIFA | OK | Clientes so enviam mensagens com anexos |

### Dados Odoo (view only)

| Requisito | Status | Notas |
|---|---|---|
| Contratos e docs administrativos | OK | ClientContracts.tsx + ClientOdooData.tsx |
| Faturas | OK | ClientOdooData.tsx (view only) |
| Cronograma e fases | OK | ProjectTimeline.tsx com fases RIBA |
| Estado actual do projecto | OK | Status badges no dashboard |
| Mensagens/notificacoes | OK | Tab Mensagens com read/reply |

### Dados DALUX

| Requisito | Status | Notas |
|---|---|---|
| Plantas, PDFs, desenhos tecnicos | OK | ClientDaluxData.tsx com download |
| Fotografias de obra | OK | ClientProjectPhotos.tsx por fase |
| Modelos 3D | **ERRADO** | Cliente quer DEEPLINK para DALUX. ClientDaluxData usa deeplinks (OK), mas Model3DPreview.tsx tem viewer 3D embebido com Three.js que pode ser activado via FilePreviewDialog |
| Relatorios de progresso | OK | AIWeeklyUpdate.tsx |
| Documentos de coordenacao | OK | Tab Documentos |

### Funcionalidades do portal (doc interna)

| Feature prometida | Status | Notas |
|---|---|---|
| Dashboard (visao geral) | OK | Stats + projectos + notificacoes |
| Timeline visual | OK | Fases com milestones e datas |
| Lightbox premium | PARCIAL | Galeria existe, verificar zoom 400%, rotacao, slideshow, gestos touch |
| Galeria de fotos por fase | OK | Filtros por milestone |
| Documentos com pastas | OK | FolderNavigation + versionamento |
| Preview inline (PDF, imagens, Office) | OK | FilePreviewDialog |
| Mensagens com chat | OK | Real-time com anexos |
| IA integrada (weekly updates) | OK | AIWeeklyUpdate + chatbot |
| Orcamento e contratos | OK | View only + BoldSign e-signature |
| Alteracoes de ambito | OK | project_change_orders tabela |

---

## 3. PAINEL ADMIN

| Feature prometida | Status | Notas |
|---|---|---|
| Dashboard KPIs | OK | Metricas + graficos Recharts |
| Gestao de projectos CRUD | OK | Com milestones, fases, fotos |
| CRM de leads Kanban | OK | Drag & drop + AI lead scoring |
| Cotacoes (criar, templates, PDF, email, tracking) | OK | Fluxo completo |
| Gestao de clientes (convites, permissoes) | OK | Invitation system |
| Gestao de Blog | **ERRADO** — existe mas cliente nao quer blog | Remover ou esconder |
| Documentos (upload, pastas, versioning) | OK | Hierarquico |
| Mensagens (inbox, responder, historico) | OK | Por projecto |
| Audit logs | OK | Com filtros e exportacao |

---

## 4. SEO INTERMEDIO (REQUISITO OBRIGATORIO)

### 4.1 SEO Tecnico Basico

| Requisito | Status | Notas |
|---|---|---|
| Meta titles e descriptions | OK | SEO.tsx com tags unicas por pagina |
| Hierarquia de headings | OK | h1/h2/h3 correctos |
| URLs amigaveis | OK | /privado, /empresas, /portfolio, etc. |
| Sitemap.xml | OK | Estatico + edge function dinamica |
| robots.txt | OK | Allow /, Disallow /admin |
| Optimizacao de imagens | PARCIAL | Lazy loading sim, mas sem WebP/srcset |
| Performance (Core Web Vitals) | **FALTA** | Sem monitorizacao, sem web-vitals lib |

### 4.2 SEO Intermedio (Obrigatorio)

| Requisito | Status | Notas |
|---|---|---|
| Pesquisa keywords 3 segmentos | PARCIAL | Keywords nos meta, mas sem research formal documentada |
| Optimizacao conteudo paginas principais | PARCIAL | Seccoes de segmento ok, falta profundidade |
| 2-3 artigos piloto optimizados | **FALTA** | Infraestrutura blog existe mas cliente nao quer blog — repensar como "Insights" |
| Google Business Profile | **FALTA** | Schema LocalBusiness existe, mas sem config GBP |
| Recomendacoes estrutura conteudos | **FALTA** | Sem documento de recomendacoes |

### Extras SEO (implementados alem do pedido)

| Extra | Status |
|---|---|
| Open Graph / Twitter Cards | OK |
| Schema.org JSON-LD (Organization, Article, Breadcrumb) | OK |
| Hreflang PT/EN | OK |
| Canonical URLs | OK |

---

## 5. INTEGRACOES

| Integracao | Status | Notas |
|---|---|---|
| Odoo (contratos, faturas) | PARCIAL | Componentes + edge function prontos. Aguarda credenciais CODNOD |
| DALUX (docs, plantas) | PARCIAL | Componentes + edge function prontos. Aguarda credenciais. Cliente quer DEEPLINK only |
| BoldSign (e-signatures) | OK | Funcional |
| Resend (emails) | OK | Funcional |

---

## 6. TECNOLOGIA PREMIUM (doc interna)

| Feature | Status | Notas |
|---|---|---|
| PWA (instalavel mobile) | OK | vite-plugin-pwa + Workbox |
| i18n PT/EN | OK | ~620 keys por lingua |
| Dark mode | OK | CSS variables |
| SEO (meta, sitemap, OG) | OK | SEO.tsx |
| 16 Edge Functions | DESACTUALIZADO | Sao agora 18 (+ odoo-sync, dalux-sync) |
| RLS Policies | OK | Todas as tabelas |
| IA integrada | OK | ai-chat, score-lead, weekly-update, welcome-email |
| Realtime | PARCIAL | Supabase realtime disponivel, verificar se activo nas mensagens |

---

## 7. ENTREGAVEIS CONTRATADOS

| Entregavel | Status | Notas |
|---|---|---|
| Website funcional com SSL | PARCIAL | Funcional sim, SSL depende do deploy (Lovable provem) |
| SEO tecnico + intermedio | PARCIAL | Tecnico ~85% ok. Intermedio ~40% — faltam artigos, GBP, keywords research |
| Conteudos ajustados para web | PARCIAL | Estrutura pronta, conteudo real depende da ARIFA |
| Design responsivo | OK | Tailwind responsive |
| Manual de utilizacao | **FALTA** | Sem manual documentado |
| Portal com autenticacao | OK | Supabase Auth |
| Integracao Odoo | PARCIAL | Pronto, aguarda credenciais |
| Integracao DALUX | PARCIAL | Pronto, aguarda credenciais. Corrigir viewer 3D → deeplink |
| Documentacao tecnica | PARCIAL | CLAUDE.md + docs/ existem, mas sem doc tecnica formal para entrega |
| Guia de seguranca e manutencao | **FALTA** | Sem documento |
| Suporte pos-lancamento | N/A | Depende do contrato |

---

## ACCOES PRIORITARIAS

### CRITICO (contradiz pedido do cliente)
1. **Remover routes /blog e /blog/:slug** — cliente disse "nao queremos blog"
2. **Remover route /servicos** — servicos estao dentro dos segmentos
3. **Remover NewsletterForm** do footer — cliente disse "nao pedimos newsletter"
4. **Limpar navegacao Header** — remover links blog/servicos
5. **Desactivar viewer 3D embebido** para ficheiros DALUX — cliente quer deeplink only

### IMPORTANTE (falta para cumprir contrato)
6. **SEO: artigos piloto** — converter conceito "blog" em "Insights" com 2-3 fichas tecnicas SEO-optimizadas
7. **SEO: Core Web Vitals** — adicionar monitorizacao basica
8. **SEO: Google Business Profile** — documentar setup para cliente
9. **Manual de utilizacao** — documento para cliente
10. **Guia de seguranca e manutencao** — documento para entrega

### NICE-TO-HAVE (melhorias)
11. Pagina dedicada de testemunhos (actualmente so seccao)
12. Imagens WebP + srcset
13. Lightbox premium completo (verificar zoom 400%, rotacao, slideshow, gestos)
14. Actualizar doc interna (16 → 18 edge functions, 25 → 29 tabelas)
