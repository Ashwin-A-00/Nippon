import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'
import { ButtonLoader } from '../components/LoadingSpinner'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#DC1428] focus:ring-2 focus:ring-[#DC1428]/20'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen w-full bg-[#0F0F0F]">
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-[#1A1A1A] p-16 lg:flex">
        <img
          src="/toyologo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[54%] w-[min(75%,420px)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none object-contain opacity-[0.07]"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-[0.3em] text-white">NIPPON</h1>
          <p className="mt-1 text-lg tracking-[0.5em] text-[#888888]">TOYOTA</p>
          <div className="my-8 h-px w-12 bg-white/[0.08]" />
          <div className="text-2xl font-light text-white">Drive Performance.</div>
          <div className="text-2xl font-light text-[#888888]">Reward Excellence.</div>
          <p className="mt-16 text-xs uppercase tracking-widest text-[#444444]">
            Incentive Management System
          </p>
        </div>
      </div>

      <div className="flex min-h-screen w-full items-center justify-center bg-[#0F0F0F] p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="mt-1 mb-8 text-sm text-[#888888]">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#888888]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#888888]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#888888] hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#DC1428] py-3 text-sm font-medium text-white transition-all hover:bg-[#FF1A30] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <span className="mr-2.5">
                  <ButtonLoader />
                </span>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {error && <p className="mt-3 text-center text-xs text-[#DC1428]">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
