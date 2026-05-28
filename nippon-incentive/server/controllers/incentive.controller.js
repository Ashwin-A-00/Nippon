const supabase = require('../config/db')
const calculateIncentive = require('../utils/calculateIncentive')
const { success, fail } = require('../utils/apiResponse')

const getIncentive = async (req, res) => {
  const { month, year } = req.query
  const userId = req.user.id

  if (!month || !year) return fail(res, 'month and year are required')

  // Get total cars sold this month
  const { data: sales, error: salesError } = await supabase
    .from('sales_entries')
    .select('units_sold, car_models(model_name)')
    .eq('user_id', userId)
    .eq('month', parseInt(month))
    .eq('year', parseInt(year))

  if (salesError) return fail(res, salesError.message)

  const totalCars = sales.reduce((sum, s) => sum + s.units_sold, 0)

  // Get active slab
  const { data: slabs, error: slabError } = await supabase
    .from('slab_configs')
    .select('*, slab_tiers(*)')
    .eq('is_active', true)
    .limit(1)

  if (slabError) return fail(res, slabError.message)
  if (!slabs.length) return fail(res, 'No active slab configured', 404)

  const tiers = slabs[0].slab_tiers.sort((a, b) => a.sort_order - b.sort_order)
  const result = calculateIncentive(totalCars, tiers)

  return success(res, {
    month: parseInt(month),
    year: parseInt(year),
    total_cars: totalCars,
    sales_breakdown: sales,
    active_slab: slabs[0].label,
    tiers,
    ...result
  })
}

module.exports = { getIncentive }