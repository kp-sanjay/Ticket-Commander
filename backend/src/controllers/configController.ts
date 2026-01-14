import { getConfig as dbGetConfig, updateConfig as dbUpdateConfig } from '../services/db/models/Config.js'
import { AppConfig } from '../utils/types.js'

export async function getConfig(): Promise<AppConfig> {
  // DB is now guaranteed initialized or we fail at start
  return await dbGetConfig()
}

export async function updateConfig(input: Partial<AppConfig>) {
  return await dbUpdateConfig(input)
}
