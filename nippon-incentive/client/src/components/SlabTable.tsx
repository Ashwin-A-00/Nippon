import type { SlabTier } from '../types'

interface SlabTableProps {
  tiers: SlabTier[]
  activeTier?: SlabTier | null
}

const SlabTable = ({ tiers, activeTier }: SlabTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="min-w-full bg-white text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Slab</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Cars Range</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Rate per Car</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, index) => {
            const isActive = activeTier?.id === tier.id
            return (
              <tr
                key={tier.id}
                className={`border-t border-gray-100 transition hover:bg-gray-50 ${isActive ? 'bg-red-50' : ''}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Tier {index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {tier.min_cars} - {tier.max_cars === null ? '?' : tier.max_cars}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">?{tier.incentive_per_car}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SlabTable
