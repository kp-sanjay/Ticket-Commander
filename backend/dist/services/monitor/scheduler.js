import cron from 'node-cron';
import { logger } from '../../utils/logger.js';
let job = null;
export function startMonitoring(fn) {
    if (job)
        return;
    const task = cron.schedule('*/1 * * * *', async () => {
        try {
            await fn();
        }
        catch (e) {
            logger.error({ err: e });
        }
    });
    job = { stop: () => task.stop() };
}
export function stopMonitoring() {
    if (!job)
        return;
    job.stop();
    job = null;
}
