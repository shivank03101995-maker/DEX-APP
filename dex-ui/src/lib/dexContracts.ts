/**
 * DEX Router and ERC20 helpers for quotes and swap execution.
 * Uses addresses from dexConfig; pass an ethers Provider for reads and Signer for writes.
 */

import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers'
import type { Token } from '../data/tokens'
import { DEX_ROUTER_ADDRESS, isDexConfigured } from './dexConfig'
import { getDexTokens } from '../data/tokens'

const ROUTER_ABI = [
  'function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)',
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
] as const

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const

export type EthersProvider = InstanceType<typeof BrowserProvider>
export type EthersSigner = Awaited<ReturnType<EthersProvider['getSigner']>>

function getRouterContract(signerOrProvider: EthersSigner | EthersProvider) {
  return new Contract(DEX_ROUTER_ADDRESS, ROUTER_ABI, signerOrProvider)
}

/** Get the token address for a symbol from the DEX token list (must have address). */
export function getTokenAddress(symbol: string): string | undefined {
  if (!isDexConfigured) return undefined
  const tokens = getDexTokens()
  return tokens.find((t) => t.symbol === symbol)?.address
}

/** Get expected output amounts for a path (read-only). */
export async function getAmountsOut(
  provider: EthersProvider,
  amountInWei: bigint,
  path: string[]
): Promise<bigint[]> {
  const router = getRouterContract(provider)
  const amounts = (await router.getAmountsOut(amountInWei, path)) as bigint[]
  return amounts
}

/** Approve token spending for the router. */
export async function approveToken(
  signer: EthersSigner,
  tokenAddress: string,
  amountWei: bigint
): Promise<{ hash: string }> {
  const token = new Contract(tokenAddress, ERC20_ABI, signer)
  const tx = await token.approve(DEX_ROUTER_ADDRESS, amountWei)
  await tx.wait()
  return { hash: tx.hash }
}

/** Execute swap; caller must have approved the router for the input token. */
export async function swapExactTokensForTokens(
  signer: EthersSigner,
  amountInWei: bigint,
  amountOutMinWei: bigint,
  path: string[],
  toAddress: string,
  deadlineSeconds?: number
): Promise<{ hash: string }> {
  const deadline = deadlineSeconds ?? Math.floor(Date.now() / 1000) + 60 * 20
  const router = getRouterContract(signer)
  const tx = await router.swapExactTokensForTokens(
    amountInWei,
    amountOutMinWei,
    path,
    toAddress,
    deadline
  )
  await tx.wait()
  return { hash: tx.hash }
}

/** Parse human amount to wei using token decimals. */
export function parseTokenAmount(amount: string, token: Token): bigint {
  return parseUnits(amount || '0', token.decimals)
}

/** Format wei to human amount. */
export function formatTokenAmount(amountWei: bigint, decimals: number): string {
  return formatUnits(amountWei, decimals)
}

/** Build path [fromTokenAddress, toTokenAddress] for the current DEX chain. */
export function buildPath(fromSymbol: string, toSymbol: string): string[] | null {
  const fromAddr = getTokenAddress(fromSymbol)
  const toAddr = getTokenAddress(toSymbol)
  if (!fromAddr || !toAddr || fromAddr === toAddr) return null
  return [fromAddr, toAddr]
}
