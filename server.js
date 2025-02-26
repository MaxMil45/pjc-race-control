const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(path.join(__dirname, 'db', 'RunningData.sqlite'));

// Initialize the database
const initDB = () => {
    const migrationSQL = `
        CREATE TABLE IF NOT EXISTS race_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            racer_name TEXT NOT NULL,
            time TEXT NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(migrationSQL, (err) => {
        if (err) {
            console.error("Error initializing database:", err);
        } else {
            console.log("Database initialized!");
        }
    });
};

initDB();

// Save race result
app.post('/api/saveRaceResult', (req, res) => {
    const { time, racer } = req.body;
    if (!time || !racer) return res.status(400).json({ error: "Missing time or racer" });

    const query = 'INSERT INTO race_results (racer_name, time) VALUES (?, ?)';
    db.run(query, [racer, time], function (err) {
        if (err) {
            console.error("Error saving race result:", err);
            return res.status(500).json({ error: "Failed to save race result" });
        }
        res.json({ message: "Race result saved successfully", id: this.lastID });
    });
});

// Get all race results
app.get('/api/getRaceResults', (req, res) => {
    const query = 'SELECT * FROM race_results ORDER BY date DESC';
    db.all(query, (err, rows) => {
        if (err) {
            console.error("Error retrieving race results:", err);
            return res.status(500).json({ error: "Failed to retrieve race results" });
        }
        res.json(rows);
    });
});

// Route to clear all race results
app.post('/api/clearRaceResults', (req, res) => {
    const query = 'DELETE FROM race_results';
    
    db.run(query, (err) => {
        if (err) {
            console.error("Error clearing race results:", err);
            return res.status(500).json({ error: "Failed to clear race results" });
        }
        res.json({ message: "Race results cleared successfully" });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
