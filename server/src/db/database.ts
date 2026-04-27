import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../data.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    total_solved INTEGER,
    easy_solved INTEGER,
    medium_solved INTEGER,
    hard_solved INTEGER,
    last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    frontend_id TEXT,
    title TEXT,
    title_slug TEXT,
    difficulty TEXT,
    tags TEXT
  );

  CREATE TABLE IF NOT EXISTS user_tags (
    username TEXT,
    tag TEXT,
    solved_count INTEGER,
    total_count INTEGER,
    PRIMARY KEY (username, tag)
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    problem_id TEXT,
    problem_title TEXT,
    difficulty TEXT,
    tag TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
