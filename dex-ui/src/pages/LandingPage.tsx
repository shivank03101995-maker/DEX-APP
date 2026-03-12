import { BarChart3, BookOpen, Layers3, Repeat2, Settings2, ShieldCheck, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { routes } from '../app/routes'

type CardProps = {
  to?: string
  title: string
  subtitle?: string
  pill?: string
  tone?: 'purple' | 'white'
  icon?: React.ComponentType<{ className?: string }>
}

function ArchitectureCard({ to, title, subtitle, pill, tone = 'white', icon: Icon }: CardProps) {
  const body = (
    <div
      className={
        tone === 'purple'
          ? 'relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d2a8e] via-[#3b2fb4] to-[#7b3cff] p-4 text-white shadow-sm'
          : 'h-full w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
      }
    >
      {tone === 'purple' ? (
        <>
          <div className="pointer-events-none absolute inset-x-[-40%] bottom-[-40%] h-40 rounded-[999px] bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 41) % 90}%`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="relative flex min-h-[140px] flex-col justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 items-center gap-2">
            {Icon ? (
              <span
                className={
                  tone === 'purple'
                    ? 'flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs'
                    : 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs text-indigo-600'
                }
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            ) : null}
            <div
              className={
                tone === 'purple'
                  ? 'min-w-0 text-sm font-semibold leading-snug text-white'
                  : 'min-w-0 text-sm font-semibold leading-snug text-slate-900'
              }
            >
              {title}
            </div>
          </div>
          {subtitle ? (
            <div
              className={
                tone === 'purple'
                  ? 'text-xs leading-snug text-white/80'
                  : 'text-xs leading-snug text-slate-600'
              }
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        {pill ? (
          <div className="mt-1">
            <Badge
              tone={tone === 'purple' ? 'indigo' : 'slate'}
              className={tone === 'purple' ? 'bg-white/15 text-white' : undefined}
            >
              {pill}
            </Badge>
          </div>
        ) : null}
      </div>
    </div>
  )

  if (!to) return body
  return (
    <Link to={to} className="block transition hover:-translate-y-0.5 hover:shadow-md">
      {body}
    </Link>
  )
}

export function LandingPage() {
  return (
    <div>
      {/* Top heading like the architecture diagram */}
      <div className="mb-5 text-center">
        <div className="text-xs font-semibold tracking-[0.22em] text-slate-500">
          ADVANCED DECENTRALIZED EXCHANGE
        </div>
        <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          DEX UI Architecture with Extended Features
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Landing, docs & analytics, trading & swaps, liquidity, pools, analytics, wallet, aggregator, cross-chain, and
          security.
        </div>
      </div>

      {/* Row 1: Landing / Docs & Analytics / Aggregator & Cross-Chain / Wallet */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Landing Page</div>
          <Badge tone="indigo">TESTNET | Live</Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.9fr)]">
          {/* <ArchitectureCard
            to={routes.home}
            title="Advanced Decentralized Exchange"
            subtitle="Hero-like landing module with QUICK SWAP entrypoint."
            pill="Landing"
            tone="purple"
          /> */}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ArchitectureCard
              to={routes.docs}
              title="Docs & Analytics"
              subtitle="Documentation hub and protocol metrics."
              pill="Docs"
              icon={BookOpen}
            />
            <ArchitectureCard
              to={routes.aggregator}
              title="Aggregator & Cross-Chain"
              subtitle="Best price and cross-chain routing."
              pill="Routing"
              icon={Settings2}
            />
            <ArchitectureCard
              to={routes.wallet}
              title="Wallet Dashboard"
              subtitle="Balances, activity, and quick actions."
              pill="Wallet"
              icon={Wallet}
            />
          </div>
        </div>
      </section>

      {/* Row 2: Trading & Swaps */}
      <section className="mt-8 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trading & Swaps</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <ArchitectureCard
            to={routes.swap}
            title="Swap Tokens"
            subtitle="Select from / to tokens."
            pill="Step 1"
            icon={Repeat2}
          />
          <ArchitectureCard
            to={routes.swap}
            title="Confirm Swap"
            subtitle="Route and fee preview."
            pill="Step 2"
            icon={Repeat2}
          />
          <ArchitectureCard
            to={routes.swap}
            title="Transaction Pending"
            subtitle="Waiting for confirmations."
            pill="Step 3"
            icon={Repeat2}
          />
          <ArchitectureCard
            to={routes.swap}
            title="Swap Successful"
            subtitle="On-chain confirmation."
            pill="Step 4"
            icon={Repeat2}
          />
          <ArchitectureCard
            to={routes.swap}
            title="Swap Complete"
            subtitle="Final status UI."
            icon={Repeat2}
          />
          <ArchitectureCard
            to={routes.swap}
            title="Recent Swaps"
            subtitle="Activity snapshot."
            icon={Repeat2}
          />
        </div>
      </section>

      {/* Row 3: Liquidity Management */}
      <section className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Liquidity Management</div>
          <Badge tone="indigo">TESTNET | Live</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <ArchitectureCard
            to={routes.liquidity}
            title="Liquidity Dashboard"
            subtitle="Your LP positions and pool exposure."
            icon={Layers3}
          />
          <ArchitectureCard
            to={routes.liquidity}
            title="Add Liquidity"
            subtitle="Choose token pair and amounts."
            pill="Add"
            icon={Layers3}
          />
          <ArchitectureCard
            to={routes.liquidity}
            title="Confirm Liquidity"
            subtitle="LP token preview and details."
            pill="Confirm"
            icon={Layers3}
          />
          <ArchitectureCard
            to={routes.liquidity}
            title="Swaps Liquidity"
            subtitle="Remove or adjust LP share."
            icon={Layers3}
          />
          <ArchitectureCard
            to={routes.settings}
            title="Theme / Fee Settings"
            subtitle="Fee tiers, UI, and toggles."
            icon={Settings2}
          />
        </div>
      </section>

      {/* Row 4: Pool & Analytics */}
      <section className="mt-8 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pool & Analytics</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <ArchitectureCard
            to={routes.pools}
            title="Pools Overview"
            subtitle="Top pools view with TVL."
            icon={BarChart3}
          />
          <ArchitectureCard
            to={routes.pools}
            title="Pool Details"
            subtitle="Pair-specific metrics."
            icon={BarChart3}
          />
          <ArchitectureCard
            to={routes.analytics}
            title="Analytics Page"
            subtitle="Volume, TVL, and fee charts."
            icon={BarChart3}
          />
          <ArchitectureCard
            to={routes.margin}
            title="Margin Trading"
            subtitle="Perps / leverage UI scaffold."
            icon={BarChart3}
          />
          <ArchitectureCard
            to={routes.settings}
            title="Trading Settings"
            subtitle="Gas, slippage, deadline."
            icon={Settings2}
          />
        </div>
      </section>

      {/* Row 5: Security */}
      <section className="mt-8 space-y-3 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Security</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ArchitectureCard
            to={routes.security}
            title="Security Dashboard"
            subtitle="Threat monitor and status."
            pill="Secure"
            icon={ShieldCheck}
          />
          <ArchitectureCard
            to={routes.auditReports}
            title="Audit Reports"
            subtitle="External audit links."
            icon={ShieldCheck}
          />
          <ArchitectureCard
            to={routes.settings}
            title="Enhanced Settings"
            subtitle="MEV protection & whitelists."
            icon={ShieldCheck}
          />
          <ArchitectureCard
            title="Bug Bounty"
            subtitle="Connect your bounty program."
            icon={ShieldCheck}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
          <span>
            This homepage mirrors the architecture diagram visually; each card links into the fully implemented feature
            screens.
          </span>
        </div>
      </section>
    </div>
  )
}
