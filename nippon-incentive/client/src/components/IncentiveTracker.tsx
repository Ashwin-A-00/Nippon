import type { SlabTier } from '../types'
import { formatCurrency } from '../lib/formatCurrency'

interface IncentiveTrackerProps {
  totalCars: number
  tiers: SlabTier[]
  payout: number
  activeTier: SlabTier | null
}

const IncentiveTracker = ({ totalCars, tiers, payout, activeTier }: IncentiveTrackerProps) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-lg font-semibold text-gray-900">Live Incentive Tracker</h3>

      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Cars Sold</p>
          <p className="mt-1 text-4xl font-extrabold text-gray-900">{totalCars}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tier Progress</p>
          <ul className="mt-2 space-y-2">
            {tiers.map((tier) => {
              const isActive = activeTier?.id === tier.id
              return (
                <li
                  key={tier.id}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    isActive
                      ? 'border-[#CC0000] bg-[#CC0000] font-semibold text-white'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>
                    {tier.min_cars} - {tier.max_cars === null ? '∞' : tier.max_cars} cars
                  </span>
                  <span>₹{tier.incentive_per_car}/car</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total Payout</p>
        <p className="mt-1 text-3xl font-extrabold text-emerald-600">{formatCurrency(payout)}</p>
      </div>
    </section>
  )
}

export default IncentiveTracker
