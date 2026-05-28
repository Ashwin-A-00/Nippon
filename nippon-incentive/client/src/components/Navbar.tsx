import { useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()

  const displayName = useMemo(() => user?.name || localStorage.getItem('name') || 'User', [user])
  const role = useMemo(() => user?.role || localStorage.getItem('role') || 'officer', [user])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#CC0000] shadow-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-extrabold tracking-wide text-white sm:text-2xl">Nippon Toyota</h1>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-sm font-medium text-white/95 sm:block">{displayName}</span>
          <span className="rounded-full bg-[#8f0000] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {role}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
