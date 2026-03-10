import type React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { primaryNav, secondaryNav } from './nav'

function NavGroup({ title, items }: { title: string; items: Array<{ to: string; label: string; icon: React.ComponentType<{ className?: string }> }> }) {
  return (
    <div className="space-y-2">
      <div className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:bg-white/70 hover:shadow-sm',
              )
            }
          >
            <item.icon className="h-4 w-4 opacity-90" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export function SidebarNav() {
  return (
    <div className="card sticky top-6 overflow-hidden">
      <div className="card-header">
        <div>
          <div className="text-sm font-bold text-slate-900">DEX UI</div>
          <div className="card-subtitle">TESTNET | Live</div>
        </div>
        <div className="rounded-full bg-indigo-600/10 px-2 py-1 text-[11px] font-semibold text-indigo-700">v0.1</div>
      </div>

      <div className="space-y-5 p-3">
        <NavGroup title="Core" items={primaryNav} />
        <NavGroup title="Advanced" items={secondaryNav} />
      </div>
    </div>
  )
}

