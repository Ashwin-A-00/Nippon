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

const extractApiMessage = (data: unknown): string => {
  if (!data) return ''
  if (typeof data === 'string') return ''
  if (typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message
    return typeof message === 'string' ? message.trim() : ''
  }
  return ''
}

export type ApiError = Error & { status?: number }

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  const statusFromEnriched = (error as ApiError)?.status

  if (statusFromEnriched && STATUS_FALLBACKS[statusFromEnriched]) {
    if (statusFromEnriched === 401) {
      return 'Incorrect email or password.'
    }
    const enrichedMessage = error instanceof Error ? error.message.trim() : ''
    if (
      enrichedMessage &&
      !isAxiosStatusMessage(enrichedMessage) &&
      enrichedMessage !== STATUS_FALLBACKS[statusFromEnriched]
    ) {
      return enrichedMessage
    }
    return STATUS_FALLBACKS[statusFromEnriched]
  }

  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiMessage(error.response?.data)

    if (apiMessage && !isAxiosStatusMessage(apiMessage)) {
      return apiMessage
    }

    const status = error.response?.status
    if (status && STATUS_FALLBACKS[status]) {
      return STATUS_FALLBACKS[status]
    }

    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'The request timed out. Please try again.'
      }
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
