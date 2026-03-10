import { ArrowDownUp, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { TOKENS } from '../../data/tokens'
import { cn } from '../../lib/cn'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Input } from '../../components/ui/Input'
import type { SwapDraft, SwapStep } from './types'

function tokenOptions() {
  return TOKENS.map((t) => ({ value: t.symbol, label: `${t.symbol} — ${t.name}` }))
}

function parseAmount(s: string) {
  const n = Number(s)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function SwapCard({
  title = 'Swap Tokens',
  step,
  draft,
  onDraftChange,
  onNext,
  onBack,
  onReset,
}: {
  title?: string
  step: SwapStep
  draft: SwapDraft
  onDraftChange: (next: SwapDraft) => void
  onNext: () => void
  onBack: () => void
  onReset: () => void
}) {
  const options = useMemo(() => tokenOptions(), [])
  const estRate = useMemo(() => {
    const from = parseAmount(draft.fromAmount)
    if (!from) return 0
    // demo pricing logic
    const price = draft.fromToken === 'ETH' && draft.toToken === 'USDC' ? 2000 : 1.25
    return price
  }, [draft.fromAmount, draft.fromToken, draft.toToken])

  const estimatedTo = useMemo(() => {
    const from = parseAmount(draft.fromAmount)
    if (!from) return ''
    const est = from * (estRate || 1)
    return est.toFixed(4)
  }, [draft.fromAmount, estRate])

  const content = (
    <div className="space-y-3 p-4">
      <div className="grid gap-3">
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-600">From</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Select
              value={draft.fromToken}
              onChange={(v) => onDraftChange({ ...draft, fromToken: v })}
              options={options}
              className="md:col-span-1"
            />
            <Input
              className="md:col-span-2"
              value={draft.fromAmount}
              onChange={(e) => onDraftChange({ ...draft, fromAmount: e.target.value, toAmount: '' })}
              placeholder="0.0"
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50"
            onClick={() =>
              onDraftChange({
                ...draft,
                fromToken: draft.toToken,
                toToken: draft.fromToken,
                fromAmount: draft.toAmount || draft.fromAmount,
                toAmount: '',
              })
            }
            aria-label="Switch tokens"
          >
            <ArrowDownUp className="h-4 w-4 text-slate-700" />
          </button>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold text-slate-600">To</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Select value={draft.toToken} onChange={(v) => onDraftChange({ ...draft, toToken: v })} options={options} />
            <Input
              className="md:col-span-2"
              value={draft.toAmount || estimatedTo}
              onChange={(e) => onDraftChange({ ...draft, toAmount: e.target.value })}
              placeholder="0.0"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          Slippage: {(draft.slippageBps / 100).toFixed(2)}%
        </div>
        <div className="text-xs text-slate-600">
          Est. rate: <span className="font-semibold text-slate-900">{estRate ? estRate.toFixed(4) : '—'}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div className="card-title">{title}</div>
        <div className="text-xs font-semibold text-slate-500">
          Step:{' '}
          <span className="rounded-full bg-indigo-600/10 px-2 py-1 text-indigo-700">
            {step === 'swap' ? 'Swap' : step === 'confirm' ? 'Confirm' : step === 'pending' ? 'Pending' : 'Success'}
          </span>
        </div>
      </div>

      {step === 'swap' ? content : null}

      {step === 'confirm' ? (
        <div className="space-y-3 p-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="text-xs font-semibold text-slate-600">Confirm Swap</div>
            <div className="mt-2 text-sm font-bold text-slate-900">
              {draft.fromAmount || '0'} {draft.fromToken} → {draft.toAmount || estimatedTo || '0'} {draft.toToken}
            </div>
            <div className="mt-1 text-xs text-slate-600">Route: Best price (demo) • Fee: 0.30%</div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button className="flex-1" onClick={onNext}>
              Confirm Swap
            </Button>
          </div>
        </div>
      ) : null}

      {step === 'pending' ? (
        <div className="space-y-3 p-4">
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-indigo-600" />
            <div>
              <div className="text-sm font-bold text-slate-900">Transaction Pending</div>
              <div className="mt-1 text-xs text-slate-600">Waiting for confirmations…</div>
              <div className="mt-2 text-xs font-semibold text-slate-700">
                {draft.fromAmount || '0'} {draft.fromToken} → {draft.toAmount || estimatedTo || '0'} {draft.toToken}
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={onNext}>
            Simulate Confirmed
          </Button>
        </div>
      ) : null}

      {step === 'success' ? (
        <div className="space-y-3 p-4">
          <div className={cn('flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3')}>
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
            <div>
              <div className="text-sm font-bold text-slate-900">Swap Successful</div>
              <div className="mt-1 text-xs text-slate-600">Your swap has completed (demo).</div>
              <div className="mt-2 text-xs font-semibold text-slate-700">
                {draft.fromAmount || '0'} {draft.fromToken} → {draft.toAmount || estimatedTo || '0'} {draft.toToken}
              </div>
            </div>
          </div>
          <Button variant="ghost" className="w-full" onClick={onReset}>
            New Swap
          </Button>
        </div>
      ) : null}

      {step === 'swap' ? (
        <div className="border-t border-slate-200/70 p-4">
          <Button className="w-full" onClick={onNext} disabled={!draft.fromAmount || Number(draft.fromAmount) <= 0}>
            Swap
          </Button>
        </div>
      ) : null}
    </div>
  )
}

