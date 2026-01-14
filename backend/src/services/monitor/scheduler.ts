import cron from 'node-cron'
import { logger } from '../../utils/logger.js'

type JobRef = { stop: () => void } | null
let job: JobRef = null

export function startMonitoring(fn: () => Promise<void>) {
  if (job) return
  const task = cron.schedule('*/1 * * * *', async () => {
    try {
      await fn()
    } catch (e) {
      logger.error({ err: e })
    }
  })
  job = { stop: () => task.stop() }
}

export function stopMonitoring() {
  if (!job) return
  job.stop()
  job = null
}

