import apiClient from './client'

export interface LoginResponse {
  token: string
  role: string
  name: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data.data
}