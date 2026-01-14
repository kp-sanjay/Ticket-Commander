import { getDB } from '../sqlite.js';
export async function createLog(level, message, details) {
    const db = getDB();
    await db.run('INSERT INTO logs (level, message, details) VALUES (?, ?, ?)', level, message, details ? JSON.stringify(details) : null);
}
export async function getLogs(limit = 50) {
    const db = getDB();
    const rows = await db.all('SELECT * FROM logs ORDER BY created_at DESC LIMIT ?', limit);
    return rows.map(r => ({
        ...r,
        createdAt: r.created_at, // Map for frontend compatibility
        details: r.details ? JSON.parse(r.details) : undefined
    }));
}
