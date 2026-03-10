import { cn } from '../../lib/cn'

export function Badge({
  children,
  tone = 'indigo',
  className,
}: {
  children: React.ReactNode
  tone?: 'indigo' | 'slate' | 'green' | 'amber'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold',
        tone === 'indigo' && 'bg-indigo-600/10 text-indigo-700',
        tone === 'slate' && 'bg-slate-900/10 text-slate-700',
        tone === 'green' && 'bg-emerald-600/10 text-emerald-700',
        tone === 'amber' && 'bg-amber-600/10 text-amber-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

