import type { CarModel } from '../types';

interface SalesRowProps {
  car: CarModel;
  value: number;
  onChange?: (carId: string, value: number) => void;
}

const SalesRow = ({ car, value, onChange }: SalesRowProps) => {
  return (
    <div>
      <label htmlFor={car.id}>{car.name}</label>
      <input
        id={car.id}
        type="number"
        value={value}
        onChange={(event) => onChange?.(car.id, Number(event.target.value))}
      />
    </div>
  );
};

export default SalesRow;
