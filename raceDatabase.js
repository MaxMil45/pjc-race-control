import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function init() {
  const db = await open({
    filename: './race.sqlite',
    driver: sqlite3.Database,
  });
  await db.migrate({ migrationsPath: './migrations-sqlite' });
  return db;
}

const dbConn = init();

export async function saveRaceResult({ racer, time, checkpoint, date }) {
  const db = await dbConn;

  const result = await db.run(
    'INSERT INTO race_results (runnerName, time, checkpoint, date) VALUES (?, ?, ?, ?)',
    [racer, time, checkpoint, date],
  );

  return result.lastID;
}

export async function getAllRaceResults() {
  const db = await dbConn;
  return db.all('SELECT * FROM race_results ORDER BY id ASC');
}

export async function updateRacerName({ id, runnerName }) {
  const db = await dbConn;
  const result = await db.run('UPDATE race_results SET runnerName = ? WHERE id = ?', [runnerName, id]);
  return result.changes;
}

export async function clearRaceResults() {
  const db = await dbConn;

  console.log('Clearing race results from database...');

  await db.run('DELETE FROM race_results');
  await db.run("DELETE FROM sqlite_sequence WHERE name = 'race_results'");
}

export async function getCSVData() {
  const db = await dbConn;
  return db.all('SELECT * FROM race_results');
}
