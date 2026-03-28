

# Auditoria Critica da Apresentacao + Plano de Trabalho Premium

## PARTE 1: AUDITORIA DA APRESENTACAO

### Slide Order Issue
A ordem dos slides no render (linhas 348-366) e no print mode (linhas 266-285) esta **diferente**. No render: Contacto e slide 12, Timeline e 13, FAQ e 14, Comparison e 15, Pricing e 16, Terms e 17. No print mode a ordem e: ...Automations, Contacto, Timeline, FAQ, Comparison, Pricing, Terms, NextSteps. **Isto esta correto e coerente.**

### Coherencia com o Pedido de Orcamento da ARIFA

| Requisito do PDF | Na Apresentacao? | Na App? | Status |
|---|---|---|---|
| Website institucional responsivo | Slide 5 + Pricing | Index, Portfolio, Blog, etc. | OK |
| Pagina "Quem Somos" | Pricing checklist | AboutSection na Homepage, mas **nao ha pagina dedicada** | **FALTA** |
| Segmentos (Particulares/Empresas/Investidores) | Slide 5 | Privado.tsx, Empresas.tsx, Investidores.tsx | OK |
| PDFs para download / Insights | Pricing checklist | **Nao existe funcionalidade de download PDFs** | **FALTA** |
| Formulario contacto | Slide 12 (Contacto) | Contacto.tsx | OK |
| SEO Tecnico | Pricing checklist | SEO.tsx, sitemap edge function | OK |
| SEO Intermedio (keywords, artigos, GBP) | Pricing checklist | **Nao existe** - so SEO tecnico | **FALTA** |
| Blog + CMS | Slide 7 | Blog.tsx, AdminBlogPosts.tsx | OK |
| Portfolio + Galeria | Slide 6 | Portfolio.tsx, ProjectDetail.tsx | OK |
| Testemunhos | Slide 5 menciona | TestimonialsSection.tsx | OK |
| Login/Autenticacao | Pricing checklist | Auth.tsx + AuthContext | OK |
| Portal Cliente | Slide 8 | ClientDashboard.tsx | OK |
| Dados sincronizados Odoo (contratos, faturas, estado) | Pricing + Slide 4 | **ZERO implementacao** | **CRITICO** |
| Dados sincronizados DALUX (plantas, 3D, relatorios) | Pricing + Slide 4 | **ZERO implementacao** | **CRITICO** |
| Fotografias de obra | Slide 9 | ProjectPhotos components | OK |
| Cronograma/fases | Pricing checklist | ProjectTimeline.tsx, MilestonesKanban | OK |
| Dashboard Admin | Slide 10 | AdminDashboard.tsx | OK |
| CRM + Leads | Slide 11 | AdminLeads.tsx, LeadsKanban | OK |
| AI Chatbot | Pricing Premium | AIChatbot.tsx + edge function | OK |
| AI Lead Scoring | Pricing Premium | score-lead edge function | OK |
| AI Weekly Updates | Pricing Premium | AIWeeklyUpdate.tsx + edge function | OK |
| Contratos digitais (e-signature) | Pricing Premium | BoldSign edge functions | OK |
| Documentacao tecnica + Manual | Pricing checklist | Documentation.tsx | OK |
| MFA (2 fatores) | Nao mencionado | MFASetup.tsx + useMFA.ts | OK (bonus) |
| PWA | Pricing checklist | InstallPWAPrompt, Install.tsx | OK |

### Problemas na Apresentacao

1. **"Pagina Quem Somos"** - Listada no pricing mas **nao existe como pagina dedicada** na app. So ha uma AboutSection na homepage
2. **"PDFs para download"** - Listada no Essencial mas a app nao tem secao de downloads publicos de PDFs/Insights
3. **Slide Contacto badge** - Feature "AI Lead Scoring automatico ★ Premium" esta bem marcada
4. **Nao ha slide dedicado a Odoo/DALUX** - Sendo o requisito central do pedido, so aparece como item em checklists. Falta um slide que mostre *como* funciona a integracao
5. **Manual de utilizacao** - Mencionado no pedido como entregavel, temos Documentation.tsx mas podia ser mais visivel na apresentacao

### Apresentacao: Veredicto
A apresentacao esta **85% coerente**. Os precos, timelines e pagamentos estao alinhados. Os gaps sao: falta slide visual de integracoes e 2 features prometidas que nao existem na app (pagina Quem Somos dedicada, downloads PDFs).

---

## PARTE 2: PLANO DE TRABALHO PARA PACK PREMIUM COMPLETO

Baseado na auditoria do CLAUDE.md e no cruzamento com o pedido da ARIFA, aqui esta tudo o que falta construir para entregar o Pack Premium (18.000EUR) completo.

### Sprint 1: Gaps Criticos do Pedido (Semana 1-2)

**1.1 Pagina "Quem Somos" dedicada**
- Criar `src/pages/QuemSomos.tsx`
- Conteudo: historia ARIFA, equipa, valores, certificacoes
- Adicionar rota `/quem-somos` ao App.tsx
- Link no Header/Footer

**1.2 Seccao Downloads / Insights**
- Criar componente de downloads publicos de PDFs
- Storage bucket para PDFs publicos
- Integrar na pagina publica (ex: `/insights` ou seccao na homepage)
- Admin pode fazer upload de PDFs com titulo e descricao

**1.3 SEO Intermedio**
- Structured Data JSON-LD em todas as paginas
- Configurar meta descriptions otimizadas por segmento
- Template para artigos piloto otimizados
- Guia de Google Business Profile (entregavel, nao codigo)

### Sprint 2: Integracoes Odoo + DALUX (Semana 3-5)

**2.1 Edge Function `odoo-sync`**
- Criar `supabase/functions/odoo-sync/index.ts`
- Conectar via Odoo REST API (XML-RPC ou JSON-RPC)
- Endpoints: contratos, faturas, estado de projetos, mensagens
- Tabelas novas: `odoo_contracts`, `odoo_invoices`, `odoo_project_status`
- Sync periodico ou on-demand

**2.2 Edge Function `dalux-sync`**
- Criar `supabase/functions/dalux-sync/index.ts`
- Conectar via DALUX Field/Box API
- Endpoints: plantas/PDFs, fotografias de obra, modelos 3D, relatorios
- Tabelas novas: `dalux_documents`, `dalux_photos`, `dalux_models`
- Viewer/embed para plantas e modelos 3D

**2.3 Portal Cliente - Tabs Odoo/DALUX**
- Adicionar tabs "Contratos & Faturas" (Odoo) e "Documentos Tecnicos" (DALUX) ao ClientDashboard
- Componentes: `ClientOdooContracts.tsx`, `ClientOdooInvoices.tsx`, `ClientDaluxDocuments.tsx`, `ClientDaluxModels.tsx`
- Viewer inline para PDFs de plantas
- Estado do processo (licenciamento, construcao, etc.) visivel no portal

### Sprint 3: Portal Cliente Melhorias (Semana 5-6)

**3.1 Timeline Visual de Projeto**
- Componente vertical/horizontal de fases com milestones
- Integrar dados de `project_milestones` com estados Odoo
- Indicador visual de fase atual

**3.2 Versionamento de Documentos**
- UI para ver historico de versoes (ja temos `document_versions` table)
- Comparacao de versoes side-by-side
- Notificacao quando nova versao disponivel

**3.3 Chat com Anexos**
- Upload de ficheiros nas mensagens (ja temos campo `attachments` na tabela)
- Preview inline de imagens/PDFs
- Indicador "esta a escrever" (useTypingIndicator.ts ja existe)

**3.4 Pastas para Documentos**
- UI de navegacao por pastas (ja temos `document_folders` table)
- Breadcrumb navigation (FolderBreadcrumb.tsx ja existe)
- Drag & drop entre pastas

### Sprint 4: Admin Dashboard & CRM (Semana 6-7)

**4.1 Dashboard Admin com KPIs**
- Metricas: projetos ativos, leads pipeline, revenue, taxa conversao
- Graficos Recharts (ja instalado)
- AdminDashboardKPIs.tsx e AdminDashboardOverview.tsx ja existem - verificar/completar

**4.2 Kanban CRM**
- LeadsKanban.tsx ja existe - verificar drag & drop funcional
- Conversao lead -> cliente automatizada
- Historico de atividades por lead (LeadActivities.tsx existe)

**4.3 Audit Trail UI**
- AdminAuditLogs.tsx ja existe - verificar funcionalidade
- Filtros por utilizador, acao, tabela, data
- Exportacao CSV

### Sprint 5: Funcionalidades Premium IA (Semana 7-8)

**5.1 Verificar AI Chatbot**
- AIChatbot.tsx e edge function existem
- Testar end-to-end, garantir contexto por projeto
- Treinar com FAQ da ARIFA

**5.2 Verificar AI Lead Scoring**
- score-lead edge function existe
- Testar integracao com formulario de contacto
- UI de score visivel no CRM

**5.3 Verificar AI Weekly Updates**
- AIWeeklyUpdate.tsx e edge function existem
- Testar geracao de resumo
- Email automatico semanal (requer automacao)

**5.4 Automacoes Inteligentes**
- Email boas-vindas automatico (send-welcome-email existe)
- Notificacao milestone (send-milestone-notification existe)
- Alertas de prazo a expirar
- Follow-up automatico de leads sem resposta

### Sprint 6: Contratos Digitais & Polish (Semana 8-9)

**6.1 Verificar BoldSign**
- Edge functions existem (create-boldsign-contract, get-signing-url, webhook)
- Testar fluxo completo: criar contrato -> enviar -> assinar -> webhook
- Requere BOLDSIGN_API_KEY configurada

**6.2 Convites de Cliente**
- ClientInvitations.tsx e edge functions existem
- Testar fluxo: admin convida -> email -> cliente aceita -> acesso portal
- Requere RESEND_API_KEY

### Sprint 7: Qualidade & Entregaveis (Semana 9-10)

**7.1 PWA Completo**
- Testar instalacao em iOS/Android
- Offline fallback funcional
- Push notifications (PushNotificationSettings.tsx existe)

**7.2 Performance & Acessibilidade**
- Lazy loading de imagens (lazy-image.tsx existe)
- Otimizacao de bundle (code splitting por rota)
- WCAG 2.2 audit basico

**7.3 Documentacao Tecnica**
- Atualizar Documentation.tsx com guia completo
- Manual de utilizacao para admin
- Manual de utilizacao para clientes

### Sprint 8: Testes & Go-Live (Semana 11-12)

**8.1 Testes End-to-End**
- Fluxo completo: lead -> proposta -> contrato -> projeto -> portal
- Testar integracoes Odoo/DALUX com dados reais
- Testar em mobile/tablet

**8.2 Formacao (4h Premium)**
- Preparar materiais de formacao IA
- Sessao ao vivo com equipa ARIFA

---

### Resumo: O Que Ja Existe vs O Que Falta

| Categoria | Existe | Falta | Esforco |
|---|---|---|---|
| Site Publico | 90% | Pagina Quem Somos, Downloads PDFs | Baixo |
| Portal Cliente | 70% | Tabs Odoo/DALUX, Timeline visual, Pastas docs | Medio |
| Admin/CRM | 75% | KPIs dashboard, conversao lead->cliente | Medio |
| Integracoes Odoo | 0% | Tudo (edge functions, tabelas, UI) | **Alto** |
| Integracoes DALUX | 0% | Tudo (edge functions, tabelas, UI) | **Alto** |
| SEO Intermedio | 30% | JSON-LD, artigos piloto, GBP guide | Medio |
| IA Features | 80% | Verificar/testar, automacoes email | Baixo |
| Contratos Digitais | 80% | Testar com API key real | Baixo |
| Documentacao | 60% | Manuais utilizador | Medio |

**Bloqueadores criticos**: As integracoes Odoo e DALUX requerem acesso tecnico da ARIFA (API keys, endpoints, credenciais). Sem isto, nao se pode avancar nas Sprints 2-3.

