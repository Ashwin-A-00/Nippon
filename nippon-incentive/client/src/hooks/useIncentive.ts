import { useMemo } from 'react';
import type { SlabTier } from '../types';
import { calculateIncentive } from '../lib/calculateIncentive';

export const useIncentive = (salesMap: Record<string, number>, tiers: SlabTier[]) => {
  const totalCars = useMemo(
    () => Object.values(salesMap).reduce((sum, value) => sum + Number(value || 0), 0),
    [salesMap]
  );

  return useMemo(() => calculateIncentive(totalCars, tiers), [totalCars, tiers]);
};
