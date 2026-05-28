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
