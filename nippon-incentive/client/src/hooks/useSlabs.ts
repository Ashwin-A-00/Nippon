import { useEffect, useState } from 'react';
import { getSlabs } from '../api/slabs';
import type { SlabConfig } from '../types';

export const useSlabs = () => {
  const [activeSlab, setActiveSlab] = useState<SlabConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSlabs();
      setActiveSlab(data?.data?.[0] ?? null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
  }, []);

  return { activeSlab, tiers: activeSlab?.tiers ?? [], loading, error, refetch };
};
