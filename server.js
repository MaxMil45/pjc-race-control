import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as raceDB from './raceDatabase.js';

const app = express();
const PORT = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/saveRaceResult', async (req, res) => {
  const { time, racer, checkpoint, date } = req.body;

  if (!time || !racer || checkpoint === undefined || date === undefined) {
    return res.status(400).json({ error: 'Missing time, racer, checkpoint, or date' });
  }

  const id = await raceDB.saveRaceResult({ racer, time, checkpoint, date });

  if (!id) {
    return res.status(500).json({ error: 'Failed to save race result' });
  }

  res.json({ message: 'Race result saved successfully', id });
});

app.post('/api/updateRacer', async (req, res) => {
  const { id, runnerName } = req.body;

  if (!id || !runnerName) {
    return res.status(400).json({ error: 'Missing ID or racer name' });
  }

  const updated = await raceDB.updateRacerName({ id, runnerName });

  if (updated === 0) {
    return res.status(404).json({ error: 'No racer found with that ID' });
  }

  res.json({ message: 'Racer updated successfully', id });
});

app.get('/api/getRaceResults', async (req, res) => {
  const results = await raceDB.getAllRaceResults();

  if (!results) {
    return res.status(500).json({ error: 'Failed to retrieve race results' });
  }

  res.json(results);
});

app.delete('/api/clearRaceResults', async (req, res) => {
  try {
    await raceDB.clearRaceResults();
    res.status(200).json({ message: 'Race results cleared successfully' });
  } catch (error) {
    console.error('Error clearing results:', error);
    res.status(500).json({ error: 'Failed to clear race results' });
  }
});

app.get('/api/exportRaceResults', async (req, res) => {
  const results = await raceDB.getCSVData();

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
