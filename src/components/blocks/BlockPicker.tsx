import { BlockType } from '@/types/block';
import { Button } from '@/components/ui/Button';
import { getBlockTypeLabel } from './blockText';

interface BlockPickerProps {
  availableBlocks: BlockType[];
  onAddBlock: (type: BlockType) => void;
  disabled?: boolean;
}

const blockMeta: Record<
  BlockType,
  { label: string; icon: string; tone: string }
> = {
  'move-up': {
    label: '위로',
    icon: '⬆️',
    tone: 'bg-sky-500 text-white',
  },
  'move-down': {
    label: '아래로',
    icon: '⬇️',
    tone: 'bg-sky-500 text-white',
  },
  'move-left': {
    label: '왼쪽',
    icon: '⬅️',
    tone: 'bg-sky-500 text-white',
  },
  'move-right': {
    label: '오른쪽',
    icon: '➡️',
    tone: 'bg-sky-500 text-white',
  },
  repeat: {
    label: getBlockTypeLabel('repeat'),
    icon: '🔁',
    tone: 'bg-violet-500 text-white',
  },
  color: {
    label: getBlockTypeLabel('color'),
    icon: '🎨',
    tone: 'bg-orange-400 text-white',
  },
  'pen-up': {
    label: getBlockTypeLabel('pen-up'),
    icon: '✏️',
    tone: 'bg-orange-400 text-white',
  },
  'pen-down': {
    label: getBlockTypeLabel('pen-down'),
    icon: '🖍️',
    tone: 'bg-orange-400 text-white',
  },
};

export function BlockPicker({
  availableBlocks,
  onAddBlock,
  disabled = false,
}: BlockPickerProps) {
  return (
    <section className="rounded-[28px] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">블록 팔레트</p>
          <h2 className="text-lg font-bold text-slate-900">눌러서 코드에 추가</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {availableBlocks.length}개 사용 가능
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availableBlocks.map((blockType) => {
          const meta = blockMeta[blockType];

          return (
            <Button
              key={blockType}
              variant="secondary"
              disabled={disabled}
              className={`min-h-[70px] flex-col gap-1 rounded-2xl border-0 ${meta.tone}`}
              onClick={() => onAddBlock(blockType)}
              data-testid={`block-picker-${blockType}`}
            >
              <span className="text-2xl">{meta.icon}</span>
              <span className="text-sm font-bold">{meta.label}</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
