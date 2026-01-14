import { Router } from 'express'
import { getLogs } from '../services/db/models/Log.js'

const router = Router()

router.get('/', async (_, res) => {
  const logs = await getLogs(200)
  res.json(logs)
})

export default router
