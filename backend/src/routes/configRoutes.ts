import { Router } from 'express'
import { getConfig, updateConfig } from '../controllers/configController.js'

const router = Router()

router.get('/', async (_, res) => {
  const cfg = await getConfig()
  res.json(cfg)
})

router.post('/', async (req, res) => {
  const next = await updateConfig(req.body)
  res.json(next)
})

export default router

