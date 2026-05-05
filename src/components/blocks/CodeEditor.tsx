import { Block } from '@/types/block';
import { Button } from '@/components/ui/Button';

interface CodeEditorProps {
  blocks: Block[];
  errorBlockIndex?: number | null;
  onRemoveBlock: (id: string) => void;
  onClearBlocks: () => void;
}

function getBlockLabel(block: Block): string {
  switch (block.type) {
    case 'move-up':
      return '⬆️ 위로';
    case 'move-down':
      return '⬇️ 아래로';
    case 'move-left':
      return '⬅️ 왼쪽';
    case 'move-right':
      return '➡️ 오른쪽';
    case 'repeat':
      return `🔁 ${block.count}번 반복`;
    case 'color':
      return `🎨 색상 ${block.color}`;
    case 'pen-up':
      return '✏️ 펜 들기';
    case 'pen-down':
      return '🖍️ 펜 놓기';
  }
}

export function CodeEditor({
  blocks,
  errorBlockIndex = null,
  onRemoveBlock,
  onClearBlocks,
}: CodeEditorProps) {
  const hasBlocks = blocks.length > 0;

  return (
    <section className="rounded-[28px] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">📝 내 코드</p>
          <h2 className="text-lg font-bold text-slate-900">
            {hasBlocks ? `${blocks.length}개 블록` : '아직 비어 있어요'}
          </h2>
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasBlocks}
          onClick={onClearBlocks}
        >
          전체 지우기
        </Button>
      </div>

      <div className="space-y-2 rounded-[20px] bg-slate-100 p-3">
        {hasBlocks ? (
          blocks.map((block, index) => {
            const isError = errorBlockIndex === index;

            return (
              <div
                key={block.id}
                className={[
                  'flex items-center justify-between rounded-2xl border bg-white px-4 py-3',
                  isError
                    ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                    : 'border-slate-200',
                ].join(' ')}
                data-testid={`code-block-${index}`}
              >
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    {index + 1}번째 블록
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {getBlockLabel(block)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveBlock(block.id)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg text-slate-400 transition-colors hover:bg-red-100 hover:text-red-500"
                  aria-label={`${index + 1}번째 블록 삭제`}
                >
                  ×
                </button>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
            아래 블록을 눌러 코드를 만들어보세요.
          </div>
        )}
      </div>
    </section>
  );
}
