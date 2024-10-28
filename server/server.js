// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

const ENTRIES_FILE = path.join(__dirname, 'entries.json');

// Read entries from the JSON file
const readEntries = () => {
    const data = fs.readFileSync(ENTRIES_FILE);
    return JSON.parse(data);
};

// Write entries to the JSON file
const writeEntries = (entries) => {
    fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
};

// Get all entries
app.get('/entries', (req, res) => {
    const entries = readEntries();
    res.json(entries);
});

// Add a new entry
app.post('/entries', (req, res) => {
    const entries = readEntries();
    const newEntry = { id: Date.now(), title: req.body.title, amount: req.body.amount, type: req.body.type };
    entries.push(newEntry);
    writeEntries(entries);
    res.status(201).json(newEntry);
});

// Update an entry
app.put('/entries/:id', (req, res) => {
    const entries = readEntries();
    const entryIndex = entries.findIndex(entry => entry.id == req.params.id);
    if (entryIndex >= 0) {
        entries[entryIndex] = { id: entries[entryIndex].id, title: req.body.title, amount: req.body.amount, type: req.body.type };
        writeEntries(entries);
        res.json(entries[entryIndex]);
    } else {
        res.status(404).send('Entry not found');
    }
});

// Delete an entry
app.delete('/entries/:id', (req, res) => {
    const entries = readEntries();
    const newEntries = entries.filter(entry => entry.id != req.params.id);
    writeEntries(newEntries);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
