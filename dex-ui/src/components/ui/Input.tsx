import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  endAdornment?: React.ReactNode
}

export function Input({ className, endAdornment, ...props }: InputProps) {
  return (
    <div className={cn('flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm', className)}>
      <input
        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        {...props}
      />
      {endAdornment ? <div className="shrink-0">{endAdornment}</div> : null}
    </div>
  )
}

