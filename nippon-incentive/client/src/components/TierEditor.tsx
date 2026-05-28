import type { SlabTier } from '../types';

interface TierEditorProps {
  tier: SlabTier;
  onSave?: (tier: SlabTier) => void;
}

const TierEditor = ({ tier, onSave }: TierEditorProps) => {
  return (
    <div>
      <span>{tier.id}</span>
      <button type="button" onClick={() => onSave?.(tier)}>
        Save Tier
      </button>
    </div>
  );
};

export default TierEditor;
