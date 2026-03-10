import { Copy, ExternalLink, Send, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useWallet } from '../state/useWallet'

export function WalletDashboardPage() {
  const wallet = useWallet()

  const balances = useMemo(
    () => [
      { asset: 'ETH', amount: '1.234', usd: '$3,020' },
      { asset: 'USDC', amount: '2,000', usd: '$2,000' },
      { asset: 'DAI', amount: '420', usd: '$420' },
    ],
    [],
  )

  return (
    <div>
      <PageHeader title="Wallet Dashboard" subtitle="Balances, recent activity, and quick actions (scaffolded UI)." />

      {!wallet.state.connected ? (
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-indigo-600" />
            <div>
              <div className="text-sm font-extrabold text-slate-900">Connect your wallet</div>
              <div className="text-sm text-slate-600">Use the top-right button to connect (mocked locally).</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="card-header">
            <div className="card-title">Balances</div>
            <Badge tone="indigo">Demo</Badge>
          </div>
          <div className="divide-y divide-slate-200/70">
            {balances.map((b) => (
              <div key={b.asset} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{b.asset}</div>
                  <div className="text-xs text-slate-500">{b.usd}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{b.amount}</div>
                  <div className="text-xs text-slate-500">Available</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
              <Badge tone="slate">Wallet</Badge>
            </div>
            <div className="grid gap-2 p-4">
              <Button variant="secondary">
                <Send className="h-4 w-4" /> Send
              </Button>
              <Button variant="ghost">
                <ExternalLink className="h-4 w-4" /> View on Explorer
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  if (wallet.state.address) await navigator.clipboard.writeText(wallet.state.address)
                }}
              >
                <Copy className="h-4 w-4" /> Copy Address
              </Button>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
              <Badge tone="slate">Demo</Badge>
            </div>
            <div className="divide-y divide-slate-200/70">
              {[
                { label: 'Swap ETH → USDC', status: 'Success', tone: 'green' as const },
                { label: 'Add liquidity ETH/USDC', status: 'Success', tone: 'green' as const },
                { label: 'Cross-chain USDC', status: 'Pending', tone: 'amber' as const },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">{a.label}</div>
                  <Badge tone={a.tone}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

