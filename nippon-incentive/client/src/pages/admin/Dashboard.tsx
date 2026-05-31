import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCars } from '../../api/cars'
import { getActiveSlab } from '../../api/slabs'
import Sidebar from '../../components/Sidebar'
import StatCard from '../../components/StatCard'
import { FullPageLoader } from '../../components/LoadingSpinner'
import { Car, BarChart3, ArrowRight } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [carsCount, setCarsCount] = useState(0)
  const [slabLabel, setSlabLabel] = useState('Not set')
  const [name, setName] = useState('Admin')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setName(localStorage.getItem('name') || 'Admin')

    const loadData = async () => {
      setLoading(true)
      try {
        const carsResponse = await getCars()
        const cars = Array.isArray(carsResponse) ? carsResponse : (carsResponse?.data ?? [])
        setCarsCount(cars.length)

        const slabResponse = await getActiveSlab()
        const activeSlab = slabResponse?.data ?? slabResponse
        setSlabLabel(activeSlab?.label || 'Not set')
      } catch (_error) {
        setCarsCount(0)
        setSlabLabel('Unavailable')
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getFormattedDate = () => {
    const d = new Date()
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
    const day = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'long' })
    const year = d.getFullYear()
    return `${weekday}, ${day} ${month} ${year}`
  }

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar />
      <main className="ml-0 md:ml-[260px] min-h-screen bg-[#0F0F0F] p-4 md:p-8 pt-20 md:pt-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {getGreeting()}, {name}
          </h2>
          <p className="mt-1 text-sm text-[#888888]">{getFormattedDate()}</p>
        </div>

        <div className="my-6 h-px bg-white/[0.08]" />

        <section className="grid w-full grid-cols-2 gap-6">
          <div className="h-full w-full">
            <StatCard
              label="Car Models"
              value={carsCount}
              icon={Car}
              sublabel="Active models in inventory"
            />
          </div>
          <div className="h-full w-full">
            <StatCard
              label="Active Slab"
              value={slabLabel}
              icon={BarChart3}
              sublabel="Current incentive plan"
              highlight
            />
          </div>
        </section>

        <section className="mt-8 w-full">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-[#888888]">
            Quick Actions
          </h3>
          <div className="grid w-full grid-cols-2 gap-6">
            <div
              onClick={() => navigate('/admin/cars')}
              className="group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-6 transition-all duration-200 hover:border-[#DC1428] hover:bg-[#222222]"
            >
              <div>
                <Car className="text-[#888888]" size={32} />
                <h4 className="mt-4 font-medium text-white">Manage Car Models</h4>
                <p className="mt-1 text-sm text-[#888888]">
                  Add, edit and maintain vehicle inventory
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <ArrowRight
                  size={16}
                  className="text-[#888888] transition-transform group-hover:translate-x-1 group-hover:text-white"
                />
              </div>
            </div>

            <div
              onClick={() => navigate('/admin/slabs')}
              className="group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-6 transition-all duration-200 hover:border-[#DC1428] hover:bg-[#222222]"
            >
              <div>
                <BarChart3 className="text-[#888888]" size={32} />
                <h4 className="mt-4 font-medium text-white">Configure Slabs</h4>
                <p className="mt-1 text-sm text-[#888888]">
                  Set incentive tiers for officers
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <ArrowRight
                  size={16}
                  className="text-[#888888] transition-transform group-hover:translate-x-1 group-hover:text-white"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
