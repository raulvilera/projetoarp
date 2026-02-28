-- ============================================================
-- Criar tabela de assinaturas no Supabase (Projeto Armarinhos)
-- Execute no SQL Editor do Supabase (https://app.supabase.com)
-- ============================================================

-- Tabela de assinaturas do Projeto ARP (Isolada)
CREATE TABLE IF NOT EXISTS public.subscriptions_arp (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id          TEXT NOT NULL CHECK (plan_id IN ('mensal', 'anual')),
    status           TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due')),
    mp_payment_id    TEXT,
    starts_at        TIMESTAMPTZ,
    ends_at          TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id)
);

-- Índice para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_subs_arp_user_id ON public.subscriptions_arp(user_id);
CREATE INDEX IF NOT EXISTS idx_subs_arp_status ON public.subscriptions_arp(status);

-- Row Level Security (RLS)
ALTER TABLE public.subscriptions_arp ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver apenas a própria assinatura
CREATE POLICY "users_can_view_own_sub_arp"
    ON public.subscriptions_arp FOR SELECT
    USING (auth.uid() = user_id);

-- Apenas o service_role (backend) pode inserir/atualizar
CREATE POLICY "service_role_can_manage_subs_arp"
    ON public.subscriptions_arp FOR ALL
    USING (auth.role() = 'service_role');

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_arp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subs_arp_updated_at
    BEFORE UPDATE ON public.subscriptions_arp
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_arp();
