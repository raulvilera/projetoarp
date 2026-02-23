import express from 'express';

const app = express();
app.use(express.json());

// Google Sheets Configuration
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8rMPbaPm3NeEjt2-Rj3J-AznFGs18QUjzKZRkgTijMLXaawiWlrj7zS56PQGfAu0lTg/exec';

// API Routes
app.post('/api/responses', async (req, res) => {
    const { funcao, setor, answers } = req.body;
    console.log('Recebendo resposta:', { funcao, setor });
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ funcao, setor, answers }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta do Google Sheets:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Erro ao salvar no Google Sheets: ${response.status} ${response.statusText}`);
        }

        res.json({ success: true, storage: 'sheets' });
    } catch (error: any) {
        console.error('Erro na rota /api/responses:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/dashboard/stats', async (req, res) => {
    console.log('Buscando estatísticas do Dashboard...');
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro ao buscar do Google Sheets:', errorText);
            throw new Error(`Erro ao buscar do Google Sheets: ${response.status}`);
        }

        const sheetsData = await response.json() as any[];
        console.log(`Dados recebidos do Sheets: ${sheetsData.length} registros`);

        const allAnswers = sheetsData.map(r => {
            try {
                return JSON.parse(r.answers_json);
            } catch (e) {
                return {};
            }
        });

        // Simple aggregation by section (first character of question ID)
        const stats: Record<string, { sum: number, count: number }> = {};

        allAnswers.forEach(ans => {
            Object.entries(ans).forEach(([id, value]) => {
                const sectionId = id.split('.')[0];
                if (!stats[sectionId]) {
                    stats[sectionId] = { sum: 0, count: 0 };
                }
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
