import axios from 'axios'
import { getApiErrorMessage } from '../lib/apiError'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getApiErrorMessage(error)
    const apiError = new Error(message) as Error & {
      status?: number
      isAxiosError?: boolean
    }
    apiError.status = error.response?.status
    apiError.isAxiosError = true
    return Promise.reject(apiError)
  }
)

export default apiClient
