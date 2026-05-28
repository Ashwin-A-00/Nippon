import { useEffect, useMemo, useState } from 'react'
import { getCars } from '../../api/cars'
import { getActiveSlab } from '../../api/slabs'
import { upsertSale } from '../../api/sales'
import IncentiveTracker from '../../components/IncentiveTracker'
import Navbar from '../../components/Navbar'
import { calculateIncentive } from '../../lib/calculateIncentive'
import type { CarModel, SlabTier } from '../../types'

const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1)
const yearOptions = [2024, 2025, 2026, 2027, 2028]

const SalesEntry = () => {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  const [cars, setCars] = useState<CarModel[]>([])
  const [tiers, setTiers] = useState<SlabTier[]>([])
  const [salesMap, setSalesMap] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const carsRes = await getCars()
      const allCars = Array.isArray(carsRes) ? carsRes : []
      const activeCars = allCars.filter((car: CarModel) => car.is_active)
      setCars(activeCars)

      const slab = await getActiveSlab()
      const sorted = [...(slab?.slab_tiers ?? [])].sort(
        (a: SlabTier, b: SlabTier) => a.sort_order - b.sort_order
      )
      setTiers(sorted)
    }

    void loadData()
  }, [])

  const totalCars = useMemo(() => Object.values(salesMap).reduce((sum, value) => sum + Number(value || 0), 0), [salesMap])
  const { tier: activeTier, payout } = useMemo(() => calculateIncentive(totalCars, tiers), [totalCars, tiers])

  const handleSave = async () => {
    setSaving(true)
    setSuccessMessage('')

    try {
      const userId = localStorage.getItem('user_id') || ''
      const payloads = cars
        .map((car) => ({
          user_id: userId,
          car_model_id: car.id,
          month,
          year,
          units_sold: Number(salesMap[car.id] || 0)
        }))
        .filter((item) => item.units_sold > 0)

      await Promise.all(payloads.map((payload) => upsertSale(payload)))
      setSuccessMessage('Sales entries saved successfully.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Log Sales</h2>
          <p className="mt-1 text-sm text-gray-600">Enter units sold for each active car model.</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Month</label>
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
            >
              {monthOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Year</label>
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
            >
              {yearOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-3 border-b border-gray-200 bg-gray-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white">
            <div className="col-span-7 sm:col-span-8">Car Model</div>
            <div className="col-span-5 text-right sm:col-span-4 sm:text-left">Units Sold</div>
          </div>

          <div className="divide-y divide-gray-100">
            {cars.map((car) => (
              <div key={car.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3 transition hover:bg-gray-50">
                <div className="col-span-7 sm:col-span-8">
                  <p className="font-medium text-gray-900">{car.model_name}</p>
                  <p className="text-sm text-gray-500">
                    {car.base_suffix || '-'} {car.variant ? `• ${car.variant}` : ''}
                  </p>
                </div>
                <div className="col-span-5 sm:col-span-4">
                  <input
                    type="number"
                    min={0}
                    value={salesMap[car.id] ?? 0}
                    onChange={(event) =>
                      setSalesMap((prev) => ({
                        ...prev,
                        [car.id]: Number(event.target.value)
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-right text-sm font-medium text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20 sm:text-left"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-white px-4 py-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a80000] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {successMessage ? <p className="mt-3 text-sm font-medium text-emerald-600">{successMessage}</p> : null}
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <IncentiveTracker totalCars={totalCars} tiers={tiers} payout={payout} activeTier={activeTier} />
        </div>
      </div>
    </div>
  )
}

export default SalesEntry
