export const getToken = (): string | null => localStorage.getItem('token')

export const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

export const clearToken = (): void => {
  localStorage.removeItem('token')
}

export const getRole = (): string | null => localStorage.getItem('role')

export const setRole = (role: string): void => {
  localStorage.setItem('role', role)
}

export const clearRole = (): void => {
  localStorage.removeItem('role')
}

export const getName = (): string | null => localStorage.getItem('name')

export const setName = (name: string): void => {
  localStorage.setItem('name', name)
}
