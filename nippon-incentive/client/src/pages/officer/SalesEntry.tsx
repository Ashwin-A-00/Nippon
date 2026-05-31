import { useEffect, useMemo, useState } from 'react'
import { getCars } from '../../api/cars'
import { getActiveSlab } from '../../api/slabs'
import { getSales, upsertSale } from '../../api/sales'
import Sidebar from '../../components/Sidebar'
import { useMobileMenu } from '../../context/MobileMenuContext'
import CustomSelect from '../../components/CustomSelect'
import { calculateIncentive } from '../../lib/calculateIncentive'
import { formatCurrency } from '../../lib/formatCurrency'
import type { CarModel, SlabTier } from '../../types'
import { Minus, Plus, CheckCircle2, Car } from 'lucide-react'

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 }
]

const years = [
  { label: '2024', value: 2024 },
  { label: '2025', value: 2025 },
  { label: '2026', value: 2026 },
  { label: '2027', value: 2027 },
  { label: '2028', value: 2028 }
]

const SalesEntry = () => {
  const { isOpen: mobileMenuOpen } = useMobileMenu()
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
        (a: SlabTier, b: SlabTier) => a.min_cars - b.min_cars
      )
      setTiers(sorted)

      const existingSales = await getSales(month, year)
      const existingMap: Record<string, number> = {}
      if (Array.isArray(existingSales)) {
        existingSales.forEach((entry: any) => {
          existingMap[entry.car_model_id] = entry.units_sold
        })
      }
      setSalesMap(existingMap)
    }

    void loadData()
  }, [])

  useEffect(() => {
    const loadSales = async () => {
      const existingSales = await getSales(month, year)
      const existingMap: Record<string, number> = {}
      if (Array.isArray(existingSales)) {
        existingSales.forEach((entry: any) => {
          existingMap[entry.car_model_id] = entry.units_sold
        })
      }
      setSalesMap(existingMap)
    }
    void loadSales()
  }, [month, year])

  const totalCars = useMemo(
    () => Object.values(salesMap).reduce((sum, value) => sum + Number(value || 0), 0),
    [salesMap]
  )
  const { tier: activeTier, payout } = useMemo(
    () => calculateIncentive(totalCars, tiers),
    [totalCars, tiers]
  )

  const periodLabel = useMemo(() => {
    const monthName = months.find((m) => m.value === month)?.label ?? String(month)
    return `${monthName} ${year}`
  }, [month, year])

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
      setSuccessMessage('Sales saved successfully')
    } catch (_err) {
      // Ignored
    } finally {
      setSaving(false)
    }
  }

  const handleIncrement = (carId: string) => {
    setSalesMap((prev) => ({
      ...prev,
      [carId]: (prev[carId] ?? 0) + 1
    }))
  }

  const handleDecrement = (carId: string) => {
    setSalesMap((prev) => {
      const current = prev[carId] ?? 0
      return {
        ...prev,
        [carId]: Math.max(0, current - 1)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar />

      <main className="ml-0 md:ml-[260px] min-h-screen bg-[#0F0F0F]">
        <header className="border-b border-white/[0.08] bg-[#1A1A1A] px-4 md:px-10 py-4 md:py-6 pt-20 md:pt-6">
          <div className="flex flex-col md:flex-row flex-wrap items-start md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888]">
                Sales Entry
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Log Monthly Sales
              </h1>
              <p className="mt-1 text-sm text-[#888888]">
                Record units sold — incentive updates instantly
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0F0F0F] px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-[#888888]">
                Period
              </span>
              <CustomSelect
                value={month}
                onChange={(val) => setMonth(Number(val))}
                options={months}
                className="w-36"
              />
              <CustomSelect
                value={year}
                onChange={(val) => setYear(Number(val))}
                options={years}
                className="w-28"
              />
            </div>
          </div>
        </header>

        <div className="space-y-6 px-4 md:px-10 py-8 pb-32 md:pb-28">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-5">
              <p className="text-xs uppercase tracking-wider text-[#888888]">Total Units</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-white">{totalCars}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-5">
              <p className="text-xs uppercase tracking-wider text-[#888888]">Active Tier</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {activeTier
                  ? `${activeTier.min_cars}–${activeTier.max_cars ?? '∞'} cars`
                  : 'Not reached'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-5">
              <p className="text-xs uppercase tracking-wider text-[#888888]">Projected Payout</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-[#4ADE80]">
                {formatCurrency(payout)}
              </p>
              <p className="mt-1 text-xs text-[#444444]">{periodLabel}</p>
            </div>
          </section>

          {tiers.length > 0 && (
            <section className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[#888888]">
                Incentive Tiers
              </p>
              <div className="flex flex-wrap gap-2">
                {tiers.map((tier) => {
                  const isActive = activeTier?.id === tier.id
                  return (
                    <div
                      key={tier.id}
                      className={`rounded-xl border px-4 py-2.5 text-sm transition-all ${
                        isActive
                          ? 'border-[#DC1428] bg-[#DC1428] text-white'
                          : 'border-white/[0.08] bg-[#222222] text-[#888888]'
                      }`}
                    >
                      <span className="font-medium">
                        {tier.min_cars}–{tier.max_cars ?? '∞'}
                      </span>
                      <span className="ml-2 opacity-80">
                        ₹{tier.incentive_per_car.toLocaleString('en-IN')}/car
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1A1A1A]">
            <div className="border-b border-white/[0.08] bg-[#222222] px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Vehicle Sales</h2>
              <p className="text-xs text-[#888888]">Adjust units for each active model</p>
            </div>

            {cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Car size={40} className="text-[#444444]" />
                <p className="mt-4 text-sm font-medium text-white">No active models</p>
                <p className="mt-1 text-xs text-[#888888]">
                  Ask admin to add car models before logging sales
                </p>
              </div>
            ) : (
              <>
                <div className="hidden grid-cols-12 gap-4 border-b border-white/[0.08] px-6 py-3 text-xs font-medium uppercase tracking-wider text-[#888888] md:grid">
                  <div className="col-span-5">Model</div>
                  <div className="col-span-3">Details</div>
                  <div className="col-span-4 text-right">Units Sold</div>
                </div>

                <div className="divide-y divide-white/[0.08]">
                  {cars.map((car) => {
                    const units = salesMap[car.id] ?? 0
                    const hasSales = units > 0

                    return (
                      <div
                        key={car.id}
                        className={`grid grid-cols-1 items-center gap-4 px-6 py-4 transition-colors md:grid-cols-12 ${
                          hasSales ? 'bg-[#222222]' : 'hover:bg-[#222222]/50'
                        }`}
                      >
                        <div className="md:col-span-5">
                          <p className="font-semibold text-white">{car.model_name}</p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-sm text-[#888888]">
                            {[car.base_suffix, car.variant].filter(Boolean).join(' · ') || '—'}
                          </p>
                        </div>
                        <div className="flex justify-end md:col-span-4">
                          <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-[#0F0F0F] p-1">
                            <button
                              type="button"
                              onClick={() => handleDecrement(car.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888888] transition-colors hover:bg-[#222222] hover:text-white"
                              aria-label="Decrease units"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="min-w-[3rem] px-2 text-center text-lg font-bold tabular-nums text-white">
                              {units}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(car.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888888] transition-colors hover:bg-[#222222] hover:text-white"
                              aria-label="Increase units"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </section>
        </div>

        <div
          className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-[#0F0F0F]/95 px-4 py-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] md:left-[260px] md:z-30 md:block md:px-10 md:py-4 ${
            mobileMenuOpen ? 'max-md:hidden' : ''
          }`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <div className="md:block">
              <p className="text-sm font-medium text-white">
                {totalCars} units ·{' '}
                <span className="text-[#4ADE80]">{formatCurrency(payout)}</span> projected
              </p>
              <p className="text-xs text-[#888888] max-md:hidden md:block">
                Changes are not saved until you submit
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:w-auto">
              {successMessage && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-4 py-2.5 sm:justify-start">
                  <CheckCircle2 size={16} className="shrink-0 text-[#4ADE80]" />
                  <span className="text-sm text-[#4ADE80]">{successMessage}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || cars.length === 0}
                className="w-full rounded-xl bg-[#DC1428] px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#FF1A30] disabled:cursor-not-allowed disabled:opacity-50 md:ml-auto md:w-auto md:min-w-[160px] md:py-3"
              >
                {saving ? 'Saving…' : 'Save Sales'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SalesEntry
