# Guia de Seguranca e Manutencao — ARIFA Studio
# Versao 1.0 | Abril 2026
# Destinatarios: Equipa ARIFA (administradores) e AiParaTi (suporte tecnico)

---

## 1. Arquitectura de Seguranca

### 1.1 Infraestrutura
| Componente | Tecnologia | Seguranca |
|---|---|---|
| Frontend | React SPA (Vite) | Servido via HTTPS, CSP headers |
| Backend | Supabase (PostgreSQL) | RLS (Row Level Security) em todas as tabelas |
| Autenticacao | Supabase Auth | JWT tokens, MFA opcional, sessoes seguras |
| Edge Functions | Deno (Supabase) | Isolamento por funcao, secrets geridos |
| Armazenamento | Supabase Storage | Buckets com politicas de acesso |
| Email | Resend API | Comunicacao via Edge Functions (server-side) |
| Assinaturas | BoldSign API | Assinatura digital com validade legal |

### 1.2 Principio de minimo privilegio
- **Clientes**: acesso read-only aos seus proprios projectos, documentos e mensagens
- **Admin (ARIFA)**: CRUD completo, gestao de utilizadores, upload de documentos
- **Investidores**: acesso limitado a metricas e portfolio publico
- Cada tabela tem politicas RLS que restringem o acesso por `auth.uid()`

---

## 2. Gestao de Credenciais

### 2.1 Variaveis de ambiente
As seguintes variaveis sao necessarias para o funcionamento do sistema:

**Frontend (.env)**
```
VITE_SUPABASE_URL           — URL do projecto Supabase
VITE_SUPABASE_PUBLISHABLE_KEY — Chave publica (anon key) do Supabase
```

**Edge Functions (Supabase Secrets)**
```
SUPABASE_SERVICE_ROLE_KEY   — Chave de servico (NUNCA expor no frontend)
RESEND_API_KEY              — API key do Resend (envio de emails)
BOLDSIGN_API_KEY            — API key do BoldSign (assinaturas digitais)
LOVABLE_API_KEY             — Proxy LLM para funcoes IA
ODOO_API_URL                — URL do servidor Odoo
ODOO_API_KEY                — Chave API do Odoo
ODOO_DB                     — Nome da base de dados Odoo
DALUX_API_URL               — URL da API DALUX
DALUX_API_KEY               — Chave API do DALUX
```

### 2.2 Regras de seguranca para chaves
- **NUNCA** incluir chaves em codigo fonte ou commits
- Todas as chaves sao geridas via **Supabase Dashboard > Settings > Secrets**
- Rotacao recomendada: a cada 6 meses ou imediatamente se houver suspeita de exposicao
- A `SUPABASE_SERVICE_ROLE_KEY` so e usada em Edge Functions (server-side)
- As chaves `VITE_*` sao publicas (expostas no browser) — contem apenas a anon key

### 2.3 Rotacao de chaves
1. Gerar nova chave no servico correspondente (Supabase, Resend, BoldSign, etc.)
2. Actualizar em **Supabase Dashboard > Settings > Secrets**
3. Re-deploy as Edge Functions afectadas: `supabase functions deploy <nome>`
4. Verificar que as funcoes continuam operacionais
5. Revogar a chave antiga no servico de origem

---

## 3. Proteccao de Dados (RGPD)

### 3.1 Dados pessoais tratados
| Dado | Finalidade | Base legal |
|---|---|---|
| Nome, email | Autenticacao e comunicacao | Execucao do contrato |
| Telefone, empresa | Perfil de utilizador | Consentimento |
| Mensagens | Comunicacao projecto | Execucao do contrato |
| Documentos projectos | Prestacao de servicos | Execucao do contrato |
| Logs de auditoria | Seguranca e compliance | Interesse legitimo |
| Leads (contacto, empresa) | CRM e follow-up comercial | Consentimento |

### 3.2 Direitos dos titulares
A equipa ARIFA deve estar preparada para responder a pedidos de:
- **Acesso**: fornecer copia dos dados pessoais do utilizador
- **Rectificacao**: corrigir dados incorrectos
- **Apagamento**: remover dados quando nao houver base legal para retencao
- **Portabilidade**: exportar dados em formato legivel

### 3.3 Retencao de dados
- **Dados de projecto**: manter durante a vigencia do contrato + 5 anos (obrigacao fiscal)
- **Dados de leads**: 2 anos apos ultimo contacto, depois apagar
- **Logs de auditoria**: 2 anos (requisito RGPD)
- **Mensagens**: durante o projecto + 1 ano apos conclusao

### 3.4 Audit logs
O sistema regista automaticamente:
- Logins e logouts
- Acessos a documentos
- Accoes administrativas (criar/editar/eliminar)
- Alteracoes de permissoes

Os logs estao disponiveis em **Admin > Audit Logs** com filtros e exportacao.

---

## 4. Seguranca da Aplicacao

### 4.1 Autenticacao
- Passwords com minimo 6 caracteres (Supabase Auth default)
- Recomendacao: exigir passwords com 8+ caracteres, letras e numeros
- MFA (autenticacao de dois factores) disponivel para todos os utilizadores
- Sessoes JWT com expiracao automatica
- Logout automatico apos periodo de inactividade

### 4.2 Autorizacao (RLS)
Todas as 29 tabelas da base de dados tem Row Level Security activo:
- Clientes so acedem aos seus proprios dados (filtro por `auth.uid()`)
- Admins tem acesso completo via role `admin`
- Investidores acedem apenas a metricas agregadas e portfolio publico

**NUNCA desactivar RLS** sem autorizacao explicita e documentada.

### 4.3 Prevencao de ataques
| Ameaca | Mitigacao |
|---|---|
| XSS | React escapa HTML por defeito; sem `dangerouslySetInnerHTML` |
| CSRF | Tokens JWT em headers (sem cookies de sessao) |
| SQL Injection | Supabase client usa queries parametrizadas |
| Upload malicioso | Validacao de tipo e tamanho no servidor |
| Brute force | Rate limiting do Supabase Auth |
| Dados em transito | HTTPS obrigatorio (TLS 1.2+) |

### 4.4 Cabecalhos de seguranca
Verificar que o hosting configura:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 5. Backup e Recuperacao

### 5.1 Backups automaticos
- **Supabase Pro**: backups diarios automaticos com retencao de 7 dias
- **Supabase Free**: sem backups automaticos — configurar manualmente

### 5.2 Backup manual
```bash
# Exportar base de dados
pg_dump -h <SUPABASE_HOST> -U postgres -d postgres > backup_$(date +%Y%m%d).sql

# Exportar storage (ficheiros)
# Usar Supabase CLI ou dashboard para descarregar buckets
```

### 5.3 Procedimento de recuperacao
1. Identificar o ponto de restauro necessario
2. Restaurar a partir do backup mais recente anterior ao incidente
3. Verificar integridade dos dados (contagens de registos, relacoes)
4. Notificar utilizadores afectados se houve perda de dados
5. Documentar o incidente e as accoes tomadas

---

## 6. Manutencao Regular

### 6.1 Checklist semanal
- [ ] Verificar logs de erro no Supabase Dashboard
- [ ] Rever audit logs para actividade suspeita
- [ ] Confirmar que emails (Resend) estao a ser entregues
- [ ] Verificar espaco de armazenamento utilizado

### 6.2 Checklist mensal
- [ ] Rever utilizadores activos e desactivar contas inactivas
- [ ] Verificar actualizacoes de dependencias (`npm audit`)
- [ ] Testar fluxo de login e funcionalidades criticas
- [ ] Rever metricas de performance (Core Web Vitals no Plausible)
- [ ] Verificar certificado SSL (validade)

### 6.3 Checklist semestral
- [ ] Rotacao de chaves API (seccao 2.3)
- [ ] Revisao de politicas RLS
- [ ] Teste de restauro de backup
- [ ] Revisao de permissoes de utilizadores
- [ ] Actualizacao de dependencias major

---

## 7. Monitorizacao

### 7.1 Analytics
- **Plausible Analytics** (privacy-friendly, sem cookies)
- Dashboard em: plausible.io (configurado para www.arifa.studio)
- Metricas: visitantes, pageviews, bounce rate, fontes de trafego

### 7.2 Core Web Vitals
- Integrado com Plausible via evento "Web Vitals"
- Metricas monitorizadas: LCP, CLS, INP, FCP, TTFB
- Verificar regularmente em Plausible > Goals > Web Vitals

### 7.3 Edge Functions
- Logs disponiveis em **Supabase Dashboard > Edge Functions > Logs**
- Monitorizar erros 4xx/5xx
- Funcoes criticas: ai-chat, score-lead, send-welcome-email, generate-weekly-update

---

## 8. Procedimento de Incidentes

### 8.1 Classificacao
| Nivel | Descricao | Tempo de resposta |
|---|---|---|
| Critico | Site em baixo, dados expostos, breach | Imediato (< 1 hora) |
| Alto | Funcionalidade principal quebrada | < 4 horas |
| Medio | Funcionalidade secundaria com problemas | < 24 horas |
| Baixo | Bug cosmetico, melhoria | Proximo sprint |

### 8.2 Resposta a incidentes
1. **Conter**: isolar o problema (ex: desactivar funcao, revogar chave)
2. **Avaliar**: determinar impacto e causa raiz
3. **Corrigir**: aplicar fix e verificar
4. **Comunicar**: notificar utilizadores afectados se necessario
5. **Documentar**: registar incidente, causa, accoes e prevencao futura

### 8.3 Contactos de emergencia
| Funcao | Contacto |
|---|---|
| Suporte tecnico (AiParaTi) | bilal@aiparati.com |
| ARIFA Studio | info@arifa.studio |
| Supabase (infraestrutura) | supabase.com/dashboard (tickets) |
| Resend (email) | resend.com/support |
| BoldSign (assinaturas) | boldsign.com/support |

---

## 9. Deploy e Actualizacoes

### 9.1 Processo de deploy
```bash
# 1. Verificar que tudo compila
npm run build

# 2. Testar localmente
npm run preview

# 3. Commit e push
git add <ficheiros>
git commit -m "feat: descricao da mudanca"
git push origin main

# 4. O deploy e automatico via plataforma de hosting
```

### 9.2 Rollback
Em caso de problema apos deploy:
```bash
# Ver commits recentes
git log --oneline -10

# Reverter para commit anterior
git revert <commit-hash>
git push origin main
```

### 9.3 Edge Functions
```bash
# Deploy de funcao especifica
supabase functions deploy <nome-da-funcao>

# Deploy de todas as funcoes
supabase functions deploy
```

---

## 10. Dependencias Criticas

### 10.1 LOVABLE_API_KEY
As seguintes Edge Functions dependem do proxy LLM via `ai.gateway.lovable.dev`:
- `ai-chat`
- `score-lead`
- `generate-weekly-update`
- `send-welcome-email`

**Se migrar para fora do Lovable**: estas funcoes precisam de ser reconfiguradas para usar outro provider LLM (ex: OpenAI, Anthropic directamente).

### 10.2 Integracao Odoo
- Edge Function: `odoo-sync`
- Requer: `ODOO_API_URL`, `ODOO_API_KEY`, `ODOO_DB`
- Estado: componentes prontos, aguarda credenciais do cliente

### 10.3 Integracao DALUX
- Edge Function: `dalux-sync`
- Requer: `DALUX_API_URL`, `DALUX_API_KEY`
- Estado: componentes prontos, aguarda credenciais
- Nota: cliente quer deeplinks para DALUX (sem viewer 3D embebido)
