import { getConfig, updateConfig } from './configController.js';
import { checkAndSelect } from '../services/monitor/bookmyshowMonitor.js';
import { startMonitoring, stopMonitoring } from '../services/monitor/scheduler.js';
export async function triggerCheck() {
    const c = await getConfig();
    await checkAndSelect(c);
}
export async function enableMonitoring() {
    await getConfig();
    await updateConfig({ autoMonitorEnabled: true });
    startMonitoring(async () => {
        const c = await getConfig();
        await checkAndSelect(c);
    });
    return { enabled: true };
}
export async function disableMonitoring() {
    await updateConfig({ autoMonitorEnabled: false });
    stopMonitoring();
    return { enabled: false };
}
