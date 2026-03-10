import { useCallback, useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { SwapCard } from '../features/swap/SwapCard'
import type { SwapDraft, SwapStep } from '../features/swap/types'

const DEFAULT_DRAFT: SwapDraft = {
  fromToken: 'ETH',
  toToken: 'USDC',
  fromAmount: '',
  toAmount: '',
  slippageBps: 50,
}

export function SwapPage() {
  const [step, setStep] = useState<SwapStep>('swap')
  const [draft, setDraft] = useState<SwapDraft>(DEFAULT_DRAFT)

  const next = useCallback(() => {
    setStep((s) => (s === 'swap' ? 'confirm' : s === 'confirm' ? 'pending' : s === 'pending' ? 'success' : 'success'))
  }, [])
  const back = useCallback(() => setStep('swap'), [])
  const reset = useCallback(() => {
    setDraft(DEFAULT_DRAFT)
    setStep('swap')
  }, [])

  const timeline = useMemo(() => {
    const steps: Array<{ k: SwapStep; label: string }> = [
      { k: 'swap', label: 'Swap Tokens' },
      { k: 'confirm', label: 'Confirm Swap' },
      { k: 'pending', label: 'Transaction Pending' },
      { k: 'success', label: 'Swap Complete' },
    ]
    return steps
  }, [])

  return (
    <div>
      <PageHeader title="Trading & Swaps" subtitle="Swap flow exactly like the diagram: Swap → Confirm → Pending → Success." />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SwapCard step={step} draft={draft} onDraftChange={setDraft} onNext={next} onBack={back} onReset={reset} />
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Swap Timeline</div>
              <Badge tone="indigo">TESTNET</Badge>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {timeline.map((t) => (
                  <div key={t.k} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                    <Badge tone={t.k === step ? 'indigo' : step === 'success' ? 'green' : 'slate'}>{t.k === step ? 'Current' : step === 'success' ? 'Done' : '—'}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
              <div className="text-xs text-slate-500">Demo data</div>
            </div>
            <div className="divide-y divide-slate-200/70">
              {[
                { pair: 'ETH → USDC', status: 'Success', tone: 'green' as const },
                { pair: 'USDC → DAI', status: 'Success', tone: 'green' as const },
                { pair: 'ETH → WBTC', status: 'Pending', tone: 'amber' as const },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{r.pair}</div>
                    <div className="text-xs text-slate-500">Route: Aggregator (demo)</div>
                  </div>
                  <Badge tone={r.tone}>{r.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

