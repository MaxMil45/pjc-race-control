import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  const dbPath = path.resolve(__dirname, './database.sqlite');
  const migrationsPath = path.resolve(__dirname, './migrations-sqlite');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  if (!db) {
    return;
  }

  const migrationResult = await db.migrate({ migrationsPath });

  if (!migrationResult) {
    return;
  }

  return db;
}

export const db = await init();
