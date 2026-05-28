import { FormEvent, useEffect, useState } from 'react'
import { addCar, deleteCar, getCars } from '../../api/cars'
import type { CarModel } from '../../types'
import Navbar from '../../components/Navbar'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold text-gray-900">Car Models</h2>
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="rounded-lg bg-[#CC0000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a80000]"
          >
            {showForm ? 'Cancel' : 'Add Car'}
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleAddCar} className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Model Name</label>
              <input
                value={modelName}
                onChange={(event) => setModelName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Base Suffix</label>
              <input
                value={baseSuffix}
                onChange={(event) => setBaseSuffix(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Variant</label>
              <input
                value={variant}
                onChange={(event) => setVariant(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/20"
              />
            </div>
            <div className="md:col-span-4">
              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Save Car
              </button>
            </div>
          </form>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm font-medium text-gray-600">Loading car models...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Model Name</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Base Suffix</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Variant</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-t border-gray-100 transition hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{car.model_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{car.base_suffix || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{car.variant || '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            car.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {car.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(car.id)}
                          className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CarManager
