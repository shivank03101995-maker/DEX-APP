import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'

const data = [
  { name: 'Mon', volume: 1.2, tvl: 11.8 },
  { name: 'Tue', volume: 1.35, tvl: 12.1 },
  { name: 'Wed', volume: 1.1, tvl: 12.3 },
  { name: 'Thu', volume: 1.6, tvl: 12.0 },
  { name: 'Fri', volume: 1.9, tvl: 12.6 },
  { name: 'Sat', volume: 1.4, tvl: 12.9 },
  { name: 'Sun', volume: 2.1, tvl: 13.2 },
]

export function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics Page" subtitle="Protocol metrics with a clean, professional chart layout (demo data)." />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Volume & TVL (7d)</div>
            <Badge tone="indigo">Demo</Badge>
          </div>
          <div className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="tvl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 12,
                    border: '1px solid rgba(226,232,240,0.9)',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="#6366f1" fill="url(#vol)" strokeWidth={2} />
                <Area type="monotone" dataKey="tvl" stroke="#a855f7" fill="url(#tvl)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Key Metrics</div>
              <Badge tone="slate">7d</Badge>
            </div>
            <div className="grid gap-3 p-4">
              {[
                { label: 'Total Volume', value: '$9.65M', tone: 'indigo' as const },
                { label: 'TVL', value: '$13.2M', tone: 'green' as const },
                { label: 'Fees', value: '$28.4K', tone: 'amber' as const },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-sm font-semibold text-slate-900">{m.label}</div>
                  <Badge tone={m.tone}>{m.value}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Notes</div>
              <Badge tone="indigo">Docs</Badge>
            </div>
            <div className="p-4 text-sm text-slate-600">
              This page is wired to a charting library and a consistent “card” system. Replace the `data` array with your
              real analytics API to make it production-ready.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

