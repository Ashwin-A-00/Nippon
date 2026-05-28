import type { CarModel } from '../types';

interface CarFormProps {
  initialValues?: Partial<CarModel>;
  onSubmit?: (values: Partial<CarModel>) => void;
}

const CarForm = ({ initialValues, onSubmit }: CarFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(initialValues ?? {});
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Car Form</h3>
      <button type="submit">Save</button>
    </form>
  );
};

export default CarForm;
