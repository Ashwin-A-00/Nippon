import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await login(email, password)
      if (data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/officer')
      }
    } catch (err) {
      setError((err as Error).message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-8 border-l-4 border-[#CC0000] pl-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#CC0000]">Nippon Toyota</h1>
            <p className="mt-2 text-sm font-medium text-gray-600">Incentive Management System</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#CC0000] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#a80000] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
