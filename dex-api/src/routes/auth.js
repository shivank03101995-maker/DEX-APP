import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { ethers } from 'ethers'
import { User } from '../models/User.js'
import { WalletChallenge } from '../models/WalletChallenge.js'

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

function sanitizeName(value) {
  const name = String(value ?? '').trim()
  return name.length ? name.slice(0, 80) : ''
}

function publicUser(user) {
  return {
    id: String(user._id),
    method: user.method,
    email: user.email ?? undefined,
    name: user.name ?? '',
    walletAddress: user.walletAddress ?? undefined,
  }
}

function buildWalletMessage({ walletAddress, nonce }) {
  return `SwapVault Authentication\n\nWallet: ${walletAddress}\nNonce: ${nonce}\n\nSign this message to prove you control this wallet.`
}

function createNonce() {
  return crypto.randomBytes(16).toString('hex')
}

function isExpired(expiresAt) {
  return !(expiresAt instanceof Date) || expiresAt.getTime() <= Date.now()
}

authRouter.post(
  '/wallet/nonce',
  asyncHandler(async (req, res) => {
    const walletAddress = normalizeWalletAddress(req.body?.walletAddress)
    if (!walletAddress) return res.status(400).json({ ok: false, message: 'walletAddress is required.' })
    if (!isLikelyEvmAddress(walletAddress)) return res.status(400).json({ ok: false, message: 'Invalid walletAddress.' })

    const nonce = createNonce()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await WalletChallenge.findOneAndUpdate(
      { walletAddress },
      { walletAddress, nonce, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )

    const message = buildWalletMessage({ walletAddress, nonce })
    return res.status(200).json({ ok: true, walletAddress, nonce, message, expiresAt: expiresAt.toISOString() })
  }),
)

authRouter.post(
  '/wallet/verify',
  asyncHandler(async (req, res) => {
    const walletAddress = normalizeWalletAddress(req.body?.walletAddress)
    const signature = String(req.body?.signature ?? '').trim()
    const intent = String(req.body?.intent ?? '').trim().toLowerCase() // "register" | "login"
    const name = sanitizeName(req.body?.name)

    if (!walletAddress || !signature || !intent) {
      return res.status(400).json({ ok: false, message: 'walletAddress, signature, and intent are required.' })
    }
    if (!isLikelyEvmAddress(walletAddress)) return res.status(400).json({ ok: false, message: 'Invalid walletAddress.' })
    if (intent !== 'register' && intent !== 'login') {
      return res.status(400).json({ ok: false, message: 'intent must be "register" or "login".' })
    }

    const challenge = await WalletChallenge.findOne({ walletAddress }).lean()
    if (!challenge) return res.status(400).json({ ok: false, message: 'No active challenge. Request a nonce first.' })
    if (isExpired(new Date(challenge.expiresAt))) {
      await WalletChallenge.deleteOne({ walletAddress })
      return res.status(400).json({ ok: false, message: 'Challenge expired. Request a new nonce.' })
    }

    const message = buildWalletMessage({ walletAddress, nonce: challenge.nonce })
    let recovered = ''
    try {
      recovered = ethers.utils.verifyMessage(message, signature).toLowerCase()
    } catch {
      return res.status(400).json({ ok: false, message: 'Invalid signature.' })
    }
    if (recovered !== walletAddress) return res.status(401).json({ ok: false, message: 'Signature does not match wallet.' })

    if (intent === 'register') {
      const existing = await User.findOne({ walletAddress }).lean()
      if (existing) return res.status(409).json({ ok: false, message: 'Wallet already registered.' })
      const user = await User.create({ method: 'wallet', walletAddress, name })
      await WalletChallenge.deleteOne({ walletAddress })
      return res.status(201).json({ ok: true, user: publicUser(user) })
    }

    const user = await User.findOne({ walletAddress, method: 'wallet' }).lean()
    if (!user) return res.status(401).json({ ok: false, message: 'Wallet not registered.' })
    await WalletChallenge.deleteOne({ walletAddress })
    return res.status(200).json({ ok: true, user: publicUser(user) })
  }),
)

authRouter.post(
  '/register/email',
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password ?? '').trim()
    const name = sanitizeName(req.body?.name)

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password are required.' })
    }
    if (password.length < 6) return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })

    const existing = await User.findOne({ email }).lean()
    if (existing) return res.status(409).json({ ok: false, message: 'Email already registered.' })

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10)
    const passwordHash = await bcrypt.hash(password, saltRounds)

    try {
      const user = await User.create({ method: 'email', email, name, passwordHash })
      return res.status(201).json({ ok: true, user: publicUser(user) })
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
        return res.status(409).json({ ok: false, message: 'Email already registered.' })
      }
      throw err
    }
  }),
)

authRouter.post(
  '/register/wallet',
  asyncHandler(async (req, res) => {
    const walletAddress = normalizeWalletAddress(req.body?.walletAddress)
    const name = sanitizeName(req.body?.name)

    if (!walletAddress) return res.status(400).json({ ok: false, message: 'walletAddress is required.' })
    if (!isLikelyEvmAddress(walletAddress)) return res.status(400).json({ ok: false, message: 'Invalid walletAddress.' })

    const existing = await User.findOne({ walletAddress }).lean()
    if (existing) return res.status(409).json({ ok: false, message: 'Wallet already registered.' })

    try {
      const user = await User.create({ method: 'wallet', walletAddress, name })
      return res.status(201).json({ ok: true, user: publicUser(user) })
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
        return res.status(409).json({ ok: false, message: 'Wallet already registered.' })
      }
      throw err
    }
  }),
)

authRouter.post(
  '/login/email',
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password ?? '').trim()

    if (!email || !password) return res.status(400).json({ ok: false, message: 'Email and password are required.' })

    const user = await User.findOne({ email, method: 'email' }).select('+passwordHash')
    if (!user || !user.passwordHash) return res.status(401).json({ ok: false, message: 'Invalid credentials.' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ ok: false, message: 'Invalid credentials.' })

    return res.status(200).json({ ok: true, user: publicUser(user) })
  }),
)

authRouter.post(
  '/login/wallet',
  asyncHandler(async (req, res) => {
    const walletAddress = normalizeWalletAddress(req.body?.walletAddress)
    if (!walletAddress) return res.status(400).json({ ok: false, message: 'walletAddress is required.' })
    if (!isLikelyEvmAddress(walletAddress)) return res.status(400).json({ ok: false, message: 'Invalid walletAddress.' })

    // NOTE: Legacy demo login (no signature). Prefer POST /auth/wallet/nonce + POST /auth/wallet/verify.
    const user = await User.findOne({ walletAddress, method: 'wallet' }).lean()
    if (!user) return res.status(401).json({ ok: false, message: 'Wallet not registered.' })

    return res.status(200).json({ ok: true, user: publicUser(user) })
  }),
)
