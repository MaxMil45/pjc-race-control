import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  try {
    const dbPath = path.resolve(__dirname, './database.sqlite');  // Path to SQLite file
    const migrationsPath = path.resolve(__dirname, './migrations-sqlite');  // Migrations folder

    // Open SQLite database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Apply migrations
    await db.migrate({ migrationsPath });

    console.log("Database initialized and migrations applied.");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export const db = await init();
