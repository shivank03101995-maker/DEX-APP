import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb } from './db.js'
import { authRouter } from './routes/auth.js'

function parseOrigins(raw) {
  const fallback = new Set(['http://localhost:5173', 'http://127.0.0.1:5173'])
  if (!raw) return fallback
  const parts = String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return new Set(parts.length ? parts : Array.from(fallback))
}

const allowlist = parseOrigins(process.env.CORS_ORIGIN)

const app = express()
app.use(express.json({ limit: '100kb' }))
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true)
      if (allowlist.has(origin)) return cb(null, true)
      return cb(new Error(`CORS blocked for origin: ${origin}`))
    },
  })
)

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/auth', authRouter)

app.use((err, _req, res, _next) => {
  const status = typeof err?.statusCode === 'number' ? err.statusCode : 500
  const message = status === 500 ? 'Internal server error.' : String(err?.message ?? 'Request failed.')
  res.status(status).json({ ok: false, message })
})

const port = Number(process.env.PORT ?? 8080)
if (!process.env.MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.error('Missing MONGODB_URI. Create dex-api/.env from dex-api/.env.example and set your MongoDB connection string.')
  process.exit(1)
}
await connectDb(process.env.MONGODB_URI)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`dex-api listening on http://localhost:${port}`)
})
