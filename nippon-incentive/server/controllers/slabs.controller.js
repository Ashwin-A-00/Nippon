const supabase = require('../config/db')
const { success, fail } = require('../utils/apiResponse')

const getSlabs = async (req, res) => {
  const { data, error } = await supabase
    .from('slab_configs')
    .select('*, slab_tiers(*)')
    .order('created_at', { ascending: false })

  if (error) return fail(res, error.message)
  return success(res, data)
}

const getActiveSlab = async (req, res) => {
  const { data, error } = await supabase
    .from('slab_configs')
    .select('*, slab_tiers(*)')
    .eq('is_active', true)
    .limit(1)

  if (error) return fail(res, error.message)
  if (!data.length) return fail(res, 'No active slab configured', 404)
  return success(res, data[0])
}

const createSlab = async (req, res) => {
  const { label } = req.body
  if (!label) return fail(res, 'Label is required')

  const { data, error } = await supabase
    .from('slab_configs')
    .insert([{ label, is_active: false }])
    .select()

  if (error) return fail(res, error.message)
  return success(res, data[0], 201)
}

const addTier = async (req, res) => {
  const { id } = req.params
  const { min_cars, max_cars, incentive_per_car, sort_order } = req.body

  if (min_cars === undefined || incentive_per_car === undefined) {
    return fail(res, 'min_cars and incentive_per_car are required')
  }

  const { data, error } = await supabase
    .from('slab_tiers')
    .insert([{
      slab_config_id: id,
      min_cars,
      max_cars: max_cars || null,
      incentive_per_car,
      sort_order: sort_order || 0
    }])
    .select()

  if (error) return fail(res, error.message)
  return success(res, data[0], 201)
}

const activateSlab = async (req, res) => {
  const { id } = req.params

  // Deactivate all slabs first
  const { error: deactivateError } = await supabase
    .from('slab_configs')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deactivateError) return fail(res, deactivateError.message)

  // Activate selected slab
  const { data, error } = await supabase
    .from('slab_configs')
    .update({ is_active: true })
    .eq('id', id)
    .select()

  if (error) return fail(res, error.message)
  if (!data.length) return fail(res, 'Slab not found', 404)
  return success(res, data[0])
}

const updateSlab = async (req, res) => {
  const { id } = req.params
  const { label } = req.body

  const { data, error } = await supabase
    .from('slab_configs')
    .update({ label })
    .eq('id', id)
    .select()

  if (error) return fail(res, error.message)
  if (!data.length) return fail(res, 'Slab not found', 404)
  return success(res, data[0])
}

const updateTier = async (req, res) => {
  const { tierId } = req.params
  const { min_cars, max_cars, incentive_per_car, sort_order } = req.body

  const { data, error } = await supabase
    .from('slab_tiers')
    .update({
      min_cars,
      max_cars: max_cars || null,
      incentive_per_car,
      sort_order
    })
    .eq('id', tierId)
    .select()

  if (error) return fail(res, error.message)
  if (!data.length) return fail(res, 'Tier not found', 404)
  return success(res, data[0])
}

const deleteTier = async (req, res) => {
  const { tierId } = req.params

  const { error } = await supabase
    .from('slab_tiers')
    .delete()
    .eq('id', tierId)

  if (error) return fail(res, error.message)
  return success(res, { message: 'Tier deleted successfully' })
}

module.exports = { 
  getSlabs, 
  getActiveSlab, 
  createSlab, 
  addTier, 
  activateSlab, 
  updateSlab, 
  updateTier, 
  deleteTier 
}