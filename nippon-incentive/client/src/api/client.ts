import axios from 'axios'
import { getApiErrorMessage, type ApiError } from '../lib/apiError'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000
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
    const apiError = new Error(message) as ApiError

    if (axios.isAxiosError(error)) {
      apiError.status = error.response?.status
    }

    return Promise.reject(apiError)
  }
)

export default apiClient
