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

  if (sortedTiers.length === 0) {
    return <p className="text-sm text-[#888888]">No tiers configured yet.</p>
  }

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block">
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

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {sortedTiers.map((tier) => {
          const isActive = activeTier?.id === tier.id

          return (
            <div
              key={tier.id}
              className={`rounded-xl border border-white/[0.08] p-4 ${
                isActive ? 'bg-[#DC1428] text-white' : 'bg-[#222222] text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className={`text-xs uppercase tracking-wider ${isActive ? 'text-white/70' : 'text-[#888888]'}`}>
                    Slab range
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {tier.min_cars} – {tier.max_cars === null ? '∞' : tier.max_cars} cars
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs uppercase tracking-wider ${isActive ? 'text-white/70' : 'text-[#888888]'}`}>
                    Rate
                  </p>
                  <p className="mt-1 text-sm font-medium tabular-nums">
                    ₹{formatInr(tier.incentive_per_car)}/car
                  </p>
                </div>
              </div>

              {(onEdit || onDelete) && (
                <div
                  className={`mt-4 flex gap-2 border-t pt-3 ${
                    isActive ? 'border-white/20' : 'border-white/[0.08]'
                  }`}
                >
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(tier)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-white/30 bg-white/10 hover:bg-white/20'
                          : 'border-white/[0.08] bg-[#1A1A1A] hover:border-[#DC1428]'
                      }`}
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(tier.id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-white/30 bg-white/10 hover:bg-white/20'
                          : 'border-white/[0.08] bg-[#1A1A1A] hover:border-[#DC1428] hover:text-[#DC1428]'
                      }`}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SlabTable
