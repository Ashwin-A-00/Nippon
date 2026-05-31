import axios from 'axios'

const STATUS_FALLBACKS: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'Incorrect email or password.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested item was not found.',
  409: 'This conflicts with existing data. Please refresh and try again.',
  422: 'Please check the values you entered.',
  500: 'Server error. Please try again in a moment.',
  503: 'Service is temporarily unavailable. Please try again shortly.'
}

const isAxiosStatusMessage = (message: string) =>
  /^request failed with status code \d+$/i.test(message.trim())

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    const apiMessage =
      typeof data?.message === 'string' && data.message.trim()
        ? data.message.trim()
        : ''

    if (apiMessage && !isAxiosStatusMessage(apiMessage)) {
      return apiMessage
    }

    const status = error.response?.status
    if (status && STATUS_FALLBACKS[status]) {
      return STATUS_FALLBACKS[status]
    }

    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.'
    }
  }

  if (error instanceof Error) {
    const msg = error.message.trim()
    if (msg && !isAxiosStatusMessage(msg)) {
      return msg
    }
    const statusMatch = msg.match(/status code (\d+)/i)
    if (statusMatch) {
      const status = Number(statusMatch[1])
      if (STATUS_FALLBACKS[status]) {
        return STATUS_FALLBACKS[status]
      }
    }
  }

  return fallback
}
