const supabase = require('../config/db')
const { success, fail } = require('../utils/apiResponse')

const getCars = async (req, res) => {
  const { data, error } = await supabase
    .from('car_models')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return fail(res, error.message)
  return success(res, data)
}

const addCar = async (req, res) => {
  const { model_name, base_suffix, variant } = req.body
  if (!model_name) return fail(res, 'Model name is required')

  const { data, error } = await supabase
    .from('car_models')
    .insert([{ model_name, base_suffix, variant }])
    .select()

  if (error) return fail(res, error.message)
  return success(res, data[0], 201)
}

const updateCar = async (req, res) => {
  const { id } = req.params
  const { model_name, base_suffix, variant, is_active } = req.body

  const { data, error } = await supabase
    .from('car_models')
    .update({ model_name, base_suffix, variant, is_active })
    .eq('id', id)
    .select()

  if (error) return fail(res, error.message)
  if (!data.length) return fail(res, 'Car not found', 404)
  return success(res, data[0])
}

const deleteCar = async (req, res) => {
  const { id } = req.params

  try {
    // First, delete all sales entries for this car
    await supabase
      .from('sales_entries')
      .delete()
      .eq('car_model_id', id)

    // Then soft delete the car
    const { data, error } = await supabase
      .from('car_models')
      .update({ is_active: false })
      .eq('id', id)
      .select()

    if (error) return fail(res, error.message)
    if (!data.length) return fail(res, 'Car not found', 404)
    return success(res, { message: 'Car deleted successfully' })
  } catch (err) {
    console.error('Delete car error:', err)
    return fail(res, 'Failed to delete car model')
  }
}

module.exports = { getCars, addCar, updateCar, deleteCar }