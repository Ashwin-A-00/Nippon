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

  const { error } = await supabase
    .from('car_models')
    .delete()
    .eq('id', id)

  if (error) return fail(res, error.message)
  return success(res, { message: 'Car deleted successfully' })
}

module.exports = { getCars, addCar, updateCar, deleteCar }