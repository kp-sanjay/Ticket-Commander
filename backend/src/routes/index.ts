import { Router } from 'express'
import configRoutes from './configRoutes.js'
import logsRoutes from './logsRoutes.js'
import monitorRoutes from './monitorRoutes.js'
import bmsRoutes from './bmsRoutes.js'

const router = Router()

router.use('/config', configRoutes)
router.use('/logs', logsRoutes)
router.use('/monitor', monitorRoutes)
router.use('/bms', bmsRoutes)

export default router

