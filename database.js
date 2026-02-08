const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    const db = await open({
        filename: path.join(__dirname, 'enrollment.db'),
        driver: sqlite3.Database
    });

    console.log('Connected to the SQLite database.');

    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Split the schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const statement of statements) {
        await db.run(statement);
    }

    console.log('Database schema initialized.');
    return db;
}

module.exports = { initializeDatabase };
