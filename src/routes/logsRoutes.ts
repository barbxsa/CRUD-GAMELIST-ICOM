import { Router } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = Router();

async function openDb() {
  return open({
    filename: './banco.db',
    driver: sqlite3.Database
  });
}

router.get('/', async (req, res) => {
  try {
    const db = await openDb();
    const logs = await db.all('SELECT * FROM log ORDER BY id DESC');
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar logs' });
  }
});

export default router;
