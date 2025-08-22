import { Router } from 'express';
import { openDb } from '../db';

const router = Router();

async function registrarLog(acao: string, idjogo: number | null = null) {
  const db = await openDb();
  await db.run(
    'INSERT INTO log (idjogo, acao, data) VALUES (?, ?, ?)',
    idjogo,
    acao,
    new Date().toISOString()
  );
}

router.get('/api/jogo', async (req, res) => {
  const db = await openDb();
  const jogos = await db.all('SELECT * FROM jogo');
  await registrarLog('listagem', null);
  res.json(jogos);
});

router.get('/api/jogo/:id', async (req, res) => {
  const db = await openDb();
  const jogo = await db.get('SELECT * FROM jogo WHERE id = ?', req.params.id);

  if (!jogo) {
    return res.status(404).json({ erro: 'Jogo não encontrado' });
  }

  await registrarLog('obtenção', jogo.id);
  res.json(jogo);
});

router.post('/api/jogo', async (req, res) => {
  const { nome, descricao, produtora, ano, idadeMinima } = req.body;

  if (!nome || !descricao || !produtora || !ano || !idadeMinima) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const db = await openDb();
  const result = await db.run(
    'INSERT INTO jogo (nome, descricao, produtora, ano, idadeMinima) VALUES (?, ?, ?, ?, ?)',
    nome, descricao, produtora, ano, idadeMinima
  );

  await registrarLog('criação', result.lastID);
  res.status(201).json({ id: result.lastID });
});

router.put('/api/jogo', async (req, res) => {
  const { id, nome, descricao, produtora, ano, idadeMinima } = req.body;

  if (!id || !nome || !descricao || !produtora || !ano || !idadeMinima) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const db = await openDb();
  const result = await db.run(
    'UPDATE jogo SET nome = ?, descricao = ?, produtora = ?, ano = ?, idadeMinima = ? WHERE id = ?',
    nome, descricao, produtora, ano, idadeMinima, id
  );

  if (result.changes === 0) {
    return res.status(404).json({ erro: 'Jogo não encontrado.' });
  }

  await registrarLog('edição', id);
  res.json(true);
});

router.delete('/api/jogo/:id', async (req, res) => {
  const db = await openDb();
  const result = await db.run('DELETE FROM jogo WHERE id = ?', req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ erro: 'Jogo não encontrado.' });
  }

  await registrarLog('exclusão', parseInt(req.params.id));
  res.json(true);
});

router.get('/api/logs', async (req, res) => {
  const db = await openDb();
  const { acao, dia } = req.query as { acao?: string; dia?: string };

  let sql = 'SELECT id, idjogo, acao, data FROM log';
  const where: string[] = [];
  const params: any[] = []; 

  if (acao) {
    where.push('acao = ?');
    params.push(acao);
  }
  if (dia) {
    where.push('substr(data,1,10) = ?');
    params.push(dia);
  }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY datetime(data) DESC, id DESC';

  const rows = await db.all(sql, params);
  res.json(rows);
});

export default router;
