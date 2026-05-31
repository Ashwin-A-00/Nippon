import { BarChart3, Car, ClipboardList, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMobileMenu } from '../context/MobileMenuContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isOpen, setIsOpen } = useMobileMenu()

  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name') || 'User'

  const adminItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'Car Models', icon: Car, path: '/admin/cars' },
    { label: 'Incentive Slabs', icon: BarChart3, path: '/admin/slabs' }
  ]

  const officerItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/officer' },
    { label: 'Log Sales', icon: ClipboardList, path: '/officer/sales' }
  ]

  const items = role === 'admin' ? adminItems : officerItems

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[#DC1428] text-white md:hidden transition-all hover:bg-[#FF1A30]"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-white/[0.08] bg-[#0F0F0F] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="shrink-0 p-6 pt-20 md:pt-6">
          <h1 className="text-xl font-bold tracking-[0.3em] text-white">NIPPON</h1>
          <p className="mt-0.5 text-xs tracking-[0.4em] text-[#888888]">TOYOTA</p>
          <div className="mt-4 h-px bg-white/[0.08]" />
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto px-3 pb-4 md:pb-24">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`mx-1 flex w-[calc(100%-0.5rem)] items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                  isActive
                    ? 'relative bg-[rgba(220,20,40,0.08)] font-medium text-white before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-full before:bg-[#DC1428]'
                    : 'text-[#888888] hover:bg-[#222222] hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Mobile: in-flow footer so logout stays reachable */}
        <div className="shrink-0 border-t border-white/[0.08] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC1428] text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs capitalize text-[#888888]">{role || 'officer'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#DC1428] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#FF1A30]"
            aria-label="Logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Desktop: pinned footer (unchanged layout) */}
        <div className="absolute bottom-0 hidden w-full border-t border-white/[0.08] p-4 md:block">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC1428] text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs capitalize text-[#888888]">{role || 'officer'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#DC1428] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#FF1A30]"
            aria-label="Logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
