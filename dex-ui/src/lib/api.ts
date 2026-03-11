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

export async function apiRegister(params: {
  email: string
  password: string
  name?: string
  walletAddress: string
}): Promise<ApiUserWithWallet> {
  const result = await apiRequest<{ ok: true; user: ApiUserWithWallet }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return result.user
}

export async function apiLogin(email: string, password: string, walletAddress: string): Promise<ApiUserWithWallet> {
  const result = await apiRequest<{ ok: true; user: ApiUserWithWallet }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, walletAddress }),
  })
  return result.user
}
