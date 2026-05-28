const calculateIncentive = (totalCars, tiers) => {
  const tier = tiers.find(t =>
    totalCars >= t.min_cars &&
    (t.max_cars === null || totalCars <= t.max_cars)
  )
  if (!tier) return { tier: null, payout: 0 }
  return {
    tier,
    payout: totalCars * tier.incentive_per_car
  }
}

module.exports = calculateIncentive