import {
  BarChart3,
  BookOpen,
  Layers3,
  Lock,
  Repeat2,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { routes } from '../routes'

export type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const primaryNav: NavItem[] = [
  { to: routes.home, label: 'Landing', icon: Sparkles },
  { to: routes.docs, label: 'Docs & Analytics', icon: BookOpen },
  { to: routes.swap, label: 'Trading & Swaps', icon: Repeat2 },
  { to: routes.liquidity, label: 'Liquidity', icon: Layers3 },
  { to: routes.pools, label: 'Pools', icon: BarChart3 },
  { to: routes.analytics, label: 'Analytics', icon: BarChart3 },
  { to: routes.aggregator, label: 'Aggregator', icon: Settings2 },
  { to: routes.crossChain, label: 'Cross-Chain', icon: Repeat2 },
  { to: routes.wallet, label: 'Wallet', icon: Wallet },
]

export const secondaryNav: NavItem[] = [
  { to: routes.margin, label: 'Margin Trading', icon: ShieldCheck },
  { to: routes.settings, label: 'Settings', icon: Settings2 },
  { to: routes.security, label: 'Security', icon: Lock },
]

