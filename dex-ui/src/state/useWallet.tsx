import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type WalletState = {
  connected: boolean
  address?: string
  network: 'Ethereum' | 'Polygon' | 'Arbitrum'
  walletName?: string
}

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>
  on?: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
}

type Eip6963ProviderInfo = {
  uuid: string
  name: string
  icon: string
  rdns: string
}

type Eip6963ProviderDetail = { info: Eip6963ProviderInfo; provider: EthereumProvider }

function getEthereum(): EthereumProvider | undefined {
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum
}

function networkFromChainId(chainIdHex: string | undefined): WalletState['network'] {
  switch (String(chainIdHex ?? '').toLowerCase()) {
    case '0x89':
      return 'Polygon'
    case '0xa4b1':
      return 'Arbitrum'
    case '0x1':
    default:
      return 'Ethereum'
  }
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

type WalletOption = {
  id: string
  name: string
  icon?: string
}

type WalletContextValue = {
  state: WalletState
  ui: { label: string }
  wallets: WalletOption[]
  modal: { isOpen: boolean; open: () => void; close: () => void }
  connect: () => void
  connectWallet: (id: string) => Promise<void>
  signMessage: (message: string) => Promise<string>
  disconnect: () => void
  setNetwork: (network: WalletState['network']) => Promise<void>
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({ connected: false, network: 'Ethereum' })
  const [wallets, setWallets] = useState<WalletOption[]>([])
  const [providersById, setProvidersById] = useState<Record<string, Eip6963ProviderDetail>>({})
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const hasInjected = useMemo(() => Boolean(getEthereum()?.request), [])

  const refreshProviders = useCallback(() => {
    try {
      window.dispatchEvent(new Event('eip6963:requestProvider'))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const onAnnounce = (event: Event) => {
      const detail = (event as CustomEvent<Eip6963ProviderDetail>).detail
      if (!detail?.info?.uuid || !detail.provider?.request) return

      setProvidersById((prev) => {
        if (prev[detail.info.uuid]) return prev
        return { ...prev, [detail.info.uuid]: detail }
      })
      setWallets((prev) => {
        if (prev.some((w) => w.id === detail.info.uuid)) return prev
        return [...prev, { id: detail.info.uuid, name: detail.info.name, icon: detail.info.icon }]
      })
    }

    window.addEventListener('eip6963:announceProvider', onAnnounce as EventListener)
    refreshProviders()
    return () => {
      window.removeEventListener('eip6963:announceProvider', onAnnounce as EventListener)
    }
  }, [refreshProviders])

  const selectedProvider: EthereumProvider | undefined = useMemo(() => {
    if (selectedWalletId && providersById[selectedWalletId]?.provider) return providersById[selectedWalletId].provider
    return getEthereum()
  }, [providersById, selectedWalletId])

  useEffect(() => {
    const eth = selectedProvider
    if (!eth?.request) return

    let active = true

    const sync = async () => {
      const [accounts, chainId] = await Promise.all([
        eth.request({ method: 'eth_accounts' }) as Promise<unknown>,
        eth.request({ method: 'eth_chainId' }) as Promise<unknown>,
      ])
      const address = Array.isArray(accounts) ? accounts[0] : undefined
      if (!active) return
      setState((s) => ({
        ...s,
        connected: typeof address === 'string' && address.startsWith('0x'),
        address: typeof address === 'string' ? address : undefined,
        network: networkFromChainId(typeof chainId === 'string' ? chainId : undefined),
      }))
    }

    void sync().catch(() => {
      // ignore
    })

    const onAccountsChanged = (accounts: unknown) => {
      const first = Array.isArray(accounts) ? accounts[0] : undefined
      setState((s) => ({
        ...s,
        connected: typeof first === 'string' && first.startsWith('0x'),
        address: typeof first === 'string' ? first : undefined,
      }))
    }

    const onChainChanged = (chainId: unknown) => {
      setState((s) => ({ ...s, network: networkFromChainId(typeof chainId === 'string' ? chainId : undefined) }))
    }

    eth.on?.('accountsChanged', onAccountsChanged)
    eth.on?.('chainChanged', onChainChanged)
    return () => {
      active = false
      eth.removeListener?.('accountsChanged', onAccountsChanged)
      eth.removeListener?.('chainChanged', onChainChanged)
    }
  }, [selectedProvider])

  const openModal = useCallback(() => {
    refreshProviders()
    setModalOpen(true)
  }, [refreshProviders])

  const closeModal = useCallback(() => setModalOpen(false), [])

  const connectWallet = useCallback(
    async (id: string) => {
      const detail = providersById[id]
      const eth = detail?.provider
      if (!eth?.request) return
      try {
        const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as unknown
        const first = Array.isArray(accounts) ? accounts[0] : undefined
        const chainId = (await eth.request({ method: 'eth_chainId' })) as unknown
        setSelectedWalletId(id)
        setState({
          connected: typeof first === 'string' && first.startsWith('0x'),
          address: typeof first === 'string' ? first : undefined,
          network: networkFromChainId(typeof chainId === 'string' ? chainId : undefined),
          walletName: detail?.info?.name,
        })
        setModalOpen(false)
      } catch {
        // ignore (user rejected)
      }
    },
    [providersById],
  )

  const connect = useCallback(() => {
    if (!wallets.length && !hasInjected) {
      window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer')
      return
    }
    openModal()
  }, [hasInjected, openModal, wallets.length])

  useEffect(() => {
    if (wallets.length) return
    if (hasInjected) {
      setWallets([{ id: '__injected__', name: 'Browser Wallet' }])
    }
  }, [hasInjected, wallets.length])

  const connectInjected = useCallback(async () => {
    const eth = getEthereum()
    if (!eth?.request) return
    try {
      const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as unknown
      const first = Array.isArray(accounts) ? accounts[0] : undefined
      const chainId = (await eth.request({ method: 'eth_chainId' })) as unknown
      setSelectedWalletId(null)
      setState({
        connected: typeof first === 'string' && first.startsWith('0x'),
        address: typeof first === 'string' ? first : undefined,
        network: networkFromChainId(typeof chainId === 'string' ? chainId : undefined),
        walletName: 'Browser Wallet',
      })
      setModalOpen(false)
    } catch {
      // ignore
    }
  }, [])

  const disconnect = useCallback(() => {
    const eth = selectedProvider ?? getEthereum()
    if (eth?.request) {
      void eth
        .request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        })
        .catch(() => {
          // ignore (not supported by all wallets)
        })
    }
    setSelectedWalletId(null)
    setState((s) => ({ ...s, connected: false, address: undefined, walletName: undefined }))
  }, [selectedProvider])

  const signMessage = useCallback(
    async (message: string) => {
      const eth = selectedProvider ?? getEthereum()
      const address = state.address
      if (!eth?.request) throw new Error('Wallet provider not available.')
      if (!state.connected || !address) throw new Error('Connect your wallet first.')
      const msg = String(message ?? '')
      try {
        const sig = (await eth.request({ method: 'personal_sign', params: [msg, address] })) as unknown
        if (typeof sig === 'string' && sig.startsWith('0x')) return sig
      } catch {
        // fallthrough to eth_sign
      }
      const sig2 = (await eth.request({ method: 'eth_sign', params: [address, msg] })) as unknown
      if (typeof sig2 === 'string' && sig2.startsWith('0x')) return sig2
      throw new Error('Failed to sign message.')
    },
    [selectedProvider, state.address, state.connected],
  )

  const setNetwork = useCallback(async (network: WalletState['network']) => {
    const eth = selectedProvider ?? getEthereum()
    if (!eth?.request) return
    const chainId = network === 'Polygon' ? '0x89' : network === 'Arbitrum' ? '0xa4b1' : '0x1'
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] })
      setState((s) => ({ ...s, network }))
    } catch {
      // ignore (wallet may reject / chain may be unavailable)
    }
  }, [selectedProvider])

  const ui = useMemo(() => {
    return {
      label: state.connected && state.address ? truncateAddress(state.address) : wallets.length || hasInjected ? 'Connect Wallet' : 'Install Wallet',
    }
  }, [hasInjected, state.address, state.connected, wallets.length])

  const value = useMemo<WalletContextValue>(
    () => ({
      state,
      ui,
      wallets,
      modal: { isOpen: modalOpen, open: openModal, close: closeModal },
      connect,
      connectWallet: async (id: string) => {
        if (id === '__injected__') return connectInjected()
        return connectWallet(id)
      },
      signMessage,
      disconnect,
      setNetwork,
    }),
    [closeModal, connect, connectInjected, connectWallet, disconnect, modalOpen, openModal, setNetwork, signMessage, state, ui, wallets],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
