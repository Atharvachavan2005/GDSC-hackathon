import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) return db;
  
  const SQL = await initSqlJs();
  
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, 'safeyatra.db');
  
  // Load existing database or create new
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function saveDatabase(): void {
  if (!db) return;
  
  const dataDir = path.join(__dirname, '../../data');
  const dbPath = path.join(dataDir, 'safeyatra.db');
  
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Auto-save periodically
setInterval(() => {
  saveDatabase();
}, 30000); // Save every 30 seconds

// Save on exit
process.on('exit', () => {
  saveDatabase();
});

process.on('SIGINT', () => {
  saveDatabase();
  process.exit();
});

export default { initDatabase, getDatabase, saveDatabase };
