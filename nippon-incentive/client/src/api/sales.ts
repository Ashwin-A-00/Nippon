import apiClient from './client'

export const getSales = async (month: number, year: number) => {
  const response = await apiClient.get(`/sales?month=${month}&year=${year}`)
  return response.data.data
}

export const upsertSale = async (data: unknown) => {
  const response = await apiClient.post('/sales', data)
  return response.data.data
}
