import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserProvider } from 'ethers'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { SwapCard } from '../features/swap/SwapCard'
import type { SwapDraft, SwapStep } from '../features/swap/types'
import { getDexTokens } from '../data/tokens'
import { useWallet } from '../state/useWallet'
import {
  isDexConfigured,
  DEX_CHAIN_ID,
} from '../lib/dexConfig'
import {
  getAmountsOut,
  approveToken,
  swapExactTokensForTokens,
  buildPath,
  parseTokenAmount,
  formatTokenAmount,
} from '../lib/dexContracts'

function getDefaultDraft(): SwapDraft {
  const tokens = getDexTokens()
  const from = tokens[0]?.symbol ?? 'ETH'
  const to = tokens[1]?.symbol ?? 'USDC'
  return {
    fromToken: from,
    toToken: to === from ? (tokens[1] ? tokens[1].symbol : 'USDC') : to,
    fromAmount: '',
    toAmount: '',
    slippageBps: 50,
  }
}

export function SwapPage() {
  const { state: walletState, provider: walletProvider } = useWallet()
  const [step, setStep] = useState<SwapStep>('swap')
  const [draft, setDraft] = useState<SwapDraft>(getDefaultDraft)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [quoteToAmount, setQuoteToAmount] = useState<string>('')
  const [isConfirming, setIsConfirming] = useState(false)

  const tokens = useMemo(() => getDexTokens(), [])

  useEffect(() => {
    if (!isDexConfigured || !walletProvider || !draft.fromAmount || Number(draft.fromAmount) <= 0) {
      setQuoteToAmount('')
      return
    }
    const path = buildPath(draft.fromToken, draft.toToken)
    if (!path) {
      setQuoteToAmount('')
      return
    }
    const fromToken = tokens.find((t) => t.symbol === draft.fromToken)
    const toToken = tokens.find((t) => t.symbol === draft.toToken)
    if (!fromToken || !toToken?.decimals) {
      setQuoteToAmount('')
      return
    }
    let cancelled = false
    const run = async () => {
      try {
        const provider = new BrowserProvider(walletProvider)
        const amountInWei = parseTokenAmount(draft.fromAmount, fromToken)
        if (amountInWei === 0n) {
          if (!cancelled) setQuoteToAmount('')
          return
        }
        const amounts = await getAmountsOut(provider, amountInWei, path)
        if (cancelled) return
        const amountOut = amounts[amounts.length - 1]
        setQuoteToAmount(formatTokenAmount(amountOut, toToken.decimals))
      } catch {
        if (!cancelled) setQuoteToAmount('')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [draft.fromAmount, draft.fromToken, draft.toToken, tokens, walletProvider])

  const executeSwap = useCallback(
    async (d: SwapDraft): Promise<string | null> => {
      if (!walletProvider || !walletState.address) {
        throw new Error('Connect your wallet first.')
      }
      const expectedChainId = DEX_CHAIN_ID
      if (expectedChainId <= 0) {
        throw new Error('DEX chain not configured. Set VITE_CHAIN_ID=80002 in dex-ui/.env and restart the dev server.')
      }
      // Prefer wallet's eth_chainId so we match what the wallet UI shows (hex string)
      let walletChainId: number
      try {
        const hex = (await walletProvider.request({ method: 'eth_chainId' })) as string | undefined
        walletChainId = hex ? (hex.startsWith('0x') ? parseInt(hex, 16) : parseInt(hex, 10)) : 0
      } catch {
        const provider = new BrowserProvider(walletProvider)
        const network = await provider.getNetwork()
        walletChainId = typeof network.chainId === 'bigint' ? Number(network.chainId) : Number(network.chainId)
      }
      if (walletChainId !== expectedChainId) {
        throw new Error(
          `Wrong network. Wallet is on chain ID ${walletChainId}, but this DEX uses ${expectedChainId} (e.g. Polygon Amoy). Switch your wallet network.`
        )
      }
      const provider = new BrowserProvider(walletProvider)
      const signer = await provider.getSigner()
      const path = buildPath(d.fromToken, d.toToken)
      if (!path) throw new Error('Invalid token pair.')
      const fromToken = tokens.find((t) => t.symbol === d.fromToken)
      const toToken = tokens.find((t) => t.symbol === d.toToken)
      if (!fromToken || !toToken) throw new Error('Token not found.')
      const amountInWei = parseTokenAmount(d.fromAmount, fromToken)
      if (amountInWei === 0n) throw new Error('Invalid amount.')
      const slippageBps = d.slippageBps ?? 50
      const amountOutWei = quoteToAmount ? parseTokenAmount(quoteToAmount, toToken) : 0n
      const amountOutMinWei = amountOutWei > 0n ? (amountOutWei * BigInt(10000 - slippageBps)) / 10000n : 0n

      setIsConfirming(true)
      try {
        await approveToken(signer, path[0], amountInWei)
        const { hash } = await swapExactTokensForTokens(
          signer,
          amountInWei,
          amountOutMinWei,
          path,
          walletState.address
        )
        setTxHash(hash)
        setStep('pending')
        return hash
      } finally {
        setIsConfirming(false)
      }
    },
    [quoteToAmount, tokens, walletProvider, walletState.address]
  )

  const next = useCallback(() => {
    setStep((s) => (s === 'swap' ? 'confirm' : s === 'confirm' ? 'pending' : s === 'pending' ? 'success' : 'success'))
  }, [])
  const back = useCallback(() => setStep('swap'), [])
  const reset = useCallback(() => {
    setDraft(getDefaultDraft())
    setTxHash(null)
    setStep('swap')
  }, [])

  const timeline = useMemo(
    () => [
      { k: 'swap' as const, label: 'Swap Tokens' },
      { k: 'confirm' as const, label: 'Confirm Swap' },
      { k: 'pending' as const, label: 'Transaction Pending' },
      { k: 'success' as const, label: 'Swap Complete' },
    ],
    []
  )

  return (
    <div>
      <PageHeader
        title="Trading & Swaps"
        subtitle={
          isDexConfigured
            ? 'Swap TKA/TKB on Polygon Amoy. Connect wallet and ensure you are on the correct network.'
            : 'Swap flow: Swap → Confirm → Pending → Success.'
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SwapCard
            step={step}
            draft={draft}
            onDraftChange={setDraft}
            onNext={next}
            onBack={back}
            onReset={reset}
            estimatedToOverride={quoteToAmount}
            onConfirmSwap={isDexConfigured && walletState.connected ? executeSwap : undefined}
            txHash={txHash ?? undefined}
            isConfirming={isConfirming}
          />
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Swap Timeline</div>
              <Badge tone="indigo">{isDexConfigured ? 'LIVE' : 'TESTNET'}</Badge>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {timeline.map((t) => (
                  <div
                    key={t.k}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                    <Badge
                      tone={t.k === step ? 'indigo' : step === 'success' ? 'green' : 'slate'}
                    >
                      {t.k === step ? 'Current' : step === 'success' ? 'Done' : '—'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
              <div className="text-xs text-slate-500">
                {isDexConfigured ? 'On-chain swaps' : 'Demo data'}
              </div>
            </div>
            <div className="divide-y divide-slate-200/70">
              {[
                { pair: 'TKA → TKB', status: 'Success', tone: 'green' as const },
                { pair: 'TKB → TKA', status: 'Success', tone: 'green' as const },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{r.pair}</div>
                    <div className="text-xs text-slate-500">DEX Router</div>
                  </div>
                  <Badge tone={r.tone}>{r.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
