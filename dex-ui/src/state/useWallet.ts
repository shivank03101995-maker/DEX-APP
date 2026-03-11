import { useCallback, useEffect, useMemo, useState } from 'react'

type WalletState = {
  connected: boolean
  address?: string
  network: 'Ethereum' | 'Polygon' | 'Arbitrum'
}

const STORAGE_KEY = 'dex_ui_wallet_state_v1'

function networkFromChainId(chainId: string | undefined): WalletState['network'] {
  switch (String(chainId ?? '').toLowerCase()) {
    case '0x89':
      return 'Polygon'
    case '0xa4b1':
      return 'Arbitrum'
    case '0x1':
    default:
      return 'Ethereum'
  }
}

function randomAddress() {
  const hex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  return `0x${hex}`
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({ connected: false, network: 'Ethereum' })

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as WalletState
      if (typeof parsed?.connected === 'boolean' && typeof parsed?.network === 'string') setState(parsed)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const eth = (window as unknown as { ethereum?: { request?: (args: { method: string }) => Promise<unknown> } }).ethereum
    const request = eth?.request
    if (!request) return
    void (async () => {
      try {
        const accounts = (await request({ method: 'eth_accounts' })) as unknown
        const first = Array.isArray(accounts) ? accounts[0] : undefined
        if (typeof first === 'string' && first.startsWith('0x')) {
          const chainId = (await request({ method: 'eth_chainId' })) as unknown
          setState((s) => ({ ...s, connected: true, address: first, network: networkFromChainId(typeof chainId === 'string' ? chainId : undefined) }))
        }
      } catch {
        // ignore
      }
    })()
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const connect = useCallback(async () => {
    const eth = (
      window as unknown as {
        ethereum?: {
          request?: (args: { method: string }) => Promise<unknown>
        }
      }
    ).ethereum

    const request = eth?.request
    if (request) {
      try {
        const accounts = (await request({ method: 'eth_requestAccounts' })) as unknown
        const first = Array.isArray(accounts) ? accounts[0] : undefined
        if (typeof first === 'string' && first.startsWith('0x')) {
          const chainId = (await request({ method: 'eth_chainId' })) as unknown
          setState((s) => ({
            ...s,
            connected: true,
            address: first,
            network: networkFromChainId(typeof chainId === 'string' ? chainId : undefined),
          }))
          return
        }
      } catch {
        // fall through to mock connect
      }
    }

    setState((s) => ({ ...s, connected: true, address: s.address ?? randomAddress() }))
  }, [])

  const disconnect = useCallback(() => {
    setState({ connected: false, network: 'Ethereum' })
  }, [])

  const setNetwork = useCallback((network: WalletState['network']) => {
    setState((s) => ({ ...s, network }))
  }, [])

  const ui = useMemo(() => {
    return {
      label: state.connected && state.address ? truncateAddress(state.address) : 'Connect Wallet',
    }
  }, [state.address, state.connected])

  return { state, ui, connect, disconnect, setNetwork }
}
