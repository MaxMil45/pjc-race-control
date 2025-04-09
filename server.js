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

  try {
    const result = await db.run(
      'INSERT INTO race_results (racer_name, time, checkpoint) VALUES (?, ?, ?)',
      [racer, time, checkpoint],
    );
    res.json({ message: 'Race result saved successfully', id: result.lastID });
  } catch (err) {
    console.error('Error saving race result:', err);
    res.status(500).json({ error: 'Failed to save race result' });
  }
});

// Update racer name
app.post('/api/updateRacer', async (req, res) => {
  const { id, racer_name } = req.body;
  if (!id || !racer_name) {
    return res.status(400).json({ error: 'Missing ID or racer name' });
  }

  try {
    const result = await db.run('UPDATE race_results SET racer_name = ? WHERE id = ?', [racer_name, id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'No racer found with that ID' });
    }

    res.json({ message: 'Racer updated successfully', id });
  } catch (err) {
    console.error('Error updating racer:', err);
    res.status(500).json({ error: 'Failed to update racer' });
  }
});

// Get all race results
app.get('/api/getRaceResults', async (req, res) => {
  try {
    const results = await db.all('SELECT * FROM race_results ORDER BY id ASC');
    res.json(results);
  } catch (err) {
    console.error('Error retrieving race results:', err);
    res.status(500).json({ error: 'Failed to retrieve race results' });
  }
});

// Clear all race results
app.delete('/api/clearRaceResults', async (req, res) => {
  try {
    await db.run('DELETE FROM race_results');
    await db.run("DELETE FROM sqlite_sequence WHERE name = 'race_results'");
    res.json({ message: 'Race results cleared successfully and ID reset to 1' });
  } catch (err) {
    console.error('Error clearing race results:', err);
    res.status(500).json({ error: 'Failed to clear race results' });
  }
});

// Export results as CSV
app.get('/api/exportRaceResults', async (req, res) => {
  try {
    const results = await db.all('SELECT * FROM race_results');

    if (results.length === 0) {
      return res.status(404).json({ error: 'No race results found' });
    }

    let csv = 'id,racer_name,time,date\n';
    results.forEach(row => {
      const { id, racer_name, time, date } = row;
      csv += `${id},"${racer_name}","${time}","${date}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="race_results.csv"');

    res.send(csv);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    res.status(500).json({ error: 'Failed to export results to CSV' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
