import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

export const authRouter = Router()

const asyncHandler =
  (fn) =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase()
}

function normalizeWalletAddress(value) {
  return String(value ?? '').trim().toLowerCase()
}

function isLikelyEvmAddress(value) {
  return /^0x[a-f0-9]{40}$/.test(value)
}

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const password = String(req.body?.password ?? '').trim()
  const name = String(req.body?.name ?? '').trim()
  const walletAddress = normalizeWalletAddress(req.body?.walletAddress)

  if (!email || !password || !walletAddress) {
    return res.status(400).json({ ok: false, message: 'Email, password, and walletAddress are required.' })
  }
  if (!isLikelyEvmAddress(walletAddress)) return res.status(400).json({ ok: false, message: 'Invalid walletAddress.' })

  const existing = await User.findOne({ $or: [{ email }, { walletAddress }] }).lean()
  if (existing?.email === email) return res.status(409).json({ ok: false, message: 'Email already registered.' })
  if (existing?.walletAddress === walletAddress) return res.status(409).json({ ok: false, message: 'Wallet already registered.' })

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10)
  const passwordHash = await bcrypt.hash(password, saltRounds)

  try {
    const user = await User.create({ email, name, walletAddress, passwordHash })
    return res
      .status(201)
      .json({ ok: true, user: { id: String(user._id), email: user.email, name: user.name, walletAddress: user.walletAddress } })
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
      return res.status(409).json({ ok: false, message: 'Email or wallet already registered.' })
    }
    throw err
  }
  }),
)

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const password = String(req.body?.password ?? '').trim()
  const walletAddress = normalizeWalletAddress(req.body?.walletAddress)

  if (!email || !password || !walletAddress) {
    return res.status(400).json({ ok: false, message: 'Email, password, and walletAddress are required.' })
  }
  if (!isLikelyEvmAddress(walletAddress)) return res.status(400).json({ ok: false, message: 'Invalid walletAddress.' })

  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials.' })
  if (String(user.walletAddress).toLowerCase() !== walletAddress) return res.status(401).json({ ok: false, message: 'Invalid credentials.' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ ok: false, message: 'Invalid credentials.' })

  return res
    .status(200)
    .json({ ok: true, user: { id: String(user._id), email: user.email, name: user.name, walletAddress: user.walletAddress } })
  }),
)
