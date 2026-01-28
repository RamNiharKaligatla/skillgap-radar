const Database = require("better-sqlite3");
const db = new Database("skillgap.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    skills TEXT,
    requiredSkills TEXT,
    missingSkills TEXT,
    createdAt DATATIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

module.exports = db;