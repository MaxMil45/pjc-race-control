const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json()); // Middleware to parse JSON

const FILE_PATH = path.join(__dirname, 'raceResult.json');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the JSON file exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, '[]'); // Initialize with empty array
}

// Function to read the JSON file asynchronously
const readResults = async () => {
  try {
    const data = await fs.promises.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading race results:", error);
    return [];
  }
};

// Function to write to the JSON file asynchronously
const writeResults = async (data) => {
  try {
    await fs.promises.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing race results:", error);
  }
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.post('/api/saveRaceResult', async (req, res) => {
  const { time, racer } = req.body;
  if (!time || !racer) return res.status(400).json({ error: "Missing time or racer" });

  try {
    const results = await readResults();
    results.push({ time, racer, date: new Date().toISOString() });
    await writeResults(results);

    res.json({ message: "Race result saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save race result" });
  }
});

// Define the route to get all race results
app.get('/api/getRaceResults', async (req, res) => {
  try {
    const results = await readResults();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve race results" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));