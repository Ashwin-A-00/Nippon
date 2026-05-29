import type { CarModel } from '../types'

interface SalesRowProps {
  car: CarModel
  value: number
  onChange?: (carId: string, value: number) => void
}

const SalesRow = ({ car, value, onChange }: SalesRowProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-3">
      <label htmlFor={car.id} className="text-sm text-white">
        {car.name}
      </label>
      <input
        id={car.id}
        type="number"
        value={value}
        onChange={(event) => onChange?.(car.id, Number(event.target.value))}
        className="w-20 rounded-lg border border-white/[0.08] bg-[#0F0F0F] px-3 py-2 text-sm text-white outline-none focus:border-[#DC1428]"
      />
    </div>
  )
}

export default SalesRow
