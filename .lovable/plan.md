

# Plano: Atualizar Pricing e Garantir Cobertura Total do Pedido ARIFA

## Contexto

A cliente ARIFA Studio pediu orcamento para: Website Institucional, Portal do Cliente, Integracao Odoo, Integracao DALUX, SEO Intermedio, CMS e Manutencao. Os novos precos sao: Essencial 8.000€, Profissional 14.000€, Premium 18.000€.

## O Que a Cliente Pede vs O Que Incluir em Cada Tier

| Requisito Cliente | Essencial 8k | Profissional 14k | Premium 18k |
|---|---|---|---|
| Website institucional responsivo | ✅ | ✅ | ✅ |
| Pagina "Quem Somos" | ✅ | ✅ | ✅ |
| Segmentos (Particulares/Empresas/Investidores) | ✅ | ✅ | ✅ |
| Portfolio + Galeria | ✅ | ✅ | ✅ |
| Testemunhos | ✅ | ✅ | ✅ |
| Formulario contacto | ✅ | ✅ | ✅ |
| SEO Tecnico (meta, sitemap, robots) | ✅ | ✅ | ✅ |
| Blog + CMS | ✅ | ✅ | ✅ |
| PDFs para download | ✅ | ✅ | ✅ |
| Design responsivo (mobile/tablet) | ✅ | ✅ | ✅ |
| PWA (Progressive Web App) | ✅ | ✅ | ✅ |
| Login/Autenticacao segura | — | ✅ | ✅ |
| Portal Cliente (projetos, docs, mensagens) | — | ✅ | ✅ |
| Dashboard Admin | — | ✅ | ✅ |
| CRM + Gestao de Leads | — | ✅ | ✅ |
| Fotografias de obra | — | ✅ | ✅ |
| Cronograma/fases do projeto | — | ✅ | ✅ |
| **Integracao Odoo** (contratos, faturas, estado) | — | ✅ | ✅ |
| **Integracao DALUX** (plantas, 3D, relatorios) | — | ✅ | ✅ |
| **SEO Intermedio** (keywords, artigos, GBP) | — | ✅ | ✅ |
| Documentacao tecnica + Manual | — | ✅ | ✅ |
| 60 dias suporte | — | ✅ | ✅ |
| AI Chatbot 24/7 | — | — | ✅ |
| AI Lead Scoring automatico | — | — | ✅ |
| AI Weekly Updates para clientes | — | — | ✅ |
| Contratos digitais (e-signature) | — | — | ✅ |
| Automacoes inteligentes | — | — | ✅ |
| 12 meses manutencao incluida | — | — | ✅ |
| Suporte prioritario | — | — | ✅ |
| 4h Formacao IA GRATIS | — | — | ✅ |

## Alteracoes ao Ficheiro

### `src/pages/SalesPresentation.tsx`

**1. Slide Pricing (SlidePricing, ~linha 2315-2492)** — Reescrever completamente:
- 3 tiers em vez de 2 (grid-cols-3)
- Essencial (8.000€) — "Website Profissional" — icone Globe
- Profissional (14.000€) — "O Vosso Pedido" badge — icone Rocket — inclui Odoo+DALUX+SEO Intermedio+Portal
- Premium (18.000€) — "A Nossa Recomendacao" badge animado com Crown — destaque visual maximo — inclui tudo + IA + contratos digitais + 12 meses manutencao
- Premium com scale maior, gradiente escuro, ring dourado
- Profissional com badge "O VOSSO PEDIDO" + label "Tudo o que pediram"
- Checklist completa por tier com todos os itens da tabela acima
- Atualizar validade para "30 Abril 2026"
- Pagamento: 30% + 30% + 30% + 10%

**2. Slide Comparison (SlideComparison, ~linha 2178-2310)** — Atualizar valores:
- Lado ARIFA: mudar de 7.888€ para mostrar "desde 8.000€" com referencia ao Premium 18.000€
- Atualizar badges de preco
- Adicionar Odoo+DALUX como custos tradicionais separados (~2.000-4.000€/ano integracoes custom)
- Recalcular total 3 anos tradicional com integracoes: ~22.000-25.000€
- Poupanca vs Premium: ~4.000-7.000€

**3. Slide Terms (SlideTerms, ~linha 2497-2644)** — Atualizar:
- Timeline de 8 para 12 semanas (com integracoes Odoo/DALUX precisa mais tempo)
- Pagamento: 30% + 30% + 30% + 10% (4 fases)
- Ajustar labels das fases

**4. Slide NextSteps (SlideNextSteps, ~linha 2864-3016)** — Atualizar:
- Validade para "30 Abril 2026"
- Remover referencia a "31 Janeiro 2026"

**5. Subtitulo do SlidePricing** — "3 opcoes a tua medida" em vez de "2 opcoes"

## Estrategia de Conversao (Best Practices Aplicadas)

- **Price Anchoring**: Premium (18k) aparece primeiro ou com maior destaque para ancorar percepcao de valor
- **Decoy Effect**: Essencial (8k) serve como opcao minima que faz o Profissional parecer bom valor
- **Social Proof Badge**: "O VOSSO PEDIDO" no Profissional valida que ouvimos a cliente
- **Recomendacao com urgencia**: Premium com animacao pulsante + "A NOSSA RECOMENDACAO"
- **Diferenciador claro**: A diferenca Premium vs Profissional e exclusivamente IA + manutencao 12 meses + contratos digitais
- **Escassez**: "Precos validos ate 30 Abril 2026" + "Apos esta data, os precos sobem 15%"
- **Loss Aversion**: No Profissional, mostrar "Sem funcionalidades de IA" como item cinzento

