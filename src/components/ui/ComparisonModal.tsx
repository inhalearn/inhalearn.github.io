import { Block } from '@/types/block';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getBlockLabel } from '@/components/blocks/blockText';

interface ComparisonModalProps {
  isOpen: boolean;
  beforeBlocks: Block[];
  afterBlocks: Block[];
  onNext: () => void;
  onClose: () => void;
}

function countDisplayLines(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    if (block.type !== 'repeat') {
      return total + 1;
    }

    return total + 1 + countDisplayLines(block.children);
  }, 0);
}

function BlockList({
  blocks,
  depth = 0,
}: {
  blocks: Block[];
  depth?: number;
}) {
  return (
    <ol className="space-y-2">
      {blocks.map((block, index) => (
        <li key={block.id} className="text-sm text-slate-700">
          <div
            className="rounded-2xl bg-white px-3 py-2"
            style={{ marginLeft: `${depth * 12}px` }}
          >
            <span className="font-semibold text-slate-500">{index + 1}. </span>
            <span className="font-semibold text-slate-900">{getBlockLabel(block)}</span>
          </div>
          {block.type === 'repeat' && block.children.length > 0 ? (
            <div className="mt-2">
              <BlockList blocks={block.children} depth={depth + 1} />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function ComparisonModal({
  isOpen,
  beforeBlocks,
  afterBlocks,
  onNext,
  onClose,
}: ComparisonModalProps) {
  const beforeLineCount = countDisplayLines(beforeBlocks);
  const afterLineCount = countDisplayLines(afterBlocks);
  const savedLines =
    beforeLineCount > 0
      ? Math.round(((beforeLineCount - afterLineCount) / beforeLineCount) * 100)
      : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div className="text-center">
          <p className="text-sm font-semibold text-[#007299]">📊 코드 비교</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            더 짧은 코드가 되었어요
          </h2>
        </div>

        <div className="grid gap-4">
          <section className="rounded-[24px] bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-600">
              ❌ 이전 방법: {beforeLineCount}줄
            </p>
            <div className="mt-3">
              <BlockList blocks={beforeBlocks} />
            </div>
          </section>

          <section className="rounded-[24px] bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-600">
              ✅ 반복 사용: {afterLineCount}줄
            </p>
            <div className="mt-3">
              <BlockList blocks={afterBlocks} />
            </div>
          </section>
        </div>

        <p className="rounded-2xl bg-sky-50 px-4 py-3 text-center text-sm font-semibold text-[#007299]">
          {savedLines}% 줄어들었어요! 🎉
        </p>

        <div className="grid gap-3">
          <Button className="w-full" onClick={onNext}>
            다음 스테이지로
          </Button>
          <Button variant="secondary" className="w-full" onClick={onClose}>
            여기서 더 보기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
