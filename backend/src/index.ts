import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { logger } from './utils/logger.js'
import { initDB } from './services/db/sqlite.js'
import routes from './routes/index.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', routes)

const port = Number(process.env.PORT || 4000)

async function start() {
  console.log('Starting server...')
  try {
    console.log('Initializing SQLite...')
    await initDB()
    console.log('SQLite initialized')
  } catch (err) {
    console.error('Failed to initialize SQLite', err)
    process.exit(1)
  }

  console.log('Listening on port', port)
  app.listen(port, () => {
    console.log(`Server running on ${port}`)
    logger.info(`Server on ${port}`)
  })
}

start()
