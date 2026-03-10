import { BookOpen, FileText, LineChart } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'

export function DocsAnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Docs & Analytics"
        subtitle="Documentation hub + quick analytics tiles (a top-level module in your diagram)."
        badge={{ label: 'TESTNET | Live', tone: 'indigo' }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Documentation</div>
            <Badge tone="slate">Starter</Badge>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {[
              { title: 'Getting Started', icon: BookOpen, desc: 'How to connect wallet, swap, and manage liquidity.' },
              { title: 'Smart Contract Guide', icon: FileText, desc: 'Where to integrate contract calls and events.' },
              { title: 'API Reference', icon: FileText, desc: 'Endpoints for pools, quotes, and analytics.' },
              { title: 'Security', icon: FileText, desc: 'Audit links, bug bounty, and best practices.' },
            ].map((d) => (
              <div key={d.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <d.icon className="h-4 w-4 text-indigo-600" />
                  <div className="text-sm font-extrabold text-slate-900">{d.title}</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Analytics Tiles</div>
              <Badge tone="indigo">Demo</Badge>
            </div>
            <div className="grid gap-3 p-4">
              {[
                { label: 'Daily Volume', value: '$1.84M', icon: LineChart },
                { label: 'Active Wallets', value: '12,340', icon: LineChart },
                { label: 'TVL', value: '$13.2M', icon: LineChart },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <t.icon className="h-4 w-4 text-purple-600" />
                    <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                  </div>
                  <Badge tone="slate">{t.value}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Changelog</div>
              <Badge tone="slate">v0.1</Badge>
            </div>
            <div className="p-4 text-sm text-slate-600">
              This is a professional scaffold based on your diagram. Next steps are plugging real quotes, wallet providers,
              and contract interactions.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

