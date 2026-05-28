import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCars } from '../../api/cars'
import { getActiveSlab } from '../../api/slabs'
import Navbar from '../../components/Navbar'

const Dashboard = () => {
  const [carsCount, setCarsCount] = useState(0)
  const [activeSlabLabel, setActiveSlabLabel] = useState('Not set')
  const [name, setName] = useState('Admin')

  useEffect(() => {
    setName(localStorage.getItem('name') || 'Admin')

    const loadData = async () => {
      try {
        const carsResponse = await getCars()
        const cars = Array.isArray(carsResponse) ? carsResponse : (carsResponse?.data ?? [])
        setCarsCount(cars.length)

        const slabResponse = await getActiveSlab()
        const activeSlab = slabResponse?.data ?? slabResponse
        setActiveSlabLabel(activeSlab?.label || 'Not set')
      } catch (_error) {
        setCarsCount(0)
        setActiveSlabLabel('Unavailable')
      }
    }

    void loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome, {name}</h2>
          <p className="mt-2 text-sm text-gray-600">Overview of car models and active incentive slab.</p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Car Models</p>
            <p className="mt-3 text-4xl font-bold text-gray-900">{carsCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Active Slab</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">{activeSlabLabel}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/cars"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#CC0000]/40 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 transition group-hover:text-[#CC0000]">Manage Cars</h3>
            <p className="mt-2 text-sm text-gray-600">Add, review, and maintain all Toyota car model entries.</p>
          </Link>

          <Link
            to="/admin/slabs"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#CC0000]/40 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 transition group-hover:text-[#CC0000]">Manage Slabs</h3>
            <p className="mt-2 text-sm text-gray-600">Create and activate incentive slab configurations for officers.</p>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
