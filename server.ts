import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

const app = express();
const PORT = 3000;

// Initialize Database
const db = new Database('drps.db');
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS actions (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    responsible TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    funcao TEXT NOT NULL,
    setor TEXT NOT NULL,
    answers_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const companyCount = db.prepare('SELECT count(*) as count FROM companies').get() as { count: number };
if (companyCount.count === 0) {
  const insertCompany = db.prepare('INSERT INTO companies (id, name, cnpj, city, state) VALUES (?, ?, ?, ?, ?)');
  insertCompany.run('1', 'Indústria Exemplo Ltda', '12.345.678/0001-90', 'São Paulo', 'SP');
  insertCompany.run('2', 'TecnoLogistics S.A.', '98.765.432/0001-01', 'Rio de Janeiro', 'RJ');
  insertCompany.run('3', 'BecnoLogistics Indústria Crfine Ltda', '18.335.478/0001-93', 'São Paulo', 'SP');
}

const actionCount = db.prepare('SELECT count(*) as count FROM actions').get() as { count: number };
if (actionCount.count === 0) {
  const insertAction = db.prepare('INSERT INTO actions (id, description, responsible, deadline, status) VALUES (?, ?, ?, ?, ?)');
  insertAction.run('1', 'Adequar sinalização de segurança na área de produção (NR-26)', 'João Silva', '2023-11-15', 'open');
  insertAction.run('2', 'Realizar treinamento de trabalho em altura (NR-35) para a equipe', 'Maria Santos', '2023-10-30', 'completed');
  insertAction.run('3', 'Instalar proteções em máquinas operatrizes (NR-12)', 'Pedro Oliveira', '2023-11-05', 'overdue');
}

app.use(express.json());

// API Routes
app.get('/api/companies', (req, res) => {
  const companies = db.prepare('SELECT * FROM companies').all();
  res.json(companies);
});

app.post('/api/companies', (req, res) => {
  const { id, name, cnpj, city, state } = req.body;
  try {
    const insert = db.prepare('INSERT INTO companies (id, name, cnpj, city, state) VALUES (?, ?, ?, ?, ?)');
    insert.run(id, name, cnpj, city, state);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/companies/:id', (req, res) => {
  const { name, cnpj, city, state } = req.body;
  const { id } = req.params;
  try {
    const update = db.prepare('UPDATE companies SET name = ?, cnpj = ?, city = ?, state = ? WHERE id = ?');
    update.run(name, cnpj, city, state, id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  try {
    const del = db.prepare('DELETE FROM companies WHERE id = ?');
    del.run(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/actions', (req, res) => {
  const actions = db.prepare('SELECT * FROM actions').all();
  res.json(actions);
});

app.post('/api/actions', (req, res) => {
  const { id, description, responsible, deadline, status } = req.body;
  try {
    const insert = db.prepare('INSERT INTO actions (id, description, responsible, deadline, status) VALUES (?, ?, ?, ?, ?)');
    insert.run(id, description, responsible, deadline, status);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/actions/:id', (req, res) => {
  const { description, responsible, deadline, status } = req.body;
  const { id } = req.params;
  try {
    const update = db.prepare('UPDATE actions SET description = ?, responsible = ?, deadline = ?, status = ? WHERE id = ?');
    update.run(description, responsible, deadline, status, id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/actions/:id', (req, res) => {
  const { id } = req.params;
  try {
    const del = db.prepare('DELETE FROM actions WHERE id = ?');
    del.run(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/responses', (req, res) => {
  const { funcao, setor, answers } = req.body;
  try {
    const insert = db.prepare('INSERT INTO responses (funcao, setor, answers_json) VALUES (?, ?, ?)');
    insert.run(funcao, setor, JSON.stringify(answers));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const responses = db.prepare('SELECT answers_json FROM responses').all() as { answers_json: string }[];
    const allAnswers = responses.map(r => JSON.parse(r.answers_json));

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


// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
