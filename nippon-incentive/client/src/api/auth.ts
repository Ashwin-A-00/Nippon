import apiClient from './client'
import type { ApiError } from '../lib/apiError'

export interface LoginResponse {
  token: string
  role: string
  name: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  if (!import.meta.env.VITE_API_URL) {
    throw Object.assign(
      new Error('App is not configured with an API URL. Set VITE_API_URL and rebuild.'),
      { status: 0 }
    ) satisfies ApiError
  }

  const response = await apiClient.post('/auth/login', { email, password })
  const body = response.data

  if (body?.success === false) {
    throw Object.assign(
      new Error(body.message || 'Incorrect email or password.'),
      { status: 401 }
    ) satisfies ApiError
  }

  if (!body?.data?.token) {
    throw Object.assign(
      new Error('Unexpected server response. Please check API configuration.'),
      { status: 500 }
    ) satisfies ApiError
  }

  return body.data
}
