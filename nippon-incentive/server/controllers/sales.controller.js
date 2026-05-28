const supabase = require('../config/db')
const { success, fail } = require('../utils/apiResponse')

const getSales = async (req, res) => {
  const { month, year } = req.query
  const userId = req.user.id

  let query = supabase
    .from('sales_entries')
    .select('*, car_models(model_name, base_suffix, variant)')
    .eq('user_id', userId)

  if (month) query = query.eq('month', month)
  if (year) query = query.eq('year', year)

  const { data, error } = await query
  if (error) return fail(res, error.message)
  return success(res, data)
}

const upsertSale = async (req, res) => {
  const { car_model_id, month, year, units_sold } = req.body
  const userId = req.user.id

  if (!car_model_id || !month || !year || units_sold === undefined) {
    return fail(res, 'car_model_id, month, year and units_sold are required')
  }

  const { data, error } = await supabase
    .from('sales_entries')
    .upsert([{
      user_id: userId,
      car_model_id,
      month: parseInt(month),
      year: parseInt(year),
      units_sold: parseInt(units_sold)
    }], {
      onConflict: 'user_id,car_model_id,month,year'
    })
    .select()

  if (error) return fail(res, error.message)
  return success(res, data[0])
}

module.exports = { getSales, upsertSale }