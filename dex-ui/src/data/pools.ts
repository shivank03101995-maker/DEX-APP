export type Pool = {
  id: string
  pair: string
  tvlUsd: number
  volume24hUsd: number
  feeTierBps: 5 | 30 | 100
}

export const POOLS: Pool[] = [
  { id: 'eth-usdc-30', pair: 'ETH/USDC', tvlUsd: 12500000, volume24hUsd: 1840000, feeTierBps: 30 },
  { id: 'eth-dai-30', pair: 'ETH/DAI', tvlUsd: 4200000, volume24hUsd: 610000, feeTierBps: 30 },
  { id: 'matic-usdc-5', pair: 'MATIC/USDC', tvlUsd: 3100000, volume24hUsd: 540000, feeTierBps: 5 },
  { id: 'wbtc-eth-100', pair: 'WBTC/ETH', tvlUsd: 2800000, volume24hUsd: 330000, feeTierBps: 100 },
]

