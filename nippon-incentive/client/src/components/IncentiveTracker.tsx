import type { SlabTier } from '../types'

interface IncentiveTrackerProps {
  totalCars: number
  tiers: SlabTier[]
  payout: number
  activeTier: SlabTier | null
}

const formatInr = (amount: number) => {
  if (amount === 0) return '₹0'
  return '₹' + new Intl.NumberFormat('en-IN').format(amount)
}

const IncentiveTracker = ({ totalCars, tiers, payout, activeTier }: IncentiveTrackerProps) => {
  const isActiveOrBelow = (tier: SlabTier) => {
    if (!activeTier) return false
    return tier.min_cars <= activeTier.min_cars
  }

  const gridCols =
    tiers.length === 1
      ? 'grid-cols-1'
      : tiers.length === 2
        ? 'grid-cols-2'
        : tiers.length === 3
          ? 'grid-cols-3'
          : tiers.length === 4
            ? 'grid-cols-4'
            : 'grid-cols-3'

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-8">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-sm font-medium text-[#888888]">Live Incentive Tracker</span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#DC1428]" />
      </div>

      <div className="mb-8 text-center">
        <div className="text-8xl font-bold leading-none tracking-tight text-white">{totalCars}</div>
        <div className="mt-3 text-xs uppercase tracking-widest text-[#888888]">cars sold this month</div>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-medium text-[#888888]">
          <span>0</span>
          {tiers.map((tier) => (
            <span key={tier.id}>{tier.min_cars}</span>
          ))}
        </div>
        <div className="flex h-2 gap-px overflow-hidden rounded-full bg-[#222222]">
          {tiers.map((tier) => {
            const active = isActiveOrBelow(tier)
            return (
              <div
                key={tier.id}
                className={`flex-1 transition-all duration-500 ${active ? 'bg-[#DC1428]' : 'bg-white/[0.08]'}`}
              />
            )
          })}
        </div>
      </div>

      <div className={`mb-8 grid gap-3 ${gridCols}`}>
        {tiers.map((tier) => {
          const isActive = activeTier?.id === tier.id

          return (
            <div
              key={tier.id}
              className={`transition-all duration-300 ${
                isActive
                  ? 'rounded-xl bg-[#DC1428] px-4 py-4 text-white'
                  : 'rounded-xl border border-white/[0.08] bg-[#222222] px-4 py-4 text-[#888888]'
              }`}
            >
              <div className="text-xs font-medium">
                {tier.min_cars} – {tier.max_cars ?? '∞'} cars
              </div>
              <div className="mt-2 text-lg font-bold leading-tight">
                ₹{tier.incentive_per_car.toLocaleString('en-IN')}
                <span className="ml-0.5 text-xs font-normal opacity-70">/car</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-white/[0.08] pt-6">
        <span className="text-sm font-medium text-[#888888]">Total Payout</span>
        <span
          className={`text-4xl font-bold transition-colors ${
            payout > 0 ? 'text-[#4ADE80]' : 'text-[#444444]'
          }`}
        >
          {formatInr(payout)}
        </span>
      </div>
    </section>
  )
}

export default IncentiveTracker
