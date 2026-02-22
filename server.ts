import express from 'express';

const app = express();
app.use(express.json());

// Google Sheets Configuration
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8rMPbaPm3NeEjt2-Rj3J-AznFGs18QUjzKZRkgTijMLXaawiWlrj7zS56PQGfAu0lTg/exec';

// API Routes
app.post('/api/responses', async (req, res) => {
  const { funcao, setor, answers } = req.body;
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ funcao, setor, answers }),
    });

    if (!response.ok) throw new Error('Erro ao salvar no Google Sheets');
    res.json({ success: true, storage: 'sheets' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) throw new Error('Erro ao buscar do Google Sheets');

    const sheetsData = await response.json() as any[];
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
    res.status(500).json({ error: error.message });
  }
});

// Legacy routes (optional, keeping placeholders to avoid frontend errors if accessed)
app.get('/api/companies', (req, res) => res.json([]));
app.get('/api/actions', (req, res) => res.json([]));

export default app;
