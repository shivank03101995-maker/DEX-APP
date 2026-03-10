export type Token = {
  symbol: 'ETH' | 'USDC' | 'DAI' | 'WBTC' | 'MATIC'
  name: string
  decimals: number
}

export const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { symbol: 'DAI', name: 'Dai', decimals: 18 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
  { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
]

