-- =============================================================
-- CORREÇÃO DEFINITIVA: Permissões completas para inserção anônima
-- Execute este script no SQL Editor do Supabase
-- =============================================================

-- 1. GRANT explícito de permissões no schema para a role anon
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. GRANT de permissões nas tabelas
GRANT SELECT ON public.companies TO anon;
GRANT SELECT ON public.companies TO authenticated;
GRANT INSERT ON public.companies TO authenticated;
GRANT UPDATE ON public.companies TO authenticated;
GRANT DELETE ON public.companies TO authenticated;

GRANT SELECT ON public.survey_responses TO authenticated;
GRANT INSERT ON public.survey_responses TO anon;
GRANT INSERT ON public.survey_responses TO authenticated;

-- 3. Remove TODAS as políticas existentes e recria do zero
DROP POLICY IF EXISTS "survey_responses_insert_public"      ON public.survey_responses;
DROP POLICY IF EXISTS "survey_responses_insert_anon"        ON public.survey_responses;
DROP POLICY IF EXISTS "survey_responses_insert_auth"        ON public.survey_responses;
DROP POLICY IF EXISTS "survey_responses_select_authenticated" ON public.survey_responses;
DROP POLICY IF EXISTS "companies_select_public"             ON public.companies;
DROP POLICY IF EXISTS "companies_select_anon"               ON public.companies;
DROP POLICY IF EXISTS "companies_select_auth"               ON public.companies;
DROP POLICY IF EXISTS "companies_insert_authenticated"      ON public.companies;
DROP POLICY IF EXISTS "companies_update_authenticated"      ON public.companies;
DROP POLICY IF EXISTS "companies_delete_authenticated"      ON public.companies;

-- 4. Recria políticas limpas e corretas
-- companies: SELECT público (anon e autenticado)
CREATE POLICY "companies_select_all"
  ON public.companies FOR SELECT USING (true);

-- companies: INSERT/UPDATE/DELETE apenas autenticados
CREATE POLICY "companies_write_authenticated"
  ON public.companies FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- survey_responses: SELECT apenas autenticados
CREATE POLICY "survey_responses_select_auth"
  ON public.survey_responses FOR SELECT
  TO authenticated
  USING (true);

-- survey_responses: INSERT para anon e autenticados (formulário público)
CREATE POLICY "survey_responses_insert_all"
  ON public.survey_responses FOR INSERT
  WITH CHECK (true);
