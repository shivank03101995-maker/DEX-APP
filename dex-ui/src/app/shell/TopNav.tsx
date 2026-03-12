import { Bell, LogOut, Search, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from '../routes'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../state/auth'
import { useWallet } from '../../state/useWallet'

export function TopNav() {
  const auth = useAuth()
  const wallet = useWallet()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const networkOptions = useMemo(
    () => [
      { value: 'Ethereum' as const, label: 'Ethereum' },
      { value: 'Polygon' as const, label: 'Polygon' },
      { value: 'Arbitrum' as const, label: 'Arbitrum' },
    ],
    [],
  )

  return (
    <div className="card">
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden w-80 md:block">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pools, tokens, docs…"
              endAdornment={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={wallet.state.network} onChange={wallet.setNetwork} options={networkOptions} />
            <Button variant="ghost" className="hidden md:inline-flex" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 md:justify-end">
          <div className="hidden items-center gap-2 md:flex">
            <Badge tone="slate">
              <span className="inline-flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {auth.state.status === 'authenticated'
                  // ? auth.state.user.method === 'wallet'
                  //   ? auth.state.user.walletAddress ?? 'Wallet user'
                   ? auth.state.user.email ?? 'Profile'
                  : 'Guest'}
              </span>
            </Badge>
            <Button
              variant="ghost"
              onClick={() => {
                auth.logout()
                wallet.disconnect()
                navigate(routes.login, { replace: true })
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {wallet.state.connected ? (
            <div className="flex items-center gap-2">
              <Button variant="secondary">{wallet.ui.label}</Button>
              <Button variant="ghost" onClick={wallet.disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={wallet.connect}>{wallet.ui.label}</Button>
          )}
        </div>
      </div>
    </div>
  )
}

