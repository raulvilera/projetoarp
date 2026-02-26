import express from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const router = express.Router();

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
    mensal: { title: 'Plano Mensal – ARP', price: 350.0, months: 1 },
    anual: { title: 'Plano Anual – ARP', price: 3000.0, months: 12 },
};

// ─── CORS Middleware ─────────────────────────────────────────────────────────
const corsMiddleware = (req: any, res: any, next: any) => {
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
};

app.use(corsMiddleware);

// ─── Rotas do Router ──────────────────────────────────────────────────────────

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

router.post('/subscription/create-preference', async (req, res) => {
    const { planId, userId } = req.body;
    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Plano inválido.' });
    try {
        const preference = new Preference(mp);
        const result = await preference.create({
            body: {
                items: [{ id: planId, title: plan.title, quantity: 1, unit_price: plan.price, currency_id: 'BRL' }],
                back_urls: {
                    success: `${process.env.APP_URL || 'https://drps-manager.vercel.app'}/assinatura/sucesso`,
                    failure: `${process.env.APP_URL || 'https://drps-manager.vercel.app'}/planos`,
                    pending: `${process.env.APP_URL || 'https://drps-manager.vercel.app'}/planos`,
                },
                auto_return: 'approved',
                notification_url: `${process.env.APP_URL || 'https://drps-manager.vercel.app'}/api/subscription/webhook`,
                metadata: { plan_id: planId, user_id: userId || null },
            },
        });
        res.json({ init_point: result.init_point, id: result.id });
    } catch (error: any) {
        console.error('Erro ao criar preferência MP:', error);
        res.status(500).json({ error: 'Falha ao criar preferência de pagamento.' });
    }
});

router.post('/subscription/webhook', async (req, res) => {
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
                    await supabase.from('subscriptions_arp').upsert({
                        user_id: userId, plan_id: planId, status: 'active', mp_payment_id: String(paymentData.id),
                        starts_at: now.toISOString(), ends_at: expiresAt.toISOString(), updated_at: now.toISOString(),
                    }, { onConflict: 'user_id' });
                }
            }
        } catch (err) { console.error('Erro no webhook MP:', err); }
    }
    res.sendStatus(200);
});

router.get('/subscription/status', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório.' });
    const { data, error } = await supabase.from('subscriptions_arp').select('*').eq('user_id', userId).maybeSingle();
    if (error || !data) return res.json({ status: 'inactive' });
    const isExpired = data.ends_at && new Date(data.ends_at) < new Date();
    res.json({ status: isExpired ? 'inactive' : data.status, plan: data.plan_id, expiresAt: data.ends_at });
});

router.post('/responses', async (req, res) => {
    const { empresa_nome, funcao, setor, answers } = req.body;
    if (!empresa_nome || !funcao || !setor || !answers) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    try {
        const { data: company } = await supabase.from('companies').select('id').ilike('nome', empresa_nome.trim()).maybeSingle();
        const { error } = await supabase.from('survey_responses').insert({
            company_id: company?.id ?? null, empresa_nome: empresa_nome.trim(), funcao: funcao.trim(), setor: setor.trim(), answers_json: answers,
        });
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, storage: 'supabase' });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.get('/dashboard/stats', async (req, res) => {
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
});

router.get('/companies', (req, res) => res.json([]));

// Monta todas as rotas em /api/ e na raiz para máxima compatibilidade com rewrites da Vercel
app.use('/api', router);
app.use('/', router);

export default app;
