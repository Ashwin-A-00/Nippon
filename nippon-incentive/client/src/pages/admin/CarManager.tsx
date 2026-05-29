import { FormEvent, useEffect, useState } from 'react'
import { addCar, deleteCar, getCars } from '../../api/cars'
import type { CarModel } from '../../types'
import Sidebar from '../../components/Sidebar'
import { FullPageLoader } from '../../components/LoadingSpinner'
import { Car, Plus, Trash2 } from 'lucide-react'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#DC1428] focus:ring-2 focus:ring-[#DC1428]/20'

const CarManager = () => {
  const [cars, setCars] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [modelName, setModelName] = useState('')
  const [baseSuffix, setBaseSuffix] = useState('')
  const [variant, setVariant] = useState('')

  const fetchCars = async () => {
    setLoading(true)
    try {
      const response = await getCars()
      const parsedCars = Array.isArray(response) ? response : (response?.data ?? [])
      setCars(parsedCars)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchCars()
  }, [])

  const handleAddCar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!modelName.trim()) return

    await addCar({
      model_name: modelName,
      base_suffix: baseSuffix,
      variant
    })

    setModelName('')
    setBaseSuffix('')
    setVariant('')
    setShowForm(false)
    await fetchCars()
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this car model?')
    if (!confirmed) return

    await deleteCar(id)
    await fetchCars()
  }

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar />
      <main className="ml-[260px] min-h-screen bg-[#0F0F0F] p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Car Models</h2>
            <p className="mt-0.5 text-sm text-[#888888]">{cars.length} models</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-[#DC1428] px-5 py-2.5 text-sm text-white transition-all hover:bg-[#FF1A30]"
          >
            <Plus size={16} />
            <span>Add Model</span>
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showForm ? 'pointer-events-auto mt-4 max-h-[500px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
          }`}
        >
          <form
            onSubmit={handleAddCar}
            className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-6"
          >
            <h3 className="mb-4 text-sm font-medium text-white">New Car Model</h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#888888]">
                  Model Name *
                </label>
                <input
                  type="text"
                  required
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Corolla"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#888888]">Base Suffix</label>
                <input
                  type="text"
                  value={baseSuffix}
                  onChange={(e) => setBaseSuffix(e.target.value)}
                  placeholder="e.g. Hybrid"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#888888]">Variant</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="e.g. G"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-5 py-2.5 text-sm text-white transition-all hover:border-[#DC1428]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-5 py-2.5 text-sm text-white transition-all hover:border-[#DC1428]"
              >
                Save Model
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1A1A1A]">
          {cars.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16">
              <Car className="text-[#444444]" size={48} />
              <p className="mt-4 text-sm text-[#888888]">No car models yet</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-12 items-center bg-[#222222] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#888888]">
                <div className="col-span-4">Model</div>
                <div className="col-span-3">Suffix</div>
                <div className="col-span-3">Variant</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/[0.08]">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-[#222222]"
                  >
                    <div className="col-span-4 text-sm font-medium text-white">
                      {car.model_name}
                    </div>
                    <div className="col-span-3 text-sm text-[#888888]">
                      {car.base_suffix || '-'}
                    </div>
                    <div className="col-span-3 text-sm text-[#888888]">
                      {car.variant || '-'}
                    </div>
                    <div className="col-span-1">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          car.is_active
                            ? 'bg-white/[0.08] text-white'
                            : 'bg-[#222222] text-[#888888]'
                        }`}
                      >
                        {car.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Trash2
                        size={16}
                        onClick={() => handleDelete(car.id)}
                        className="cursor-pointer text-[#888888] transition-colors hover:text-[#DC1428]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CarManager
