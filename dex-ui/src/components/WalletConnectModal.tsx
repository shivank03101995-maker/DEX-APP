import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { useWallet } from '../state/useWallet'

export function WalletConnectModal() {
  const wallet = useWallet()
  if (!wallet.modal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close wallet modal"
        onClick={wallet.modal.close}
        type="button"
      />

      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Connect wallet</div>
            <div className="text-xs text-slate-500">Choose a wallet available in this browser.</div>
          </div>
          <Button variant="ghost" onClick={wallet.modal.close} aria-label="Close" type="button">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 p-4">
          {wallet.wallets.length ? (
            wallet.wallets.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => void wallet.connectWallet(w.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50"
              >
                {w.icon ? <img src={w.icon} alt="" className="h-8 w-8 rounded-lg" /> : <div className="h-8 w-8 rounded-lg bg-slate-100" />}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">{w.name}</div>
                  <div className="text-xs text-slate-500">Connect and use this address for register/login.</div>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              No injected wallets detected. Install a browser wallet extension (MetaMask, Rabby, Coinbase Wallet, Brave Wallet) and
              refresh.
            </div>
          )}

          <div className="pt-2 text-xs text-slate-500">
            This list shows injected wallets available in your browser (EIP-6963). Mobile wallets via WalletConnect can be added later.
          </div>
        </div>
      </div>
    </div>
  )
}

