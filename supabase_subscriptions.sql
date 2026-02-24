-- ============================================================
-- Criar tabela de assinaturas no Supabase
-- Execute no SQL Editor do Supabase (https://app.supabase.com)
-- ============================================================

-- Tabela principal de assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id          TEXT NOT NULL CHECK (plan_id IN ('mensal', 'anual')),
    status           TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due')),
    mp_payment_id    TEXT,
    starts_at        TIMESTAMPTZ,
    ends_at          TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id)  -- Um usuário tem apenas uma assinatura ativa por vez
);

-- Índice para buscas rápidas por usuário
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver apenas a própria assinatura
CREATE POLICY "users_can_view_own_subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Apenas o service_role (backend) pode inserir/atualizar
CREATE POLICY "service_role_can_manage_subscriptions"
    ON public.subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
