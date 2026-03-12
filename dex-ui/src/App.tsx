import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { WalletConnectModal } from './components/WalletConnectModal'

export default function App() {
  return (
    <>
      <WalletConnectModal />
      <RouterProvider router={router} />
    </>
  )
}
