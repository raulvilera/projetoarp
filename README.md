# DRPS Manager

Sistema de gestão de conformidade de Normas Regulamentadoras (NRs) para segurança do trabalho.

## Estrutura do Projeto

A versão atual do projeto foi limpa e organizada:

- `src/`: Código fonte da aplicação (React + TypeScript).
- `supabase/`: Scripts SQL e configurações do banco de dados (esquemas, migrações, RLS).
- `docs/`: Documentação estratégica, relatórios de análise e habilidades do sistema.
- `public/`: Ativos estáticos.
- `api/`: Endpoints de backend em Node.js (Vercel Functions).

## Tecnologias Utilizadas

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- **Backend / Database**: Supabase (PostgreSQL), Vercel Functions.
- **Pagamentos**: Mercado Pago SDK.
- **Estilização**: CSS moderno com foco em estética premium e HUDs industriais.

## Como Executar Localmente

1. Clone o repositório.
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env` (use `.env.example` como base).
4. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```

## Deploy

O projeto está configurado para deploy automático na **Vercel**.
As variáveis de ambiente do Supabase e Mercado Pago devem estar configuradas no painel da Vercel.

---
**DRPS Manager** - Avaliação dos Riscos Psicossociais
