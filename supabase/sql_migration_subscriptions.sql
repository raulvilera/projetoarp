-- 1. Adicionar user_id à tabela companies para rastrear proprietários
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Atualizar políticas de RLS para companies
DROP POLICY IF EXISTS "companies_insert_authenticated" ON public.companies;
DROP POLICY IF EXISTS "companies_update_authenticated" ON public.companies;
DROP POLICY IF EXISTS "companies_delete_authenticated" ON public.companies;

CREATE POLICY "companies_insert_owner" ON public.companies 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "companies_update_owner" ON public.companies 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "companies_delete_owner" ON public.companies 
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Atualizar tabela de assinaturas para suportar o PreApproval ID do Mercado Pago
ALTER TABLE public.subscriptions_arp ADD COLUMN IF NOT EXISTS mp_preapproval_id TEXT;
ALTER TABLE public.subscriptions_arp DROP CONSTRAINT IF EXISTS subscriptions_arp_plan_id_check;
ALTER TABLE public.subscriptions_arp ADD CONSTRAINT subscriptions_arp_plan_id_check CHECK (plan_id IN ('basico', 'intermediario', 'anual', 'mensal'));
