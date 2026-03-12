import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ApiAuthUser } from '../lib/api'
import { apiLoginEmail, apiRegisterEmail, apiWalletVerify } from '../lib/api'

type AuthUser = {
  id: string
  method: 'email' | 'wallet'
  email?: string
  name?: string
  walletAddress?: string
}

type AuthState =
  | { status: 'anonymous'; user?: undefined }
  | { status: 'authenticated'; user: AuthUser }

type AuthContextValue = {
  state: AuthState
  registerWithEmail: (params: { email: string; password: string; name?: string }) => Promise<void>
  registerWithWallet: (params: { walletAddress: string; signature: string; name?: string }) => Promise<void>
  loginWithEmail: (params: { email: string; password: string }) => Promise<void>
  loginWithWallet: (params: { walletAddress: string; signature: string }) => Promise<void>
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
      if (parsed?.status === 'authenticated' && parsed.user?.id && parsed.user?.method) setState(parsed)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const toAuthUser = useCallback((u: ApiAuthUser): AuthUser => {
    return { id: u.id, method: u.method, email: u.email, name: u.name, walletAddress: u.walletAddress }
  }, [])

  const registerWithEmail = useCallback(
    async (params: { email: string; password: string; name?: string }) => {
      const user = await apiRegisterEmail(params)
      setState({ status: 'authenticated', user: toAuthUser(user) })
    },
    [toAuthUser],
  )

  const registerWithWallet = useCallback(
    async (params: { walletAddress: string; signature: string; name?: string }) => {
      const user = await apiWalletVerify({ walletAddress: params.walletAddress, signature: params.signature, intent: 'register', name: params.name })
      setState({ status: 'authenticated', user: toAuthUser(user) })
    },
    [toAuthUser],
  )

  const doLoginWithEmail = useCallback(
    async (params: { email: string; password: string }) => {
      const user = await apiLoginEmail(params)
      setState({ status: 'authenticated', user: toAuthUser(user) })
    },
    [toAuthUser],
  )

  const doLoginWithWallet = useCallback(
    async (params: { walletAddress: string; signature: string }) => {
      const user = await apiWalletVerify({ walletAddress: params.walletAddress, signature: params.signature, intent: 'login' })
      setState({ status: 'authenticated', user: toAuthUser(user) })
    },
    [toAuthUser],
  )

  const logout = useCallback(() => {
    setState({ status: 'anonymous' })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      registerWithEmail,
      registerWithWallet,
      loginWithEmail: doLoginWithEmail,
      loginWithWallet: doLoginWithWallet,
      logout,
    }),
    [doLoginWithEmail, doLoginWithWallet, logout, registerWithEmail, registerWithWallet, state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
