import apiClient from './client'

export const getSlabs = async () => {
  const response = await apiClient.get('/slabs')
  return response.data.data
}

export const getActiveSlab = async () => {
  const response = await apiClient.get('/slabs/active')
  return response.data.data
}

export const createSlab = async (label: string) => {
  const response = await apiClient.post('/slabs', { label })
  return response.data.data
}

export const addTier = async (slabId: string, tierData: unknown) => {
  const response = await apiClient.post(`/slabs/${slabId}/tiers`, tierData)
  return response.data.data
}

export const activateSlab = async (id: string) => {
  const response = await apiClient.post(`/slabs/${id}/activate`)
  return response.data.data
}

export const updateTier = async (tierId: string, tierData: unknown) => {
  try {
    const response = await apiClient.put(`/slabs/tiers/${tierId}`, tierData)
    return response.data.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update tier: ${error.message}`)
    }
    throw new Error('Failed to update tier')
  }
}

export const deleteTier = async (tierId: string) => {
  try {
    const response = await apiClient.delete(`/slabs/tiers/${tierId}`)
    return response.data.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete tier: ${error.message}`)
    }
    throw new Error('Failed to delete tier')
  }
}

export const deleteSlab = async (slabId: string) => {
  try {
    const response = await apiClient.delete(`/slabs/${slabId}`)
    return response.data.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete slab: ${error.message}`)
    }
    throw new Error('Failed to delete slab')
  }
}
