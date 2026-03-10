import type { Token } from '../../data/tokens'

export type SwapStep = 'swap' | 'confirm' | 'pending' | 'success'

export type SwapDraft = {
  fromToken: Token['symbol']
  toToken: Token['symbol']
  fromAmount: string
  toAmount: string
  slippageBps: number
}

