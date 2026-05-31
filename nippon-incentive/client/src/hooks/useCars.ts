import { useEffect, useState } from 'react';
import { getCars } from '../api/cars';
import { getApiErrorMessage } from '../lib/apiError';
import type { CarModel } from '../types';

export const useCars = () => {
  const [cars, setCars] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCars();
      setCars(data?.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
  }, []);

  return { cars, loading, error, refetch };
};
