import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { getDexTokens, type TokenSymbol } from '../data/tokens'

type Step = 'dashboard' | 'add' | 'confirm' | 'remove'

const defaultTokens = getDexTokens().filter((t) => t.symbol !== 'WBTC')

export function LiquidityPage() {
  const tokens = useMemo(() => getDexTokens().filter((t) => t.symbol !== 'WBTC'), [])
  const [step, setStep] = useState<Step>('dashboard')
  const [pairA, setPairA] = useState<TokenSymbol>(defaultTokens[0]?.symbol ?? 'ETH')
  const [pairB, setPairB] = useState<TokenSymbol>(defaultTokens[1]?.symbol ?? 'USDC')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')

  const options = useMemo(
    () => tokens.map((t) => ({ value: t.symbol, label: `${t.symbol} — ${t.name}` })),
    [tokens],
  )

  return (
    <div>
      <PageHeader
        title="Liquidity Management"
        subtitle="Dashboard + Add/Confirm/Remove liquidity flow (matches the module sequence in your diagram)."
        badge={{ label: 'TESTNET | Live', tone: 'indigo' }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="card-header">
              <div className="card-title">Liquidity Dashboard</div>
              <Badge tone="slate">Your positions</Badge>
            </div>
            <div className="p-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { pair: 'ETH/USDC', share: '1.24%', value: '$4,120' },
                  { pair: 'MATIC/USDC', share: '0.62%', value: '$1,880' },
                  { pair: 'ETH/DAI', share: '0.18%', value: '$540' },
                  { pair: 'MATIC/DAI', share: '0.08%', value: '$210' },
                ].map((p) => (
                  <div key={p.pair} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold text-slate-900">{p.pair}</div>
                      <Badge tone="indigo">{p.share}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Position value</div>
                    <div className="text-lg font-extrabold text-slate-900">{p.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => setStep('add')}>Add Liquidity</Button>
                <Button variant="ghost" onClick={() => setStep('remove')}>
                  Remove Liquidity
                </Button>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="card-header">
              <div className="card-title">
                {step === 'add'
                  ? 'Add Liquidity'
                  : step === 'confirm'
                    ? 'Confirm Liquidity'
                    : step === 'remove'
                      ? 'Remove Liquidity'
                      : 'How it works'}
              </div>
              <Badge tone={step === 'confirm' ? 'amber' : step === 'remove' ? 'slate' : 'indigo'}>
                {step === 'dashboard' ? 'Info' : step}
              </Badge>
            </div>

            {step === 'dashboard' ? (
              <div className="p-4 text-sm text-slate-600">
                Use <span className="font-semibold text-slate-900">Add Liquidity</span> to create/extend LP positions and{' '}
                <span className="font-semibold text-slate-900">Remove Liquidity</span> to withdraw. This screen mirrors the
                multi-card flow shown in your diagram.
              </div>
            ) : null}

            {step === 'add' ? (
              <div className="space-y-3 p-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <Select value={pairA} onChange={setPairA} options={options} />
                  <Select value={pairB} onChange={setPairB} options={options} />
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input value={amountA} onChange={(e) => setAmountA(e.target.value)} placeholder={`${pairA} amount`} />
                  <Input value={amountB} onChange={(e) => setAmountB(e.target.value)} placeholder={`${pairB} amount`} />
                </div>
                <Button onClick={() => setStep('confirm')} disabled={!amountA || !amountB}>
                  Continue
                </Button>
              </div>
            ) : null}

            {step === 'confirm' ? (
              <div className="space-y-3 p-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">LP Tokens Received</div>
                  <div className="mt-2 text-lg font-extrabold text-slate-900">~ {Number(amountA || 0) + Number(amountB || 0)} LP</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Pool: {pairA}/{pairB} • Fee tier: 0.30% (demo)
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep('add')}>
                    Back
                  </Button>
                  <Button onClick={() => setStep('dashboard')} className="flex-1">
                    Confirm
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 'remove' ? (
              <div className="space-y-3 p-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">Remove your liquidity</div>
                  <div className="mt-1 text-sm text-slate-600">Select a position and withdraw a portion (demo).</div>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                      ETH/USDC
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                      MATIC/USDC
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep('dashboard')}>
                    Cancel
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => setStep('dashboard')}>
                    Remove
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Fee Arrangement</div>
              <div className="text-xs text-slate-500">Demo</div>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: '0.05%', note: 'Stable pairs' },
                { label: '0.30%', note: 'Standard' },
                { label: '1.00%', note: 'Exotic' },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                  <div className="text-xs text-slate-500">{t.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Theme Settings</div>
              <Badge tone="indigo">UI</Badge>
            </div>
            <div className="p-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="font-semibold text-slate-900">Compact cards</div>
                <Badge tone="green">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="font-semibold text-slate-900">Gradient background</div>
                <Badge tone="green">Enabled</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

