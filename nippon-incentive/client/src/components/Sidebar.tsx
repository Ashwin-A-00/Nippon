import { BarChart3, Car, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

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

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] overflow-y-auto border-r border-white/[0.08] bg-[#0F0F0F]">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-[0.3em] text-white">NIPPON</h1>
        <p className="mt-0.5 text-xs tracking-[0.4em] text-[#888888]">TOYOTA</p>
        <div className="mt-4 h-px bg-white/[0.08]" />
      </div>

      <nav className="mt-6 px-3">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
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
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC1428] text-sm font-semibold text-white">
            {initials}
          </div>

          <div>
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="text-xs capitalize text-[#888888]">{role || 'officer'}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto text-[#888888] transition-colors hover:text-white"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
