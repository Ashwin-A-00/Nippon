export const calculateIncentive = (totalCars: number, tiers: any[]) => {
  const tier = tiers.find((item) => {
    const withinMin = totalCars >= item.min_cars
    const withinMax = item.max_cars === null || totalCars <= item.max_cars
    return withinMin && withinMax
  }) ?? null

  const payout = tier ? totalCars * tier.incentive_per_car : 0

  return { tier, payout }
}
