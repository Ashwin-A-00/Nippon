import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/auth'
import {
  clearRole,
  clearToken,
  getName,
  getRole,
  getToken,
  setName,
  setRole,
  setToken
} from '../lib/auth'

interface AuthUser {
  name: string
  role: string
}

export const useAuth = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const token = getToken()
    const role = getRole()
    const name = getName()

    if (token && role) {
      setUser({
        name: name ?? '',
        role
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password)

    setToken(data.token)
    setRole(data.role)
    setName(data.name)

    setUser({
      name: data.name,
      role: data.role
    })

    return data
  }

  const logout = () => {
    clearToken()
    clearRole()
    localStorage.removeItem('name')
    setUser(null)
    navigate('/login')
  }

  const isAuthenticated = useMemo(() => Boolean(getToken()), [user])

  return {
    user,
    login,
    logout,
    isAuthenticated
  }
}
