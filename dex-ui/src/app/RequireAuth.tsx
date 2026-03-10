import { Navigate, useLocation } from 'react-router-dom'
import { routes } from './routes'
import { useAuth } from '../state/auth'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.state.status !== 'authenticated') {
    return <Navigate to={routes.login} replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

