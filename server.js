import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './raceDatabase.js';

const app = express();
const PORT = 8080;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Save race result
app.post('/api/saveRaceResult', async (req, res) => {
  const { time, racer, checkpoint } = req.body;

  if (!time || !racer || checkpoint === undefined) {
    return res.status(400).json({ error: 'Missing time, racer, or checkpoint' });
  }

  const result = await db.run(
    'INSERT INTO race_results (runnerName, time, checkpoint) VALUES (?, ?, ?)',
    [racer, time, checkpoint],
  );

  if (!result) {
    console.error('Error saving race result: Failed to insert');
    return res.status(500).json({ error: 'Failed to save race result' });
  }

  res.json({ message: 'Race result saved successfully', id: result.lastID });
});

// Update racer name
app.post('/api/updateRacer', async (req, res) => {
  const { id, runnerName } = req.body;
  if (!id || !runnerName) {
    return res.status(400).json({ error: 'Missing ID or racer name' });
  }

  const result = await db.run('UPDATE race_results SET runnerName = ? WHERE id = ?', [runnerName, id]);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'No racer found with that ID' });
  }

  res.json({ message: 'Racer updated successfully', id });
});

// Get all race results
app.get('/api/getRaceResults', async (req, res) => {
  const results = await db.all('SELECT * FROM race_results ORDER BY id ASC');

  if (!results) {
    console.error('Error retrieving race results: Failed to fetch results');
    return res.status(500).json({ error: 'Failed to retrieve race results' });
  }

  res.json(results);
});

// Clear all race results
app.delete('/api/clearRaceResults', async (req, res) => {
  const deleteResults = await db.run('DELETE FROM race_results');
  const resetSequence = await db.run("DELETE FROM sqlite_sequence WHERE name = 'race_results'");

  if (!deleteResults || !resetSequence) {
    console.error('Error clearing race results: Failed to delete from database');
    return res.status(500).json({ error: 'Failed to clear race results' });
  }

  res.json({ message: 'Race results cleared successfully and ID reset to 1' });
});

// Export results as CSV
app.get('/api/exportRaceResults', async (req, res) => {
  const results = await db.all('SELECT * FROM race_results');

  if (!results || results.length === 0) {
    return res.status(404).json({ error: 'No race results found' });
  }

  let csv = 'id,runnerName,checkpoint,time,date\n';
  results.forEach(row => {
    const { id, runnerName, checkpoint, time, date } = row;
    csv += `${id},"${runnerName}","${checkpoint}","${time}","${date}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="race_results.csv"');

  res.send(csv);
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
