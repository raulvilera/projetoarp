import express from 'express';
import { MercadoPagoConfig, Preference, Payment, PreApproval } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// ─── Clientes ────────────────────────────────────────────────────────────────
const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

// Supabase com service role key — bypassa RLS (servidor seguro)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vzszzdeqbrjrepbzeiqq.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ─── Planos disponíveis ───────────────────────────────────────────────────────
const PLANS: Record<string, { title: string; price: number; months: number }> = {
    basico: { title: 'Plano Básico (Monthly) – ARP', price: 497.0, months: 1 },
    basico_anual: { title: 'Plano Básico (Annual) – ARP', price: 4970.0, months: 12 },
    intermediario: { title: 'Plano Profissional (Monthly) – ARP', price: 1297.0, months: 1 },
    intermediario_anual: { title: 'Plano Profissional (Annual) – ARP', price: 12970.0, months: 12 },
    anual: { title: 'Plano Corporativo (Annual) – ARP', price: 14900.0, months: 12 },
    corporativo: { title: 'Plano Corporativo (Monthly) – ARP', price: 1690.0, months: 1 }, // Adicionado mensal corporativo
};

// ─── CORS Middleware ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
    const allowed = [
        'https://digital-survey-craft.lovable.app',
        'https://drps-manager.vercel.app',
        'http://localhost:8080',
        'http://localhost:5173',
    ];
    const origin = req.headers.origin as string;
    if (allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// ─── Rotas ──────────────────────────────────────────────────────────────────

const handleResponses = async (req: any, res: any) => {
    const { empresa_nome, funcao, setor, answers } = req.body;
    if (!empresa_nome || !funcao || !setor || !answers) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }
    try {
        const { data: company } = await supabase.from('companies').select('id').ilike('nome', empresa_nome.trim()).maybeSingle();
        const { error } = await supabase.from('survey_responses').insert({
            company_id: company?.id ?? null,
            empresa_nome: empresa_nome.trim(),
            funcao: funcao.trim(),
            setor: setor.trim(),
            answers_json: answers,
        });
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, storage: 'supabase' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

app.post('/api/responses', handleResponses);
app.post('/responses', handleResponses);

const handleStats = async (req: any, res: any) => {
    try {
        const { data: rows, error } = await supabase.from('survey_responses').select('answers_json');
        if (error) throw new Error(error.message);
        const allAnswers = (rows ?? []).map(r => {
            try { return typeof r.answers_json === 'string' ? JSON.parse(r.answers_json) : r.answers_json; }
            catch { return {}; }
        });
        const stats: Record<string, { sum: number, count: number }> = {};
        allAnswers.forEach(ans => {
            Object.entries(ans || {}).forEach(([id, value]) => {
                const sectionId = id.split('.')[0];
                if (!stats[sectionId]) stats[sectionId] = { sum: 0, count: 0 };
                stats[sectionId].sum += (value as number);
                stats[sectionId].count += 1;
            });
        });
        res.json(Object.entries(stats).map(([id, data]) => ({ id, average: Number((data.sum / data.count).toFixed(2)) })));
    } catch (error: any) { res.status(500).json({ error: error.message }); }
};

app.get('/api/dashboard/stats', handleStats);
app.get('/dashboard/stats', handleStats);

const handleStatus = async (req: any, res: any) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório.' });
    const { data, error } = await supabase.from('subscriptions_arp').select('*').eq('user_id', userId).maybeSingle();
    if (error || !data) return res.json({ status: 'inactive' });
    const isExpired = data.ends_at && new Date(data.ends_at) < new Date();
    res.json({ status: isExpired ? 'inactive' : data.status, plan: data.plan_id, expiresAt: data.ends_at });
};

app.get('/api/subscription/status', handleStatus);
app.get('/subscription/status', handleStatus);

const handleCreatePreference = async (req: any, res: any) => {
    const { planId, userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório.' });

    try {
        // 1. Contar empresas do usuário para validar o plano
        const { count, error: countError } = await supabase
            .from('companies')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (countError) throw countError;

        const plan = PLANS[planId] || PLANS.basico;
        const amount = plan.price;
        const title = plan.title;
        const months = plan.months;

        // 2. Criar Assinatura Recorrente (PreApproval) no Mercado Pago
        const preApproval = new PreApproval(mp);
        const result = await preApproval.create({
            body: {
                reason: title,
                external_reference: userId,
                payer_email: req.body.email || 'test_user@test.com',
                auto_recurring: {
                    frequency: months,
                    frequency_type: 'months',
                    transaction_amount: amount,
                    currency_id: 'BRL',
                },
                back_url: `${req.headers.origin}/assinatura/sucesso`,
                status: 'pending',
            }
        });

        res.json({ init_point: result.init_point, subscriptionId: result.id });
    } catch (error: any) {
        console.error('Erro ao criar assinatura:', error);
        res.status(500).json({ error: error.message });
    }
};

app.post('/api/subscription/create-preference', handleCreatePreference);
app.post('/subscription/create-preference', handleCreatePreference);

const handleWebhook = async (req: any, res: any) => {
    const { action, type, data } = req.body;
    console.log(`Webhook recebido: ${action} - ${type}`, data);

    try {
        if (type === 'preapproval' || action?.includes('preapproval')) {
            const preApproval = new PreApproval(mp);
            const sub = await preApproval.get({ id: data.id });

            if (sub) {
                const userId = sub.external_reference;
                const status = sub.status === 'authorized' ? 'active' : 'inactive';
                const planId = sub.reason?.toLowerCase().includes('intermediário') ? 'intermediario' :
                    sub.reason?.toLowerCase().includes('anual') ? 'anual' : 'basico';

                // Atualizar assinatura no Supabase
                const { error } = await supabase
                    .from('subscriptions_arp')
                    .upsert({
                        user_id: userId,
                        plan_id: planId,
                        status: status,
                        mp_preapproval_id: sub.id,
                        starts_at: sub.date_created,
                        ends_at: sub.next_payment_date,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });

                if (error) console.error('Erro ao atualizar assinatura via webhook:', error);

                // Enviar e-mail de boas-vindas se a assinatura estiver ativa
                if (status === 'active') {
                    console.log(`[EMAIL] Enviando boas-vindas para: ${sub.payer_email || 'Usuário'}`);
                    // Nota: Para envio real, integre aqui com Resend, Sendgrid ou similar.
                }
            }
        }
        res.sendStatus(200);
    } catch (error: any) {
        console.error('Erro no processamento do webhook:', error);
        res.status(500).json({ error: error.message });
    }
};

app.post('/api/subscription/webhook', handleWebhook);
app.post('/subscription/webhook', handleWebhook);

// Outras rotas (simplificadas)
app.get(['/api/health', '/health'], (req, res) => res.json({ status: 'ok', v: 6 }));
app.get(['/api/companies', '/companies'], (req, res) => res.json([]));

export default app;
