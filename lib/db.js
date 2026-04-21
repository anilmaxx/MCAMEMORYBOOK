import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS group_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        caption TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number INTEGER NOT NULL UNIQUE,
        name TEXT,
        photo_url TEXT,
        signature_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS memory_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await db.execute('SELECT COUNT(*) as count FROM members');
    const count = result.rows[0].count;
    
    if (count === 0) {
      const excluded = [2,7,13,17,30,35,37,38,42,45,46,49,50];
      for (let i = 1; i <= 65; i++) {
        if (!excluded.includes(i)) {
          await db.execute({
            sql: 'INSERT INTO members (roll_number, name) VALUES (?, ?)',
            args: [i, '']
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

initDb();

export default db;
