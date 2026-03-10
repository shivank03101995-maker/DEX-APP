import { Badge } from './ui/Badge'

export function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string
  subtitle?: string
  badge?: { label: string; tone?: 'indigo' | 'slate' | 'green' | 'amber' }
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
      </div>
      {badge ? <Badge tone={badge.tone ?? 'indigo'}>{badge.label}</Badge> : null}
    </div>
  )
}

