export type AuthMethod = 'email' | 'wallet'

export type StoredUser = {
  id: string
  method: AuthMethod
  email?: string
  passwordHash?: string
  name?: string
  walletAddress?: string
  createdAt: string
}

const USERS_KEY = 'dex_ui_users_v1'

function randomId() {
  return `u_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeAddress(addr: string) {
  return addr.trim().toLowerCase()
}

export async function hashPassword(password: string) {
  const enc = new TextEncoder()
  const data = enc.encode(password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function loadUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as StoredUser[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const e = normalizeEmail(email)
  return loadUsers().find((u) => u.method === 'email' && u.email && normalizeEmail(u.email) === e)
}

export function findUserByWallet(address: string): StoredUser | undefined {
  const a = normalizeAddress(address)
  return loadUsers().find((u) => u.method === 'wallet' && u.walletAddress && normalizeAddress(u.walletAddress) === a)
}

export async function registerEmailUser(params: { email: string; password: string; name?: string }): Promise<StoredUser> {
  const email = normalizeEmail(params.email)
  const password = params.password.trim()
  const name = params.name?.trim() || undefined

  if (!email) throw new Error('Email is required.')
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.')
  if (findUserByEmail(email)) throw new Error('Email is already registered.')

  const passwordHash = await hashPassword(password)
  const user: StoredUser = {
    id: randomId(),
    method: 'email',
    email,
    passwordHash,
    name,
    createdAt: new Date().toISOString(),
  }

  const users = loadUsers()
  users.push(user)
  saveUsers(users)
  return user
}

export async function registerWalletUser(params: { walletAddress: string; name?: string }): Promise<StoredUser> {
  const walletAddress = params.walletAddress.trim()
  const name = params.name?.trim() || undefined
  if (!walletAddress) throw new Error('Wallet address is required.')
  if (findUserByWallet(walletAddress)) throw new Error('Wallet is already registered.')

  const user: StoredUser = {
    id: randomId(),
    method: 'wallet',
    walletAddress,
    name,
    createdAt: new Date().toISOString(),
  }

  const users = loadUsers()
  users.push(user)
  saveUsers(users)
  return user
}

export async function loginWithEmail(params: { email: string; password: string }): Promise<StoredUser> {
  const email = normalizeEmail(params.email)
  const password = params.password.trim()
  if (!email || !password) throw new Error('Email and password are required.')

  const user = findUserByEmail(email)
  if (!user?.passwordHash) throw new Error('Invalid email or password.')

  const passwordHash = await hashPassword(password)
  if (passwordHash !== user.passwordHash) throw new Error('Invalid email or password.')
  return user
}

export async function loginWithWallet(params: { walletAddress: string }): Promise<StoredUser> {
  const walletAddress = params.walletAddress.trim()
  if (!walletAddress) throw new Error('Wallet address is required.')

  const user = findUserByWallet(walletAddress)
  if (!user) throw new Error('Wallet is not registered. Please register first.')
  return user
}

