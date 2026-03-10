import { ArrowRightLeft, Globe2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { TOKENS } from '../data/tokens'

type Chain = 'Ethereum' | 'Polygon' | 'Arbitrum' | 'Base'

export function CrossChainPage() {
  const [fromChain, setFromChain] = useState<Chain>('Ethereum')
  const [toChain, setToChain] = useState<Chain>('Polygon')
  const [token, setToken] = useState<(typeof TOKENS)[number]['symbol']>('USDC')
  const [amount, setAmount] = useState('')

  const chainOptions = useMemo(
    () => [
      { value: 'Ethereum' as const, label: 'Ethereum' },
      { value: 'Polygon' as const, label: 'Polygon' },
      { value: 'Arbitrum' as const, label: 'Arbitrum' },
      { value: 'Base' as const, label: 'Base' },
    ],
    [],
  )
  const tokenOptions = useMemo(() => TOKENS.map((t) => ({ value: t.symbol, label: `${t.symbol} — ${t.name}` })), [])

  return (
    <div>
      <PageHeader
        title="Cross-Chain Swap"
        subtitle="Cross-chain swap module from the diagram (network switch + bridging scaffold)."
        badge={{ label: 'TESTNET | Live', tone: 'indigo' }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Cross-Chain Swap</div>
            <Badge tone="indigo">Bridge</Badge>
          </div>
          <div className="space-y-3 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">From Network</div>
                <Select value={fromChain} onChange={setFromChain} options={chainOptions} />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">To Network</div>
                <Select value={toChain} onChange={setToChain} options={chainOptions} />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50"
                onClick={() => {
                  setFromChain(toChain)
                  setToChain(fromChain)
                }}
                aria-label="Switch networks"
              >
                <ArrowRightLeft className="h-4 w-4 text-slate-700" />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Select value={token} onChange={setToken} options={tokenOptions} />
              <div className="md:col-span-2">
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Estimated arrival: <span className="font-semibold text-slate-900">~2–6 minutes</span> • Fees:{' '}
              <span className="font-semibold text-slate-900">~0.10%</span> (demo)
            </div>

            <Button className="w-full">Start Cross-Chain Swap</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Network Switch</div>
              <Globe2 className="h-4 w-4 text-slate-500" />
            </div>
            <div className="space-y-2 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="font-semibold text-slate-900">Source</div>
                <Badge tone="slate">{fromChain}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="font-semibold text-slate-900">Destination</div>
                <Badge tone="indigo">{toChain}</Badge>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Bridges</div>
              <Badge tone="slate">Demo</Badge>
            </div>
            <div className="p-4 text-sm text-slate-600">Across • Stargate • Hop (placeholders)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

