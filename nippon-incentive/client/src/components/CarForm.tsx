import type { CarModel } from '../types'

interface CarFormProps {
  initialValues?: Partial<CarModel>
  onSubmit?: (values: Partial<CarModel>) => void
}

const CarForm = ({ initialValues, onSubmit }: CarFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.(initialValues ?? {})
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.08] bg-[#1A1A1A] p-6"
    >
      <h3 className="text-sm font-medium text-white">Car Form</h3>
      <button
        type="submit"
        className="mt-4 rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-2 text-sm text-white transition-all hover:border-[#DC1428]"
      >
        Save
      </button>
    </form>
  )
}

export default CarForm
