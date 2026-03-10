import { ArrowLeft, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '../app/routes'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'

export function AuditReportsPage() {
  return (
    <div>
      <PageHeader title="Audit Reports" subtitle="Central place for audit documents (UI scaffold)." badge={{ label: 'Security', tone: 'slate' }} />

      <Link to={routes.security} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-600">
        <ArrowLeft className="h-4 w-4" /> Back to Security
      </Link>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          { vendor: 'OpenZeppelin', date: '2026-02-12', status: 'Passed', tone: 'green' as const },
          { vendor: 'CertiK', date: '2026-01-22', status: 'Passed', tone: 'green' as const },
          { vendor: 'ChainSecurity', date: '2025-12-05', status: 'Notes', tone: 'amber' as const },
          { vendor: 'Trail of Bits', date: '2025-11-18', status: 'Planned', tone: 'slate' as const },
        ].map((r) => (
          <div key={r.vendor} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                <div className="text-sm font-extrabold text-slate-900">{r.vendor}</div>
              </div>
              <Badge tone={r.tone}>{r.status}</Badge>
            </div>
            <div className="mt-2 text-sm text-slate-600">Report date: {r.date}</div>
            <div className="mt-3 text-xs text-slate-500">Attach PDF links / IPFS hashes here in production.</div>
          </div>
        ))}
      </div>
    </div>
  )
}

