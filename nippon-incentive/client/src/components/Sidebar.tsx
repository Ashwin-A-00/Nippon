import { BarChart3, Car, ClipboardList, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

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
      {/* Hamburger Button - Mobile Only */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-[#1A1A1A] border border-white/[0.08] rounded-lg p-2 text-white hover:bg-[#222222] transition-all"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] overflow-y-auto border-r border-white/[0.08] bg-[#0F0F0F] transition-transform duration-300 md:translate-x-0 md:z-40 md:relative md:w-[260px] md:border-r md:border-white/[0.08]"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-260px)',
        }}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-[0.3em] text-white">NIPPON</h1>
            <p className="mt-0.5 text-xs tracking-[0.4em] text-[#888888]">TOYOTA</p>
          </div>
          {/* Close button - Mobile Only */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden text-[#888888] hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mx-6 h-px bg-white/[0.08]" />

        <nav className="mt-6 px-3">
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

        <div className="absolute bottom-0 w-full border-t border-white/[0.08] p-4">
          <div className="flex items-center gap-3 mb-4">
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#DC1428] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#FF1A30]"
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
