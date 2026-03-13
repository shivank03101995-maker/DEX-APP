/**
 * Token lists: generic (no addresses) and chain-specific for the deployed DEX.
 * For Amoy (80002), use Token A and Token B from your seed deployment.
 */

export type TokenSymbol =
  | 'ETH'
  | 'USDC'
  | 'DAI'
  | 'WBTC'
  | 'MATIC'
  | 'TKA'  // Token A (MockERC20 from dex-contracts seed)
  | 'TKB'  // Token B (MockERC20 from dex-contracts seed)

export type Token = {
  symbol: TokenSymbol
  name: string
  decimals: number
  /** Contract address on a specific chain; required for swap/liquidity contract calls. */
  address?: string
}

/** Generic token list (no addresses); used when DEX chain is not configured. */
export const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { symbol: 'DAI', name: 'Dai', decimals: 18 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
  { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
]

/** Amoy testnet chain ID (Polygon Amoy). */
export const AMOY_CHAIN_ID = 80002

/**
 * Token A and Token B from your dex-contracts seed on Amoy.
 * Use these addresses when DEX_CHAIN_ID is 80002 so the UI can call the Router.
 */
export const TOKENS_AMOY: Token[] = [
  {
    symbol: 'TKA',
    name: 'Token A',
    decimals: 18,
    address: '0xc07cf0dA0722448C2e60a0d91296DC6D9A5A10c7',
  },
  {
    symbol: 'TKB',
    name: 'Token B',
    decimals: 18,
    address: '0xDf1cA9dd8EE9294cd62f230EE6bE54Cfc20161B5',
  },
]

/**
 * Returns the token list for the given chain.
 * For Amoy (80002) returns TOKENS_AMOY (Token A & B with addresses).
 * Otherwise returns TOKENS (generic list without addresses).
 */
export function getTokensForChain(chainId: number): Token[] {
  if (chainId === AMOY_CHAIN_ID) return TOKENS_AMOY
  return TOKENS
}

import { DEX_CHAIN_ID, isDexConfigured } from '../lib/dexConfig'

/** Token list for the currently configured DEX chain (when .env has router/factory/chainId). */
export function getDexTokens(): Token[] {
  return isDexConfigured ? getTokensForChain(DEX_CHAIN_ID) : TOKENS
}
