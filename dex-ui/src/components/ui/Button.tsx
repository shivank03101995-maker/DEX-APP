import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400/60 disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-sm',
        variant === 'primary' && 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500',
        variant === 'secondary' && 'bg-slate-900 text-white shadow-sm hover:bg-slate-800',
        variant === 'ghost' && 'bg-transparent text-slate-700 hover:bg-white/70',
        variant === 'danger' && 'bg-rose-600 text-white shadow-sm hover:bg-rose-500',
        className,
      )}
      {...props}
    />
  )
}

