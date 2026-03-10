import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export function MarginTradingPage() {
  return (
    <div>
      <PageHeader title="Margin Trading" subtitle="Margin trading module placeholder (as in your diagram)." badge={{ label: 'Beta', tone: 'amber' }} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Open Positions</div>
            <Badge tone="slate">Demo</Badge>
          </div>
          <div className="divide-y divide-slate-200/70">
            {[
              { pair: 'ETH/USDC', side: 'Long', pnl: '+$120.40', tone: 'green' as const, icon: ArrowUp },
              { pair: 'WBTC/ETH', side: 'Short', pnl: '-$42.10', tone: 'amber' as const, icon: ArrowDown },
            ].map((p) => (
              <div key={p.pair} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <p.icon className="h-4 w-4 text-indigo-600" />
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{p.pair}</div>
                    <div className="text-xs text-slate-500">{p.side}</div>
                  </div>
                </div>
                <Badge tone={p.tone}>{p.pnl}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">New Position</div>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </div>
            <div className="p-4 space-y-2 text-sm text-slate-600">
              This is UI-only scaffolding. Connect a perp/margin protocol SDK to power this screen.
              <Button className="mt-3 w-full">Open position (demo)</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

