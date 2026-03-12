const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

type ApiErrorShape = { ok?: false; message?: string }

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    let message = 'Request failed.'
    if (data && typeof data === 'object' && (data as ApiErrorShape).message) message = String((data as ApiErrorShape).message)
    if (res.status === 401) message = 'Invalid email or password.'
    throw new Error(message)
  }

  return data as T
}

export type ApiUser = { id: string; email: string; name?: string }

export type ApiUserWithWallet = ApiUser & { walletAddress: string }

export type ApiAuthUser = {
  id: string
  method: 'email' | 'wallet'
  email?: string
  name?: string
  walletAddress?: string
}

export async function apiRegisterEmail(params: { email: string; password: string; name?: string }): Promise<ApiAuthUser> {
  const result = await apiRequest<{ ok: true; user: ApiAuthUser }>('/auth/register/email', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return result.user
}

export async function apiRegisterWallet(params: { walletAddress: string; name?: string }): Promise<ApiAuthUser> {
  const result = await apiRequest<{ ok: true; user: ApiAuthUser }>('/auth/register/wallet', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return result.user
}

export async function apiLoginEmail(params: { email: string; password: string }): Promise<ApiAuthUser> {
  const result = await apiRequest<{ ok: true; user: ApiAuthUser }>('/auth/login/email', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return result.user
}

export async function apiLoginWallet(params: { walletAddress: string }): Promise<ApiAuthUser> {
  const result = await apiRequest<{ ok: true; user: ApiAuthUser }>('/auth/login/wallet', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return result.user
}

export type ApiWalletNonce = {
  walletAddress: string
  nonce: string
  message: string
  expiresAt: string
}

export async function apiWalletNonce(params: { walletAddress: string }): Promise<ApiWalletNonce> {
  const result = await apiRequest<{ ok: true } & ApiWalletNonce>('/auth/wallet/nonce', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  const { walletAddress, nonce, message, expiresAt } = result
  return { walletAddress, nonce, message, expiresAt }
}

export async function apiWalletVerify(params: {
  walletAddress: string
  signature: string
  intent: 'register' | 'login'
  name?: string
}): Promise<ApiAuthUser> {
  const result = await apiRequest<{ ok: true; user: ApiAuthUser }>('/auth/wallet/verify', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return result.user
}
