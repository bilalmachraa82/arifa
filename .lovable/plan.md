

# Auditoria Completa: Projeto ARIFA vs Requisitos + CLAUDE.md

## Estado Atual vs Requisitos

### A. INTERNACIONALIZACAO (i18n) -- PROBLEMA SISTEMATICO

O CLAUDE.md exige: "Portugues (PT) para comunicacao. Codigo e comentarios em Ingles."
O LanguageContext.tsx tem ~600 traducoes PT + ~600 EN, mas **multiplas paginas ignoram o sistema de traducoes**:

| Ficheiro | Usa `useLanguage()`? | Strings hardcoded PT |
|----------|---------------------|---------------------|
| `AdminDashboard.tsx` | NAO | "Painel de Administracao", "Projetos", "Documentos", "Mensagens", "Clientes", "Cotacoes", "Contratos", "Fotos", "Orcamentos", "Auditoria", "Acesso Restrito", "Gerir projetos..." |
| `ClientDashboard.tsx` | NAO | "Area de Cliente", "Nova Mensagem", "Projetos Ativos", "Documentos", "Mensagens", "Orcamento", "Contratos", "Fotos" |
| `ClientSettings.tsx` | NAO | "Definicoes da Conta", "Voltar ao Dashboard" |
| `Header.tsx` (mobile) | PARCIAL | "Definicoes" (linha 293) hardcoded |
| `Header.tsx` (aria-labels) | NAO | "Painel de administracao", "Definicoes da conta", "Terminar sessao", "Iniciar sessao", "Pedir orcamento", "mensagens nao lidas" |
| `ClientMessageForm.tsx` | NAO | "Responder Mensagem", "Nova Mensagem" |
| `AdminDocuments.tsx` | NAO | "Nenhum projeto" |
| `optimized-image.tsx` | NAO | "Imagem nao disponivel" |
| Todos `admin/*.tsx` (~15 ficheiros) | MAIORIA NAO | Strings hardcoded em portugues |

**Impacto**: Quando o utilizador muda para EN, estas areas ficam em PT. Quebra a experiencia bilingue prometida.

### B. NAVEGACAO -- GAPS

- **Header**: Nao inclui links para `/quem-somos` nem `/insights` (so estao no Footer)
- **Footer**: "Insights" esta hardcoded (nao usa `t()`)

### C. FEATURES EXISTENTES vs CLAUDE.md AUDIT

| Feature CLAUDE.md | Estado Real | Problema |
|---|---|---|
| MFA (2 fatores) | Componentes existem (`MFASetup.tsx`, `useMFA.ts`) | **Nao integrado** no fluxo de auth |
| Convites por email | Edge functions + componentes existem | **Nao testado** end-to-end |
| Audit Trail | `AdminAuditLogs.tsx` existe, tabela `audit_logs` existe | Faltam **triggers automaticos** de audit |
| AI Chatbot | `AIChatbot.tsx` + edge function existem | Funcional (depende de LOVABLE_API_KEY) |
| AI Lead Scoring | `score-lead` edge function existe | Existe mas **nao chamado automaticamente** apos submit contacto |
| AI Weekly Updates | `AIWeeklyUpdate.tsx` + edge function existem | Funcional |
| PWA | `InstallPWAPrompt.tsx`, `Install.tsx` existem | Precisa **verificacao** de service worker |
| Push Notifications | `PushNotificationSettings.tsx` existe | **Nao funcional** (falta VAPID key) |
| Timeline Visual | `ProjectTimeline.tsx` existe | Precisa verificacao |
| Kanban CRM | `LeadsKanban.tsx` existe | Precisa verificacao de drag&drop |
| Versionamento docs | `DocumentVersionHistory.tsx` + tabela existem | Precisa verificacao de UI |
| Pastas documentos | `FolderNavigation.tsx`, `FolderBreadcrumb.tsx` existem | Precisa verificacao |
| Contratos digitais | BoldSign edge functions existem | Requer `BOLDSIGN_API_KEY` |
| Integracoes Odoo | 0% | **CRITICO** -- nada implementado |
| Integracoes DALUX | 0% | **CRITICO** -- nada implementado |
| SEO JSON-LD | `SEO.tsx` tem structured data | Verificar cobertura |
| Email boas-vindas | `send-welcome-email` edge function existe | **Nao ligado** ao signup flow |

### D. CODIGO -- VIOLACOES DO CLAUDE.md

1. **Comentarios em PT no codigo**: `// Brand Book: Cores por rota` (Header.tsx:14), `// Fetch unread messages count` esta em EN (OK), mas mistura
2. **aria-labels em PT hardcoded**: Deviam seguir o idioma activo via `t()`
3. **Edge functions com logs em PT**: `console.error('LOVABLE_API_KEY nao configurada')` -- deviam ser em EN

---

## PLANO COMPLETO DE TRABALHO

### Fase 1: i18n Sistematico (Prioridade Alta)
**Ficheiros afetados: ~20**

1. **AdminDashboard.tsx** -- Adicionar `useLanguage()`, substituir todas as strings hardcoded por chaves `t()`
2. **ClientDashboard.tsx** -- Idem (titulo, tabs, stats cards, aria-labels)
3. **ClientSettings.tsx** -- Idem
4. **Header.tsx** -- Corrigir "Definicoes" hardcoded (linha 293), todos os aria-labels para usar `t()`
5. **ClientMessageForm.tsx** -- Substituir "Responder Mensagem" / "Nova Mensagem"
6. **AdminDocuments.tsx** -- Substituir "Nenhum projeto"
7. **optimized-image.tsx** -- Substituir "Imagem nao disponivel"
8. **Todos os admin/*.tsx** que nao usam `useLanguage()` (~12 componentes)
9. **LanguageContext.tsx** -- Adicionar chaves EN em falta para admin, client settings, aria-labels

### Fase 2: Navegacao e Routing
1. Adicionar "Quem Somos" e "Insights" ao Header navigation (desktop + mobile)
2. Usar `t()` para o label "Insights" no Footer

### Fase 3: Verificar e Ligar Features Existentes
1. **AI Lead Scoring** -- Ligar chamada automatica apos submit do formulario de contacto
2. **Email boas-vindas** -- Ligar ao fluxo de signup/convite
3. **MFA** -- Integrar no fluxo de auth (Settings ou obrigatorio para admin)
4. **Audit triggers** -- Verificar se existem triggers DB ou se precisam ser criados
5. **PWA** -- Verificar service worker e manifest
6. **Kanban, Timeline, Folders, Versions** -- Verificar que funcionam end-to-end

### Fase 4: Integracoes Odoo + DALUX
1. Criar tabelas: `odoo_contracts`, `odoo_invoices`, `dalux_documents`, `dalux_models`
2. Criar edge functions: `odoo-sync`, `dalux-sync`
3. Criar componentes portal cliente: tabs Odoo/DALUX
4. **Bloqueador**: Requer API keys e credenciais da ARIFA

### Fase 5: Qualidade de Codigo (CLAUDE.md compliance)
1. Converter comentarios PT em codigo para EN
2. Converter logs de edge functions para EN
3. Garantir que aria-labels seguem idioma activo
4. Verificar que nenhum segredo esta exposto

### Estimativa de Esforco

| Fase | Ficheiros | Complexidade |
|------|-----------|-------------|
| 1. i18n | ~20 | Media-Alta (muitas strings) |
| 2. Navegacao | 2 | Baixa |
| 3. Features existentes | ~8 | Media |
| 4. Odoo/DALUX | ~12 novos | Alta (bloqueado) |
| 5. Codigo quality | ~15 | Baixa |

### Ordem de Execucao Recomendada
1. **Fase 2** (rapida, visivel)
2. **Fase 1** (maior volume, critico para bilingue)
3. **Fase 3** (valor funcional)
4. **Fase 5** (cleanup)
5. **Fase 4** (quando houver credenciais)

