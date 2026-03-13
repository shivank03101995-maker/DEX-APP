import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './shell/AppShell'
import { LandingPage } from '../pages/LandingPage'
import { DocsAnalyticsPage } from '../pages/DocsAnalyticsPage'
import { SwapPage } from '../pages/SwapPage'
import { AggregatorPage } from '../pages/AggregatorPage'
import { CrossChainPage } from '../pages/CrossChainPage'
import { WalletDashboardPage } from '../pages/WalletDashboardPage'
import { LiquidityPage } from '../pages/LiquidityPage'
import { PoolsPage } from '../pages/PoolsPage'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { MarginTradingPage } from '../pages/MarginTradingPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SecurityPage } from '../pages/SecurityPage'
import { AuditReportsPage } from '../pages/AuditReportsPage'
import { routes } from './routes'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { RequireAuth } from './RequireAuth'

export const router = createBrowserRouter(
  [
    {
      path: routes.register,
      element: <RegisterPage />,
    },
    {
      path: routes.login,
      element: <LoginPage />,
    },
    {
      path: routes.home,
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <LandingPage /> },
      { path: routes.docs, element: <DocsAnalyticsPage /> },
      { path: routes.swap, element: <SwapPage /> },
      { path: routes.aggregator, element: <AggregatorPage /> },
      { path: routes.crossChain, element: <CrossChainPage /> },
      { path: routes.wallet, element: <WalletDashboardPage /> },
      { path: routes.liquidity, element: <LiquidityPage /> },
      { path: routes.pools, element: <PoolsPage /> },
      { path: routes.analytics, element: <AnalyticsPage /> },
      { path: routes.margin, element: <MarginTradingPage /> },
      { path: routes.settings, element: <SettingsPage /> },
      { path: routes.security, element: <SecurityPage /> },
      { path: routes.auditReports, element: <AuditReportsPage /> },
      { path: '*', element: <Navigate to={routes.home} replace /> },
    ],
    },
  ],
  { future: { v7_startTransition: true } }
)
