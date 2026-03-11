import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from '../app/routes'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { apiRegister } from '../lib/api'
import { useWallet } from '../state/useWallet'

function Waves() {
  return (
    <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 260" fill="none" preserveAspectRatio="none">
      <path
        d="M0 170C140 120 260 140 380 170C520 206 640 245 820 215C980 188 1070 128 1200 120V260H0V170Z"
        fill="rgba(255,255,255,0.10)"
      />
      <path
        d="M0 205C180 145 300 180 420 205C580 240 720 270 900 230C1040 199 1110 152 1200 140V260H0V205Z"
        fill="rgba(255,255,255,0.08)"
      />
    </svg>
  )
}

function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-35">
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 70}%`,
            opacity: 0.55,
            transform: `scale(${(i % 5) / 10 + 0.6})`,
          }}
        />
      ))}
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const wallet = useWallet()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!wallet.state.connected || !wallet.state.address) throw new Error('Connect your wallet to continue.')
      await apiRegister({ name: name.trim(), email: email.trim(), password: password.trim(), walletAddress: wallet.state.address })
      navigate(routes.login, { replace: true, state: { registeredEmail: email.trim() } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      <div className="container-page">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d2a8e] via-[#3b2fb4] to-[#7b3cff] p-8 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-white/80">SwapVault</div>
                <Badge tone="indigo" className="bg-white/15 text-white">
                  TESTNET | Live
                </Badge>
              </div>

              <Stars />

              <div className="mt-10 text-3xl font-extrabold tracking-tight">Create your account</div>
              <div className="mt-3 text-sm text-white/80">Register once, then login to access the DEX modules.</div>

              <div className="mt-7">
                <Button
                  className="bg-white/15 text-white hover:bg-white/20"
                  type="button"
                  onClick={() => navigate(routes.login, { replace: true })}
                >
                  Go to Login
                </Button>
              </div>

              <Waves />
            </div>

            <div className="card overflow-hidden">
              <div className="card-header">
                <div>
                  <div className="card-title">Register</div>
                  <div className="card-subtitle">Connect a wallet and create credentials</div>
                </div>
                {wallet.state.connected ? <Badge tone="green">Wallet connected</Badge> : <Badge tone="slate">Wallet required</Badge>}
              </div>

              <form onSubmit={onSubmit} className="space-y-3 p-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-600">Wallet</div>
                  {wallet.state.connected && wallet.state.address ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                      <div className="truncate font-mono text-slate-700">{wallet.state.address}</div>
                      <Button type="button" variant="ghost" onClick={wallet.disconnect}>
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" className="w-full" onClick={wallet.connect}>
                      Connect Wallet
                    </Button>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-600">Name (optional)</div>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-600">Email</div>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-600">Password</div>
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
                </div>

                {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Register'}
                </Button>

                <div className="text-xs text-slate-500">
                  After registering, you’ll be redirected to login. Backend is configured via `VITE_API_BASE_URL`.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

