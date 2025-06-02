const fs = require('fs');
const path = require('path');
const db = require('../../config/db');

async function runMigration() {
  try {
    console.log('Running database migrations...');
    
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    await db.none(initSql);
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigration();
