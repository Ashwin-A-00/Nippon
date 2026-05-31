import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIncentive } from '../../api/incentive'
import Sidebar from '../../components/Sidebar'
import CustomSelect from '../../components/CustomSelect'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorBanner from '../../components/ErrorBanner'
import type { IncentiveResult } from '../../types'
import { ArrowRight } from 'lucide-react'

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 }
]

const years = [
  { label: '2024', value: 2024 },
  { label: '2025', value: 2025 },
  { label: '2026', value: 2026 },
  { label: '2027', value: 2027 },
  { label: '2028', value: 2028 }
]

const Dashboard = () => {
  const navigate = useNavigate()
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IncentiveResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const name = useMemo(() => localStorage.getItem('name') || 'Officer', [])

  useEffect(() => {
    const loadIncentive = async () => {
      setLoading(true)
      setErrorMsg('')
      try {
        const response = await getIncentive(month, year)
        setResult(response?.data ?? response)
      } catch (err: any) {
        if (
          err?.response?.status === 404 ||
          err?.status === 404 ||
          err?.message?.includes('404') ||
          err?.message?.includes('not found')
        ) {
          setResult({
            total_cars: 0,
            payout: 0,
            tier: null,
            month,
            year,
            active_slab: 'None',
            tiers: [],
            sales_breakdown: []
          })
        } else {
          setErrorMsg(err?.message || 'Failed to fetch incentive data.')
        }
      } finally {
        setLoading(false)
      }
    }

    void loadIncentive()
  }, [month, year])

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar />
      <main className="ml-0 md:ml-[260px] min-h-screen bg-[#0F0F0F] p-4 md:p-8 pt-20 md:pt-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Good morning, {name}</h2>
          <p className="mt-1 text-sm text-[#888888]">Track your performance and incentives</p>
        </div>

        <div className="my-6 h-px bg-white/[0.08]" />

        <div className="mb-6 flex flex-col sm:flex-row max-w-xs gap-3">
          <CustomSelect
            value={month}
            onChange={(val) => setMonth(Number(val))}
            options={months}
            className="flex-1"
          />
          <CustomSelect
            value={year}
            onChange={(val) => setYear(Number(val))}
            options={years}
            className="flex-1"
          />
        </div>

        <section className="relative w-full rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-4 md:p-8">
          <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-[#888888]">
            Incentive Summary
          </h3>

          {errorMsg && (
            <div className="mb-6">
              <ErrorBanner message={errorMsg} />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div>
              <div className="grid w-full grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-8">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-white">{result?.total_cars ?? 0}</span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-wider text-[#888888]">
                    Total Cars
                  </span>
                </div>

                <div className="hidden md:flex flex-col">
                  <span className="truncate text-2xl font-bold text-[#DC1428]">
                    {result?.tier
                      ? `${result.tier.min_cars}–${result.tier.max_cars ?? '∞'} cars`
                      : 'No tier'}
                  </span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-wider text-[#888888]">
                    Tier Hit
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-[#4ADE80]">
                    ₹{(result?.payout ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-wider text-[#888888]">
                    Total Payout
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-white/[0.08] pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/officer/sales')}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-3 text-sm font-medium text-white transition-all hover:border-[#DC1428]"
                >
                  <span>Log Sales for this month</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard
