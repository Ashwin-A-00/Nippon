import type { SlabTier } from '../types'
import { Edit2, Trash2 } from 'lucide-react'

interface SlabTableProps {
  tiers: SlabTier[]
  activeTier?: SlabTier | null
  onEdit?: (tier: SlabTier) => void
  onDelete?: (tierId: string) => void
}

const formatInr = (amount: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)

const SlabTable = ({ tiers, activeTier, onEdit, onDelete }: SlabTableProps) => {
  const sortedTiers = [...tiers].sort((a, b) => a.min_cars - b.min_cars)

  return (
    <div>
      <div className="grid grid-cols-3 pb-2 text-xs uppercase tracking-wider text-[#888888]">
        <div>Slab Range</div>
        <div>Rate per Car</div>
        <div className="text-right">Actions</div>
      </div>

      <div>
        {sortedTiers.map((tier) => {
          const isActive = activeTier?.id === tier.id

          return (
            <div
              key={tier.id}
              className={`grid grid-cols-3 items-center border-b border-white/[0.08] py-3 last:border-0 ${
                isActive ? 'rounded-lg bg-[#DC1428] text-white' : 'text-white'
              }`}
            >
              <div className="px-2">
                {tier.min_cars} – {tier.max_cars === null ? '∞' : tier.max_cars} cars
              </div>
              <div className="px-2">₹{formatInr(tier.incentive_per_car)} / car</div>
              <div className="flex justify-end gap-2 px-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(tier)}
                    className="text-[#555] transition-colors hover:text-white"
                    aria-label="Edit tier"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(tier.id)}
                    className="text-[#555] transition-colors hover:text-[#DC1428]"
                    aria-label="Delete tier"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SlabTable
