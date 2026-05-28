import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncentive } from '../../api/incentive'
import { formatCurrency } from '../../lib/formatCurrency'
import type { IncentiveResult } from '../../types'
import Navbar from '../../components/Navbar'

const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1)
const yearOptions = [2024, 2025, 2026, 2027, 2028]

const Dashboard = () => {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IncentiveResult | null>(null)

  const name = useMemo(() => localStorage.getItem('name') || 'Officer', [])

  useEffect(() => {
    const loadIncentive = async () => {
      setLoading(true)
      try {
        const response = await getIncentive(month, year)
        setResult(response?.data ?? response)
      } finally {
        setLoading(false)
      }
    }

    void loadIncentive()
  }, [month, year])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Welcome, {name}</h2>
          <p className="mt-1 text-sm text-gray-600">Track your performance and incentives in real time.</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Month</label>
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
            >
              {monthOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Year</label>
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
            >
              {yearOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Current Incentive Summary</h3>

          {loading ? (
            <p className="mt-4 text-sm text-gray-600">Fetching incentive data...</p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Cars</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{result?.total_cars ?? 0}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tier Hit</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{result?.tier ? `${result.tier.min_cars}+` : 'No tier yet'}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Payout</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">{formatCurrency(result?.payout ?? 0)}</p>
              </div>
            </div>
          )}

          <Link
            to="/officer/sales"
            className="mt-6 inline-flex rounded-lg bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a80000]"
          >
            Log Sales
          </Link>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
