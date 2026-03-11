import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiLogin } from '../lib/api'

type AuthUser = {
  id: string
  email: string
  name?: string
  walletAddress: string
}

type AuthState =
  | { status: 'anonymous'; user?: undefined }
  | { status: 'authenticated'; user: AuthUser }

type AuthContextValue = {
  state: AuthState
  login: (email: string, password: string, walletAddress: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'dex_ui_auth_v1'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'anonymous' })

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as AuthState
      if (parsed?.status === 'authenticated' && parsed.user?.email && parsed.user?.id && parsed.user?.walletAddress) setState(parsed)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = useCallback(async (email: string, password: string, walletAddress: string) => {
    const e = email.trim()
    const p = password.trim()
    const w = walletAddress.trim()
    if (!e || !p || !w) throw new Error('Email, password, and wallet are required.')
    const user = await apiLogin(e, p, w)
    setState({ status: 'authenticated', user })
  }, [])

  const logout = useCallback(() => {
    setState({ status: 'anonymous' })
  }, [])

  const value = useMemo<AuthContextValue>(() => ({ state, login, logout }), [login, logout, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
