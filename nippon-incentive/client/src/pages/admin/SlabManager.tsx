import { FormEvent, useEffect, useState } from 'react'
import { activateSlab, addTier, createSlab, getSlabs } from '../../api/slabs'
import type { SlabConfig } from '../../types'
import Sidebar from '../../components/Sidebar'
import SlabTable from '../../components/SlabTable'
import { FullPageLoader } from '../../components/LoadingSpinner'
import { Plus } from 'lucide-react'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#DC1428] focus:ring-2 focus:ring-[#DC1428]/20'

const SlabManager = () => {
  const [slabs, setSlabs] = useState<SlabConfig[]>([])
  const [showSlabForm, setShowSlabForm] = useState(false)
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedSlabId, setExpandedSlabId] = useState<string | null>(null)
  const [tierForms, setTierForms] = useState<
    Record<string, { min_cars: string; max_cars: string; incentive_per_car: string; sort_order: string }>
  >({})

  const fetchSlabs = async () => {
    setLoading(true)
    try {
      const response = await getSlabs()
      const data = Array.isArray(response) ? response : (response?.data ?? [])
      setSlabs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchSlabs()
  }, [])

  const handleCreateSlab = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!label.trim()) return

    await createSlab(label)
    setLabel('')
    setShowSlabForm(false)
    await fetchSlabs()
  }

  const handleAddTier = async (event: FormEvent<HTMLFormElement>, slabId: string) => {
    event.preventDefault()
    const form = tierForms[slabId]
    if (!form) return

    await addTier(slabId, {
      min_cars: Number(form.min_cars),
      max_cars: form.max_cars ? Number(form.max_cars) : null,
      incentive_per_car: Number(form.incentive_per_car),
      sort_order: Number(form.sort_order || '0')
    })

    setTierForms((prev) => ({
      ...prev,
      [slabId]: { min_cars: '', max_cars: '', incentive_per_car: '', sort_order: '' }
    }))
    setExpandedSlabId(null)
    await fetchSlabs()
  }

  const handleActivate = async (id: string) => {
    await activateSlab(id)
    await fetchSlabs()
  }

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'Date unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar />
      <main className="ml-[260px] min-h-screen bg-[#0F0F0F] p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Incentive Slabs</h2>
          <button
            type="button"
            onClick={() => setShowSlabForm(!showSlabForm)}
            className="flex items-center gap-2 rounded-xl bg-[#DC1428] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#FF1A30]"
          >
            <Plus size={16} />
            <span>New Slab</span>
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showSlabForm ? 'pointer-events-auto mt-4 max-h-[300px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
          }`}
        >
          <form
            onSubmit={handleCreateSlab}
            className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-6"
          >
            <h3 className="mb-4 text-sm font-medium text-white">Create New Slab</h3>
            <div className="flex flex-col items-end gap-3 sm:flex-row">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-[#888888]">Slab Label</label>
                <input
                  type="text"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  required
                  placeholder="e.g. Q2 FY 2026 Incentive Slab"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSlabForm(false)}
                  className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-5 py-3 text-sm text-white transition-all hover:border-[#DC1428]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-6 py-3 text-sm font-medium text-white transition-all hover:border-[#DC1428]"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 flex w-full flex-col gap-4">
          {slabs.map((slab) => {
            const tierForm = tierForms[slab.id] || {
              min_cars: '',
              max_cars: '',
              incentive_per_car: '',
              sort_order: ''
            }
            const isAddingTier = expandedSlabId === slab.id

            return (
              <article
                key={slab.id}
                className="w-full rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{slab.label}</h3>
                    <p className="mt-0.5 text-xs text-[#888888]">
                      Created: {getFormattedDate(slab.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {slab.is_active ? (
                      <span className="rounded-full border border-[#DC1428]/30 bg-[rgba(220,20,40,0.08)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#DC1428]">
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleActivate(slab.id)}
                        className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-1.5 text-sm font-medium text-white transition-all hover:border-[#DC1428]"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>

                <div className="my-4 h-px bg-white/[0.08]" />

                <SlabTable tiers={slab.slab_tiers} />

                <div className="mt-4">
                  {!isAddingTier ? (
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedSlabId(slab.id)
                        if (!tierForms[slab.id]) {
                          setTierForms((prev) => ({
                            ...prev,
                            [slab.id]: {
                              min_cars: '',
                              max_cars: '',
                              incentive_per_car: '',
                              sort_order: ''
                            }
                          }))
                        }
                      }}
                      className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#888888] transition-colors hover:text-white"
                    >
                      <Plus size={16} />
                      <span>Add Tier</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={(event) => handleAddTier(event, slab.id)}
                      className="mt-4 border-t border-white/[0.08] pt-4"
                    >
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#888888]">
                        New Tier Details
                      </h4>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-[#888888]">
                            Min Cars *
                          </label>
                          <input
                            type="number"
                            required
                            value={tierForm.min_cars}
                            onChange={(event) =>
                              setTierForms((prev) => ({
                                ...prev,
                                [slab.id]: { ...tierForm, min_cars: event.target.value }
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-[#888888]">
                            Max Cars
                          </label>
                          <input
                            type="number"
                            placeholder="∞ for unlimited"
                            value={tierForm.max_cars}
                            onChange={(event) =>
                              setTierForms((prev) => ({
                                ...prev,
                                [slab.id]: { ...tierForm, max_cars: event.target.value }
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-[#888888]">
                            Incentive per Car (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            value={tierForm.incentive_per_car}
                            onChange={(event) =>
                              setTierForms((prev) => ({
                                ...prev,
                                [slab.id]: { ...tierForm, incentive_per_car: event.target.value }
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-[#888888]">
                            Sort Order *
                          </label>
                          <input
                            type="number"
                            required
                            value={tierForm.sort_order}
                            onChange={(event) =>
                              setTierForms((prev) => ({
                                ...prev,
                                [slab.id]: { ...tierForm, sort_order: event.target.value }
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setExpandedSlabId(null)}
                          className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-2 text-sm text-white transition-all hover:border-[#DC1428]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-5 py-2 text-sm text-white transition-all hover:border-[#DC1428]"
                        >
                          Add Tier
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default SlabManager
