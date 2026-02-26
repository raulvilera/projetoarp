import express from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
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
    mensal: { title: 'Plano Mensal – ARP', price: 350.0, months: 1 },
    anual: { title: 'Plano Anual – ARP', price: 3000.0, months: 12 },
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

// Outras rotas (simplificadas)
app.get(['/api/health', '/health'], (req, res) => res.json({ status: 'ok', v: 5 }));
app.get(['/api/companies', '/companies'], (req, res) => res.json([]));

export default app;
