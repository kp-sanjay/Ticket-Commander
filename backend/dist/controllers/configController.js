import { getConfig as dbGetConfig, updateConfig as dbUpdateConfig } from '../services/db/models/Config.js';
export async function getConfig() {
    // DB is now guaranteed initialized or we fail at start
    return await dbGetConfig();
}
export async function updateConfig(input) {
    return await dbUpdateConfig(input);
}
