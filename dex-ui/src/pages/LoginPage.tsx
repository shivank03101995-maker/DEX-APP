import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '../app/routes'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../state/auth'
import { useWallet } from '../state/useWallet'
import { apiWalletNonce } from '../lib/api'

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

export function LoginPage() {
  const auth = useAuth()
  const wallet = useWallet()
  const navigate = useNavigate()
  const location = useLocation()
  const [method, setMethod] = useState<'email' | 'wallet'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const registeredEmail = (location.state as { registeredEmail?: string } | null)?.registeredEmail
    if (registeredEmail) setEmail(registeredEmail)
  }, [location.state])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (method === 'email') {
        await auth.loginWithEmail({ email, password })
      } else {
        if (!wallet.state.connected || !wallet.state.address) throw new Error('Connect your wallet to continue.')
        const { message } = await apiWalletNonce({ walletAddress: wallet.state.address })
        const signature = await wallet.signMessage(message)
        await auth.loginWithWallet({ walletAddress: wallet.state.address, signature })
      }
      navigate(routes.home, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      <div className="container-page">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            {/* Exact landing card style */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d2a8e] via-[#3b2fb4] to-[#7b3cff] p-8 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-white/80">SwapVault</div>
                <Badge tone="indigo" className="bg-white/15 text-white">
                  TESTNET | Live
                </Badge>
              </div>

              <Stars />

              <div className="mt-10 text-3xl font-extrabold tracking-tight">Advanced Decentralized Exchange</div>
              <div className="mt-3 text-sm text-white/80">
                A professional DEX UI based on your architecture: swaps, liquidity, pools & analytics, aggregator, cross-chain,
                wallet, settings and security.
              </div>

              <div className="mt-7">
                <Button className="bg-white/15 text-white hover:bg-white/20" disabled>
                  QUICK SWAP
                </Button>
              </div>

              <Waves />
            </div>

            {/* Login panel */}
            <div className="card overflow-hidden">
              <div className="card-header">
                <div>
                  <div className="card-title">Login</div>
                  <div className="card-subtitle">Sign in to access the DEX modules</div>
                </div>
                {auth.state.status === 'authenticated' ? <Badge tone="green">Signed in</Badge> : <Badge tone="slate">Guest</Badge>}
              </div>

              <form onSubmit={onSubmit} className="space-y-3 p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={method === 'email' ? 'primary' : 'ghost'}
                    onClick={() => setMethod('email')}
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={method === 'wallet' ? 'primary' : 'ghost'}
                    onClick={() => setMethod('wallet')}
                  >
                    Wallet
                  </Button>
                </div>

                <div className="space-y-1">
                  {method === 'wallet' ? (
                    <>
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
                          {wallet.ui.label}
                        </Button>
                      )}
                    </>
                  ) : null}
                </div>

                {method === 'email' ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-600">Email</div>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-600">Password</div>
                      <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
                    </div>
                  </>
                ) : null}

                {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Login'}
                </Button>

                <Button type="button" variant="ghost" className="w-full" onClick={() => navigate(routes.register)}>
                  Create an account
                </Button>

                <div className="text-xs text-slate-500">
                  Email accounts are stored locally (demo). Wallet login requires the wallet to be registered.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
