# dex-contracts

Smart contracts that match the current DEX UI scaffold:

- **AMM (constant product)** swaps
- **Liquidity pools** (LP token mint/burn)
- **Factory** to create pools
- **Router** to add/remove liquidity and swap via a path

## What’s included

- `contracts/DEXFactory.sol` – creates and tracks pairs
- `contracts/DEXPair.sol` – pool + LP ERC20
- `contracts/DEXRouter.sol` – user-facing liquidity + swap functions
- `contracts/MockERC20.sol` – mintable ERC20 for local testing

## Notes

- This is a minimal UniswapV2-style AMM implementation (token-token). It emits `Mint`, `Burn`, `Swap`, `Sync` events for analytics.
- Cross-chain, aggregator routing, and perps are **not** implemented here (UI-only in this repo today).

## Hardhat (Polygon deploy)

From the repo root:

```bash
cd dex-contracts
npm install
cp .env.example .env
```

Hardhat v3 requires **Node.js >= 18.19** (recommended: Node 20 LTS). If you’re on Node 16, upgrade Node first.

Edit `dex-contracts/.env`:

- `PRIVATE_KEY` – deployer key (funded with MATIC)
- `AMOY_RPC_URL` – Polygon Amoy RPC (testnet)
- `POLYGON_RPC_URL` – Polygon mainnet RPC

Compile:

```bash
npm run compile
```

Deploy to Amoy (recommended first):

```bash
npm run deploy:amoy
```

Seed 2 mock tokens + create a pool + do a test swap on Amoy:

```bash
npm run seed:amoy
```

Deploy to Polygon mainnet:

```bash
npm run deploy:polygon
```

## Deployments output

Scripts write addresses to `dex-contracts/deployments/<network>.json` (e.g. `amoy.json`), which you can reuse in the UI/app config.
