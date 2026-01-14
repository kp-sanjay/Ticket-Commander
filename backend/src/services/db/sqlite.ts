import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { logger } from '../../utils/logger.js'

let db: Database | null = null

export async function initDB() {
  if (db) return db

  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Initialize default config if not exists
  const config = await db.get('SELECT * FROM config WHERE id = 1')
  if (!config) {
    const defaultConfig = {
      movieName: '',
      region: '',
      theatres: [],
      showTimes: [],
      seatPreference: {
        rowPreference: 'upper',
        positionPreference: 'center',
        count: 2
      },
      simulation: false
    }
    await db.run('INSERT INTO config (id, data) VALUES (1, ?)', JSON.stringify(defaultConfig))
  }

  logger.info('SQLite initialized')
  return db
}

export function getDB() {
  if (!db) throw new Error('DB not initialized')
  return db
}
