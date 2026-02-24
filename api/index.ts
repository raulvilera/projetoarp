import express from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// ─── Clientes ────────────────────────────────────────────────────────────────
const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Google Sheets Configuration
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyyDmIGFoAymbihM3vb0XBJdJzipLp6Qtcpg99yoUwrMJjSNgjukTWe79OqwDdY8MuZA/exec';

// ─── Planos disponíveis ───────────────────────────────────────────────────────
const PLANS: Record<string, { title: string; price: number; months: number }> = {
    mensal: { title: 'Plano Mensal – ARP', price: 350.0, months: 1 },
    anual: { title: 'Plano Anual – ARP', price: 3000.0, months: 12 },
};

// ─── Criar preferência de pagamento (Mercado Pago) ────────────────────────────
app.post('/api/subscription/create-preference', async (req, res) => {
    const { planId, userId } = req.body;

    const plan = PLANS[planId];
    if (!plan) {
        return res.status(400).json({ error: 'Plano inválido.' });
    }

    try {
        const preference = new Preference(mp);
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: planId,
                        title: plan.title,
                        quantity: 1,
                        unit_price: plan.price,
                        currency_id: 'BRL',
                    },
                ],
                back_urls: {
                    success: `${process.env.APP_URL || 'https://projetoarp.vercel.app'}/assinatura/sucesso`,
                    failure: `${process.env.APP_URL || 'https://projetoarp.vercel.app'}/planos`,
                    pending: `${process.env.APP_URL || 'https://projetoarp.vercel.app'}/planos`,
                },
                auto_return: 'approved',
                notification_url: `${process.env.APP_URL || 'https://projetoarp.vercel.app'}/api/subscription/webhook`,
                metadata: { plan_id: planId, user_id: userId || null },
            },
        });

        res.json({ init_point: result.init_point, id: result.id });
    } catch (error: any) {
        console.error('Erro ao criar preferência MP:', error);
        res.status(500).json({ error: 'Falha ao criar preferência de pagamento.' });
    }
});

// ─── Webhook do Mercado Pago ──────────────────────────────────────────────────
app.post('/api/subscription/webhook', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'payment' && data?.id) {
        try {
            const payment = new Payment(mp);
            const paymentData = await payment.get({ id: data.id });

            if (paymentData.status === 'approved') {
                const planId = paymentData.metadata?.plan_id as string;
                const userId = paymentData.metadata?.user_id as string;
                const plan = PLANS[planId];

                if (plan && userId) {
                    const now = new Date();
                    const expiresAt = new Date(now);
                    expiresAt.setMonth(expiresAt.getMonth() + plan.months);

                    // Upsert na tabela subscriptions_arp
                    await supabase.from('subscriptions_arp').upsert({
                        user_id: userId,
                        plan_id: planId,
                        status: 'active',
                        mp_payment_id: String(paymentData.id),
                        starts_at: now.toISOString(),
                        ends_at: expiresAt.toISOString(),
                        updated_at: now.toISOString(),
                    }, { onConflict: 'user_id' });

                    console.log(`✅ Assinatura ativada: user=${userId}, plano=${planId}`);
                }
            }
        } catch (err) {
            console.error('Erro no webhook MP:', err);
        }
    }

    res.sendStatus(200);
});

// ─── Status da assinatura do usuário ─────────────────────────────────────────
app.get('/api/subscription/status', async (req, res) => {
    const userId = req.query.userId as string;

    if (!userId) return res.status(400).json({ error: 'userId obrigatório.' });

    const { data, error } = await supabase
        .from('subscriptions_arp')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error || !data) return res.json({ status: 'inactive' });

    const isExpired = data.ends_at && new Date(data.ends_at) < new Date();
    res.json({
        status: isExpired ? 'inactive' : data.status,
        plan: data.plan_id,
        expiresAt: data.ends_at,
    });
});

// ─── Respostas do Questionário ────────────────────────────────────────────────
app.post('/api/responses', async (req, res) => {
    const { funcao, setor, answers } = req.body;
    console.log('Recebendo resposta:', { funcao, setor });
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ funcao, setor, answers }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao salvar no Google Sheets: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        res.json({ success: true, storage: 'sheets' });
    } catch (error: any) {
        console.error('Erro na rota /api/responses:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        if (!response.ok) throw new Error(`Erro ao buscar do Google Sheets: ${response.status}`);

        const sheetsData = await response.json() as any[];

        const allAnswers = sheetsData.map(r => {
            try { return JSON.parse(r.answers_json); } catch (e) { return {}; }
        });

        const stats: Record<string, { sum: number, count: number }> = {};
        allAnswers.forEach(ans => {
            Object.entries(ans).forEach(([id, value]) => {
                const sectionId = id.split('.')[0];
                if (!stats[sectionId]) stats[sectionId] = { sum: 0, count: 0 };
                stats[sectionId].sum += (value as number);
                stats[sectionId].count += 1;
            });
        });

        const result = Object.entries(stats).map(([id, data]) => ({
            id,
            average: Number((data.sum / data.count).toFixed(2))
        }));

        res.json(result);
    } catch (error: any) {
        console.error('Erro na rota /api/dashboard/stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Legacy/Placeholder routes
app.get('/api/companies', (req, res) => res.json([]));
app.get('/api/actions', (req, res) => res.json([]));

export default app;
