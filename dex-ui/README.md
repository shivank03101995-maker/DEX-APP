# DEX UI (Architecture-based Scaffold)

Professional DEX front-end scaffold built **based on the provided DEX UI architecture image**.

## What’s included

- **App shell**: sidebar navigation + top bar (network select + wallet connect mock)
- **Modules/routes** aligned to the diagram:
  - Landing
  - Docs & Analytics
  - Trading & Swaps (Swap → Confirm → Pending → Success)
  - Liquidity Management (Dashboard + Add/Confirm/Remove)
  - Pools Overview + Pool Details
  - Analytics (charts via Recharts)
  - Aggregator (route selection scaffold)
  - Cross-chain swap (bridge scaffold)
  - Wallet Dashboard
  - Settings (gas, slippage, deadline)
  - Security + Audit Reports
- **UI system**: Tailwind-based card layout, buttons, inputs, badges, selects
- **Mock data**: tokens/pools for UI development

## Tech stack

- React + TypeScript + Vite
- React Router
- Tailwind CSS
- Lucide icons
- Recharts (pinned to a Node-16-compatible version)

## Run locally

```bash
npm install
npm run dev
```

## Code structure

```text
src/
  app/
    router.tsx
    shell/                # AppShell, SidebarNav, TopNav
  components/             # PageHeader + UI primitives
  data/                   # mock tokens/pools
  features/
    swap/                 # swap flow UI
  pages/                  # route pages (modules)
  state/                  # local wallet state mock
```

## Next steps (production integration)

- Replace `src/state/useWallet.ts` with a real wallet connector (e.g. wagmi / web3modal)
- Replace swap/liquidity mocks with on-chain quote + tx execution
- Add API layer for analytics/pools and real-time updates
