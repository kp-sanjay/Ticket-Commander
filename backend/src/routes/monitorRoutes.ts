import { Router } from 'express'
import { disableMonitoring, enableMonitoring, triggerCheck } from '../controllers/monitorController.js'

const router = Router()

router.post('/start', async (_, res) => {
  const result = await enableMonitoring()
  res.json(result)
})

router.post('/stop', async (_, res) => {
  const result = await disableMonitoring()
  res.json(result)
})

router.post('/check', async (_, res) => {
  await triggerCheck()
  res.json({ ok: true })
})

export default router

