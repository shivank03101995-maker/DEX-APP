import { Outlet } from 'react-router-dom'
import { SidebarNav } from './SidebarNav'
import { TopNav } from './TopNav'

export function AppShell() {
  return (
    <div className="min-h-full">
      <div className="mx-auto flex min-h-full w-full max-w-[1400px] gap-4 px-3 py-3 md:gap-6 md:px-6 md:py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <SidebarNav />
        </aside>
        <div className="min-w-0 flex-1">
          <TopNav />
          <main className="container-page pt-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
