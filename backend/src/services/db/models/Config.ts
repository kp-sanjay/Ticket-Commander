import { getDB } from '../sqlite.js'
import { AppConfig } from '../../../utils/types.js'

export async function getConfig(): Promise<AppConfig> {
  const db = getDB()
  const row = await db.get('SELECT data FROM config WHERE id = 1')
  return JSON.parse(row.data)
}

export async function updateConfig(newConfig: Partial<AppConfig>): Promise<AppConfig> {
  const db = getDB()
  const current = await getConfig()
  const updated = { ...current, ...newConfig }
  await db.run('UPDATE config SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1', JSON.stringify(updated))
  return updated
}
