import type { SlabTier } from '../types'

interface SlabTableProps {
  tiers: SlabTier[]
  activeTier?: SlabTier | null
}

const formatInr = (amount: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)

const SlabTable = ({ tiers, activeTier }: SlabTableProps) => {
  return (
    <div>
      <div className="grid grid-cols-3 pb-2 text-xs uppercase tracking-wider text-[#888888]">
        <div>Slab Range</div>
        <div>Rate per Car</div>
        <div>Status</div>
      </div>

      <div>
        {tiers.map((tier) => {
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
              <div className="px-2">
                {isActive ? (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[#888888]">Inactive</span>
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
