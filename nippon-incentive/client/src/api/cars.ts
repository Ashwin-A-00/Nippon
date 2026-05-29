import apiClient from './client'

export const getCars = async () => {
  const response = await apiClient.get('/cars')
  return response.data.data
}

export const addCar = async (data: unknown) => {
  const response = await apiClient.post('/cars', data)
  return response.data.data
}

export const updateCar = async (id: string, data: unknown) => {
  const response = await apiClient.put(`/cars/${id}`, data)
  return response.data.data
}

export const deleteCar = async (id: string) => {
  try {
    const response = await apiClient.delete(`/cars/${id}`)
    return response.data.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete car: ${error.message}`)
    }
    throw new Error('Failed to delete car')
  }
}
