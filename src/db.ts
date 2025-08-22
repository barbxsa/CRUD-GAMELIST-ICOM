import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './banco.db',
    driver: sqlite3.Database
  });
}

export async function criarTabelas() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jogo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      produtora TEXT NOT NULL,
      ano INTEGER NOT NULL,
      idadeMinima INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idjogo INTEGER,
      acao TEXT NOT NULL,
      data TEXT NOT NULL
    );
  `);
}
