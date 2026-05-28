import apiClient from './client'

export const getIncentive = async (month: number, year: number) => {
  const response = await apiClient.get(`/incentive?month=${month}&year=${year}`)
  return response.data.data
}
