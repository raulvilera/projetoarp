-- =============================================================
-- SCHEMA: Avaliação de Riscos Psicossociais (ARP)
-- Projeto Supabase: vzszzdeqbrjrepbzeiqq
-- Executar no SQL Editor do painel Supabase
-- =============================================================

-- -----------------------------------------------
-- 1. Tabela de Empresas
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       text NOT NULL,
  cnpj       text UNIQUE NOT NULL,
  cidade     text NOT NULL DEFAULT '',
  uf         char(2) NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para busca rápida por nome
CREATE INDEX IF NOT EXISTS idx_companies_nome ON public.companies (nome);

-- -----------------------------------------------
-- 2. Tabela de Respostas do Questionário
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  empresa_nome text NOT NULL,        -- nome da empresa digitado no formulário
  funcao       text NOT NULL DEFAULT '',
  setor        text NOT NULL DEFAULT '',
  answers_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

-- Índices para filtros frequentes
CREATE INDEX IF NOT EXISTS idx_survey_responses_company_id   ON public.survey_responses (company_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_empresa_nome ON public.survey_responses (empresa_nome);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON public.survey_responses (submitted_at DESC);

-- -----------------------------------------------
-- 3. RLS (Row Level Security)
-- -----------------------------------------------

-- Habilitar RLS
ALTER TABLE public.companies        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- COMPANIES: leitura pública (formulário precisa buscar empresa pelo nome)
CREATE POLICY "companies_select_public"
  ON public.companies FOR SELECT
  USING (true);

-- COMPANIES: inserção/edição apenas por usuários autenticados (admin da plataforma)
CREATE POLICY "companies_insert_authenticated"
  ON public.companies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "companies_update_authenticated"
  ON public.companies FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "companies_delete_authenticated"
  ON public.companies FOR DELETE
  USING (auth.role() = 'authenticated');

-- SURVEY_RESPONSES: leitura apenas por autenticados (somente a plataforma lê)
CREATE POLICY "survey_responses_select_authenticated"
  ON public.survey_responses FOR SELECT
  USING (auth.role() = 'authenticated');

-- SURVEY_RESPONSES: inserção pública (formulário anônimo pode registrar respostas)
CREATE POLICY "survey_responses_insert_public"
  ON public.survey_responses FOR INSERT
  WITH CHECK (true);

-- -----------------------------------------------
-- 4. Função auxiliar: vincula resposta à empresa pelo nome
-- Chamada automaticamente via trigger ao inserir survey_responses
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.link_response_to_company()
RETURNS TRIGGER AS $$
BEGIN
  -- Tenta encontrar a empresa pelo nome (case-insensitive)
  SELECT id INTO NEW.company_id
  FROM public.companies
  WHERE lower(nome) = lower(NEW.empresa_nome)
  LIMIT 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: ao inserir resposta, vincula automaticamente à empresa
DROP TRIGGER IF EXISTS trg_link_response_to_company ON public.survey_responses;
CREATE TRIGGER trg_link_response_to_company
  BEFORE INSERT ON public.survey_responses
  FOR EACH ROW EXECUTE FUNCTION public.link_response_to_company();
