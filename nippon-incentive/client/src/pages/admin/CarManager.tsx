import { FormEvent, useEffect, useState } from 'react'
import { addCar, deleteCar, getCars, updateCar } from '../../api/cars'
import type { CarModel } from '../../types'
import Sidebar from '../../components/Sidebar'
import { FullPageLoader } from '../../components/LoadingSpinner'
import ErrorBanner from '../../components/ErrorBanner'
import { Car, Plus, Trash2, Edit2 } from 'lucide-react'

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#DC1428] focus:ring-2 focus:ring-[#DC1428]/20'

const CarManager = () => {
  const [cars, setCars] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [modelName, setModelName] = useState('')
  const [baseSuffix, setBaseSuffix] = useState('')
  const [variant, setVariant] = useState('')
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchCars = async () => {
    setLoading(true)
    try {
      const response = await getCars()
      const parsedCars = Array.isArray(response) ? response : (response?.data ?? [])
      const activeCars = parsedCars.filter((car: CarModel) => car.is_active)
      setCars(activeCars)
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

    try {
      setError('')

      if (editingId) {
        // Edit existing car
        await updateCar(editingId, {
          model_name: modelName,
          base_suffix: baseSuffix,
          variant
        })
      } else {
        // Add new car
        await addCar({
          model_name: modelName,
          base_suffix: baseSuffix,
          variant
        })
      }

      setModelName('')
      setBaseSuffix('')
      setVariant('')
      setEditingId(null)
      setShowForm(false)
      await fetchCars()
    } catch (err) {
      const message = err instanceof Error ? err.message : editingId
        ? 'Failed to edit car model'
        : 'Failed to add car model'
      setError(message)
    }
  }

  const handleEdit = (car: CarModel) => {
    setEditingId(car.id)
    setModelName(car.model_name)
    setBaseSuffix(car.base_suffix || '')
    setVariant(car.variant || '')
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    setModelName('')
    setBaseSuffix('')
    setVariant('')
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this car model?')
    if (!confirmed) return

    try {
      setError('')
      setDeletingId(id)
      await deleteCar(id)
      await fetchCars()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete car model'
      setError(message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar />
      <main className="ml-0 md:ml-[260px] min-h-screen bg-[#0F0F0F] p-4 md:p-8 pt-20 md:pt-8">
        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} onDismiss={() => setError('')} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Car Models</h2>
            <p className="mt-0.5 text-sm text-[#888888]">{cars.length} models</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-[#DC1428] px-5 py-2.5 text-sm text-white transition-all hover:bg-[#FF1A30] w-full sm:w-auto justify-center sm:justify-start"
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
            <h3 className="mb-4 text-sm font-medium text-white">
              {editingId ? 'Edit Car Model' : 'New Car Model'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleFormClose}
                className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-5 py-2.5 text-sm text-white transition-all hover:border-[#DC1428]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-5 py-2.5 text-sm text-white transition-all hover:border-[#DC1428]"
              >
                {editingId ? 'Update Model' : 'Save Model'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 w-full">
          {cars.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16">
              <Car className="text-[#444444]" size={48} />
              <p className="mt-4 text-sm text-[#888888]">No car models yet</p>
            </div>
          ) : (
            <div>
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1A1A1A]">
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
                      <div className="col-span-1 flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-[#888888] transition-colors hover:text-[#4ADE80]"
                          aria-label="Edit car"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deletingId === car.id}
                          className="text-[#888888] transition-colors hover:text-[#DC1428] disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete car"
                        >
                          <Trash2
                            size={16}
                            className={deletingId === car.id ? 'animate-pulse' : ''}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards - Hidden on desktop */}
              <div className="md:hidden space-y-3">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{car.model_name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-[#888888]">
                            Suffix: <span className="text-white">{car.base_suffix || '-'}</span>
                          </p>
                          <p className="text-xs text-[#888888]">
                            Variant: <span className="text-white">{car.variant || '-'}</span>
                          </p>
                        </div>
                        <div className="mt-3">
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
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-[#888888] transition-colors hover:text-[#4ADE80]"
                          aria-label="Edit car"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deletingId === car.id}
                          className="text-[#888888] transition-colors hover:text-[#DC1428] disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete car"
                        >
                          <Trash2
                            size={18}
                            className={deletingId === car.id ? 'animate-pulse' : ''}
                          />
                        </button>
                      </div>
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
