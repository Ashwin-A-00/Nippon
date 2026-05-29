import type { SlabTier } from '../types'

interface TierEditorProps {
  tier: SlabTier
  onSave?: (tier: SlabTier) => void
}

const TierEditor = ({ tier, onSave }: TierEditorProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1A1A1A] px-4 py-3">
      <span className="text-sm text-[#888888]">{tier.id}</span>
      <button
        type="button"
        onClick={() => onSave?.(tier)}
        className="rounded-lg border border-white/[0.08] bg-[#1A1A1A] px-3 py-1.5 text-xs text-white transition-all hover:border-[#DC1428]"
      >
        Save Tier
      </button>
    </div>
  )
}

export default TierEditor
