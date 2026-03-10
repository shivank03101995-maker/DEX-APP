import { Route, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { TOKENS } from '../data/tokens'

type TokenSymbol = typeof TOKENS[number]['symbol']

export function AggregatorPage() {
  const options = useMemo(() => TOKENS.map((t) => ({ value: t.symbol, label: `${t.symbol} — ${t.name}` })), [])
  const [fromToken, setFromToken] = useState<TokenSymbol>('ETH')
  const [toToken, setToToken] = useState<TokenSymbol>('USDC')
  const [amount, setAmount] = useState('')
  const [route, setRoute] = useState<'Best Price' | 'Low Gas' | 'Fastest'>('Best Price')

  return (
    <div>
      <PageHeader
        title="Aggregator & Cross-DEX Routing"
        subtitle="DEX Aggregator module from your diagram (quote + route selection scaffold)."
        badge={{ label: 'TESTNET | Live', tone: 'indigo' }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="card-header">
            <div className="card-title">DEX Aggregator</div>
            <Badge tone="indigo">Quote</Badge>
          </div>
          <div className="space-y-3 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Select value={fromToken} onChange={setFromToken} options={options} />
              <Select value={toToken} onChange={setToToken} options={options} />
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-indigo-600" />
                  <div className="text-sm font-extrabold text-slate-900">Route</div>
                </div>
                <Badge tone="slate">Demo</Badge>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {(['Best Price', 'Low Gas', 'Fastest'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoute(r)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      route === r ? 'border-indigo-300 bg-white text-indigo-700 shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-slate-600">
                Selected: <span className="font-semibold text-slate-900">{route}</span> • Estimated output: <span className="font-semibold text-slate-900">~ {amount || '0'} {toToken}</span>
              </div>
            </div>

            <Button className="w-full">Swap (wire real quote later)</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Execution Settings</div>
              <Settings2 className="h-4 w-4 text-slate-500" />
            </div>
            <div className="space-y-2 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="font-semibold text-slate-900">Max slippage</div>
                <Badge tone="indigo">0.50%</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="font-semibold text-slate-900">Tx deadline</div>
                <Badge tone="slate">20 min</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="font-semibold text-slate-900">MEV protection</div>
                <Badge tone="green">On</Badge>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Supported Sources</div>
              <Badge tone="slate">Demo</Badge>
            </div>
            <div className="p-4 text-sm text-slate-600">
              Uniswap • Sushi • Curve • Balancer • 1inch (placeholders)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

