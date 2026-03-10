import { Bug, FileCheck2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '../app/routes'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export function SecurityPage() {
  return (
    <div>
      <PageHeader
        title="Security"
        subtitle="Security dashboard module from your diagram (reports, scanning, and audit links scaffold)."
        badge={{ label: 'SECURITY', tone: 'slate' }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Security Dashboard</div>
            <Badge tone="green">Healthy</Badge>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {[
              { title: 'Contract Verified', desc: 'Source verification complete (demo).', icon: FileCheck2, tone: 'green' as const },
              { title: 'Threat Monitor', desc: 'No anomalies detected (demo).', icon: ShieldCheck, tone: 'green' as const },
              { title: 'Content Risk', desc: 'External links monitored (demo).', icon: ShieldAlert, tone: 'amber' as const },
              { title: 'Bug Bounty', desc: 'Rewards available (demo).', icon: Bug, tone: 'indigo' as const },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <c.icon className="h-4 w-4 text-indigo-600" />
                    <div className="text-sm font-extrabold text-slate-900">{c.title}</div>
                  </div>
                  <Badge tone={c.tone}>{c.tone === 'green' ? 'OK' : c.tone === 'amber' ? 'Watch' : 'Info'}</Badge>
                </div>
                <div className="mt-2 text-sm text-slate-600">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Audit Reports</div>
              <Badge tone="slate">Links</Badge>
            </div>
            <div className="space-y-2 p-4 text-sm text-slate-600">
              {['CertiK', 'OpenZeppelin', 'ChainSecurity'].map((x) => (
                <div key={x} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="font-semibold text-slate-900">{x}</div>
                  <Badge tone="indigo">Report</Badge>
                </div>
              ))}
              <Link to={routes.auditReports}>
                <Button className="mt-2 w-full" variant="ghost">
                  View all reports
                </Button>
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Enhanced Security</div>
              <Badge tone="slate">Advanced</Badge>
            </div>
            <div className="space-y-2 p-4 text-sm text-slate-600">
              {['Multi-sig admin', 'MFA wallet', 'All settings panels'].map((x) => (
                <div key={x} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="font-semibold text-slate-900">{x}</div>
                  <Badge tone="green">Enabled</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

