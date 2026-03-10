import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { POOLS } from '../data/pools'

function formatUsd(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export function PoolsPage() {
  const [selectedId, setSelectedId] = useState(POOLS[0]?.id)
  const selected = useMemo(() => POOLS.find((p) => p.id === selectedId) ?? POOLS[0], [selectedId])

  return (
    <div>
      <PageHeader title="Pools Overview" subtitle="Browse pools, view pool details, and jump into analytics (demo data)." />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card overflow-hidden">
          <div className="card-header">
            <div className="card-title">Top Pools</div>
            <Badge tone="slate">Overview</Badge>
          </div>
          <div className="divide-y divide-slate-200/70">
            {POOLS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{p.pair}</div>
                  <div className="text-xs text-slate-500">Fee tier: {(p.feeTierBps / 100).toFixed(2)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">TVL</div>
                  <div className="text-sm font-bold text-slate-900">{formatUsd(p.tvlUsd)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Pool Details</div>
            <Badge tone="indigo">{selected?.pair}</Badge>
          </div>
          <div className="p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs text-slate-500">TVL</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">{selected ? formatUsd(selected.tvlUsd) : '—'}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs text-slate-500">Volume (24h)</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">
                  {selected ? formatUsd(selected.volume24hUsd) : '—'}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs text-slate-500">Fee tier</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">
                  {selected ? `${(selected.feeTierBps / 100).toFixed(2)}%` : '—'}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-bold text-slate-900">Pool Analytics</div>
                <div className="mt-1 text-sm text-slate-600">Open the Analytics page for charts and trends.</div>
                <div className="mt-3">
                  <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    View charts (see Analytics)
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-bold text-slate-900">Actions</div>
                <div className="mt-1 text-sm text-slate-600">Add/remove liquidity for this pair from Liquidity module.</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button>Add liquidity</Button>
                  <Button variant="ghost">Remove</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

