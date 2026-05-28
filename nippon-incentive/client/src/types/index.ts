export interface User { id: string; name: string; email: string; role: string }
export interface CarModel { id: string; model_name: string; base_suffix: string; variant: string; is_active: boolean }
export interface SlabTier { id: string; slab_config_id: string; min_cars: number; max_cars: number | null; incentive_per_car: number; sort_order: number }
export interface SlabConfig { id: string; label: string; is_active: boolean; slab_tiers: SlabTier[] }
export interface SalesEntry { id: string; user_id: string; car_model_id: string; month: number; year: number; units_sold: number }
export interface IncentiveResult { month: number; year: number; total_cars: number; tier: SlabTier | null; payout: number; tiers: SlabTier[]; active_slab: string }
