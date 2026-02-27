# Relatório de Análise Estratégica DRPS — Projeto Avaliação dos Riscos Psicossociais

## 1. Project Classification
- **Tipo:** Plataforma SaaS de Saúde Ocupacional / Governança Corporativa.
- **Complexidade:** Média-Alta (Integrações de API de terceiros, pagamentos recorrentes e conformidade legal).
- **Domínio:** Psicologia Organizacional, Segurança e Saúde no Trabalho (SST).
- **Criticidade:** Alta (Trata dados sensíveis de saúde e informações corporativas críticas).
- **Racional:** O projeto evoluiu de uma ferramenta simples para um ecossistema complexo que inclui integração com o Mercado Pago para subscrições, Brasil API para validação de dados e infraestrutura Supabase para persistência e RLS (Row Level Security).

## 2. Executive Diagnostic
- **Problema Central:** Necessidade de escalabilidade financeira e operacional após a transição para um modelo de subscrição premium.
- **Restrições:** Dependência de APIs externas (Mercado Pago, Brasil API) e necessidade de manter conformidade rigorosa com a LGPD devido à natureza dos dados.
- **Objetivo:** Estabelecer uma infraestrutura técnica resiliente que suporte crescimento automatizado (auto-atendimento de subscrições e gestão de empresas).
- **Preocupação Executiva:** A integridade do fluxo de subscrição e a proteção contra falhas de acesso (RLS) são fundamentais para garantir a receita e a confiança do usuário.

## 3. Risk Score
- **Pontuação:** **35/100** (Risco Controlado)
- **Lógica:**
    - **Operacional (10):** Dependência de serviços de terceiros (Vercel, Supabase, APIs).
    - **Legal/Privacidade (15):** Manipulação de dados sensíveis exige auditoria contínua de RLS.
    - **Financeiro (5):** Implementação inicial de pagamentos; risco de estorno ou erro no webhook.
    - **Técnico (5):** Dívida técnica em refatoração de UI (HUD, SplashScreen).

## 4. Risk Map
- **Probabilidade Alta / Impacto Médio:** Instabilidade momentânea em APIs externas. (Aceitável com tratamento de erros robusto).
- **Probabilidade Baixa / Impacto Crítico:** Falhas de segurança no Supabase (vazamento de dados). (Não aceitável - Requer auditoria constante).
- **Risco Sistêmico:** Mudanças na API do Mercado Pago impactando o faturamento global da plataforma.

## 5. Technical Analysis (PRO+)
- **Causa Raiz:** A transição rápida de protótipo para produto comercial gerou a necessidade de refatorar componentes visuais para um padrão "Premium / Industrial", mantendo a lógica de negócio separada.
- **Fatos:** Uso de Vite + React + Supabase. Hooks customizados (`useSubscription`) já implementados.
- **Assunção:** Espera-se que o volume de dados de questionários cresça exponencialmente com o plano Enterprise (>20 empresas).
- **Incerteza:** Latência em consultas geográficas complexas se não houver indexação adequada no Postgres.

## 6. Governance & Compliance (PRO+)
- **Maturidade:** Em evolução.
- **Lacunas:** Necessidade de logs de auditoria detalhados para alterações em dados de empresas (Compliance Log).
- **Exposição:** LGPD (Lei Geral de Proteção de Dados) é o principal fator de conformidade; as políticas de RLS no Supabase são a primeira linha de defesa.

## 7. Action Plan (PRO+)
- **Ação 1:** Auditoria Completa de RLS em todas as tabelas (Owner: Dev Team, Prazo: Imediato, Sucesso: Zero acesso não autorizado).
- **Ação 2:** Implementar Logs de Webhook (Mercado Pago) no Supabase (Owner: Backend, Prazo: 7 dias, Sucesso: 100% de rastreabilidade de pagamentos).
- **Ação 3:** Finalizar Padrão Visual "Clean Industrial" em todo o sistema (Owner: Design/Frontend, Prazo: 14 dias, Sucesso: Coerência visual premium).

## 8. Executive Summary (PRO+)
O projeto está em um ponto de inflexão positivo. A infraestrutura de monetização (Mercado Pago) e validação (Brasil API) está tecnicamente sólida. O foco agora deve ser a **excelência visual** para justificar o ticket médio planejado (R$ 650+) e a **robustez da governança de dados**, garantindo que o crescimento no número de empresas não comprometa a performance ou a segurança.

## 9. Monitoring Strategy (ENTERPRISE)
- **O que monitorar:** Taxa de rejeição de pagamentos, tempo de resposta da Brasil API, e tentativas de acesso negadas pelo RLS.
- **Indicadores de Alerta:** Aumento súbito (>15%) em erros 5xx no Vercel ou falhas em webhooks de subscrição.
- **Condição de Falha:** Inconsistência entre o status de pagamento no Mercado Pago e a permissão de acesso no sistema por mais de 5 minutos.

## 10. Expansion Opportunities (ENTERPRISE)
- **Oportunidade 1:** Integração com sistemas de folha de pagamento para automação de setores e funcionários.
- **Oportunidade 2:** Versão White-label para consultorias de RH de grande porte.
- **Justificativa:** A base técnica construída com Supabase permite multi-tenancy eficiente, reduzindo drasticamente o custo marginal de adição de novos clientes de grande escala.
