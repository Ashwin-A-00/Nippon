import { FormEvent, useEffect, useState } from 'react'
import { activateSlab, addTier, createSlab, getSlabs } from '../../api/slabs'
import type { SlabConfig } from '../../types'
import Navbar from '../../components/Navbar'

const SlabManager = () => {
  const [slabs, setSlabs] = useState<SlabConfig[]>([])
  const [showSlabForm, setShowSlabForm] = useState(false)
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(true)
  const [tierForms, setTierForms] = useState<Record<string, { min_cars: string; max_cars: string; incentive_per_car: string }>>({})

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
      incentive_per_car: Number(form.incentive_per_car)
    })

    setTierForms((prev) => ({
      ...prev,
      [slabId]: { min_cars: '', max_cars: '', incentive_per_car: '' }
    }))

    await fetchSlabs()
  }

  const handleActivate = async (id: string) => {
    await activateSlab(id)
    await fetchSlabs()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold text-gray-900">Incentive Slab Configuration</h2>
          <button
            type="button"
            onClick={() => setShowSlabForm((value) => !value)}
            className="rounded-lg bg-[#CC0000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a80000]"
          >
            {showSlabForm ? 'Cancel' : 'Create New Slab'}
          </button>
        </div>

        {showSlabForm ? (
          <form onSubmit={handleCreateSlab} className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-700">Slab Label</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
                placeholder="Q2 FY 2026 Incentive Slab"
              />
              <button type="submit" className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black">
                Save
              </button>
            </div>
          </form>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-600 shadow-sm">Loading slabs...</div>
        ) : (
          <div className="space-y-5">
            {slabs.map((slab) => {
              const tierForm = tierForms[slab.id] || { min_cars: '', max_cars: '', incentive_per_car: '' }

              return (
                <article key={slab.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{slab.label}</h3>
                      {slab.is_active ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">ACTIVE</span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      disabled={slab.is_active}
                      onClick={() => handleActivate(slab.id)}
                      className="rounded-md bg-[#CC0000] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#a80000] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {slab.is_active ? 'Active' : 'Activate'}
                    </button>
                  </div>

                  <div className="overflow-x-auto px-5 py-4">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Min Cars</th>
                          <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Max Cars</th>
                          <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Incentive/Car</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slab.slab_tiers.map((tier) => (
                          <tr key={tier.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm text-gray-700">{tier.min_cars}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{tier.max_cars === null ? '?' : tier.max_cars}</td>
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">?{tier.incentive_per_car}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <form onSubmit={(event) => handleAddTier(event, slab.id)} className="grid gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 md:grid-cols-4">
                    <input
                      type="number"
                      required
                      placeholder="Min Cars"
                      value={tierForm.min_cars}
                      onChange={(event) =>
                        setTierForms((prev) => ({
                          ...prev,
                          [slab.id]: { ...tierForm, min_cars: event.target.value }
                        }))
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
                    />
                    <input
                      type="number"
                      placeholder="Max Cars (optional)"
                      value={tierForm.max_cars}
                      onChange={(event) =>
                        setTierForms((prev) => ({
                          ...prev,
                          [slab.id]: { ...tierForm, max_cars: event.target.value }
                        }))
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Incentive / Car"
                      value={tierForm.incentive_per_car}
                      onChange={(event) =>
                        setTierForms((prev) => ({
                          ...prev,
                          [slab.id]: { ...tierForm, incentive_per_car: event.target.value }
                        }))
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
                    />
                    <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
                      Add Tier
                    </button>
                  </form>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default SlabManager
