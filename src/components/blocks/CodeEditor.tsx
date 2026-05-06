import { Block, BlockType, RepeatBlock } from '@/types/block';
import { Button } from '@/components/ui/Button';
import { getBlockLabel, getBlockTypeLabel } from './blockText';

interface CodeEditorProps {
  blocks: Block[];
  errorBlockIndex?: number | null;
  availableChildBlocks?: BlockType[];
  onRemoveBlock: (id: string) => void;
  onClearBlocks: () => void;
  onUpdateBlock?: (
    id: string,
    updates: Partial<RepeatBlock>
  ) => void;
  createBlock?: (type: BlockType) => Block;
}

function updateNestedBlocks(
  blocks: Block[],
  targetId: string,
  updater: (block: Block) => Block
): Block[] {
  return blocks.map((block) => {
    if (block.id === targetId) {
      return updater(block);
    }

    if (block.type !== 'repeat') {
      return block;
    }

    return {
      ...block,
      children: updateNestedBlocks(block.children, targetId, updater),
    };
  });
}

function removeNestedBlock(blocks: Block[], targetId: string): Block[] {
  return blocks
    .filter((block) => block.id !== targetId)
    .map((block) =>
      block.type === 'repeat'
        ? {
            ...block,
            children: removeNestedBlock(block.children, targetId),
          }
        : block
    );
}

interface RepeatEditorProps {
  block: RepeatBlock;
  depth: number;
  rootBlockId: string;
  rootChildren: Block[];
  availableChildBlocks: BlockType[];
  createBlock: (type: BlockType) => Block;
  onCommitRootChildren: (children: Block[]) => void;
  onRemoveSelf: () => void;
  onUpdateRootBlock: (id: string, updates: Partial<RepeatBlock>) => void;
}

function RepeatEditor({
  block,
  depth,
  rootBlockId,
  rootChildren,
  availableChildBlocks,
  createBlock,
  onCommitRootChildren,
  onRemoveSelf,
  onUpdateRootBlock,
}: RepeatEditorProps) {
  const cardTone =
    depth === 0
      ? 'border-violet-200 bg-violet-50'
      : 'border-violet-100 bg-white';

  const handleCountChange = (count: number) => {
    if (block.id === rootBlockId) {
      onUpdateRootBlock(rootBlockId, { count });
      return;
    }

    onCommitRootChildren(
      updateNestedBlocks(rootChildren, block.id, (target) =>
        target.type === 'repeat' ? { ...target, count } : target
      )
    );
  };

  const handleAddChild = (type: BlockType) => {
    const nextBlock = createBlock(type);

    if (block.id === rootBlockId) {
      onUpdateRootBlock(rootBlockId, {
        children: [...block.children, nextBlock],
      });
      return;
    }

    onCommitRootChildren(
      updateNestedBlocks(rootChildren, block.id, (target) =>
        target.type === 'repeat'
          ? { ...target, children: [...target.children, nextBlock] }
          : target
      )
    );
  };

  const handleRemoveChild = (childId: string) => {
    if (block.id === rootBlockId) {
      onUpdateRootBlock(rootBlockId, {
        children: removeNestedBlock(block.children, childId),
      });
      return;
    }

    onCommitRootChildren(removeNestedBlock(rootChildren, childId));
  };

  return (
    <div
      className={`rounded-2xl border px-4 py-4 ${cardTone}`}
      data-testid={depth === 0 ? `code-block-repeat-${block.id}` : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-violet-500">
            {depth === 0 ? '반복 블록' : '중첩 반복'}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            🔁 반복하기
          </p>
        </div>
        <button
          type="button"
          onClick={onRemoveSelf}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg text-slate-400 transition-colors hover:bg-red-100 hover:text-red-500"
          aria-label={depth === 0 ? '반복 블록 삭제' : '중첩 반복 삭제'}
        >
          ×
        </button>
      </div>

      <label className="mt-4 block text-xs font-semibold text-slate-500">
        반복 횟수
        <select
          value={block.count}
          onChange={(event) => handleCountChange(Number(event.target.value))}
          className="mt-2 min-h-11 w-full rounded-2xl border border-violet-200 bg-white px-3 text-sm font-semibold text-slate-900"
          data-testid={`repeat-count-${block.id}`}
          aria-label="반복 횟수"
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count}번
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-500">반복 안에 넣기</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {availableChildBlocks.map((type) => (
            <Button
              key={`${block.id}-${type}`}
              variant="secondary"
              size="sm"
              className="rounded-full border-0 bg-white ring-1 ring-violet-200"
              onClick={() => handleAddChild(type)}
            >
              {getBlockTypeLabel(type)} 추가
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-dashed border-violet-200 bg-white/80 p-3">
        {block.children.length > 0 ? (
          block.children.map((child) =>
            child.type === 'repeat' ? (
              <RepeatEditor
                key={child.id}
                block={child}
                depth={depth + 1}
                rootBlockId={rootBlockId}
                rootChildren={rootChildren}
                availableChildBlocks={availableChildBlocks}
                createBlock={createBlock}
                onCommitRootChildren={onCommitRootChildren}
                onRemoveSelf={() => handleRemoveChild(child.id)}
                onUpdateRootBlock={(id, updates) => {
                  onCommitRootChildren(
                    updateNestedBlocks(rootChildren, id, (target) =>
                      target.type === 'repeat'
                        ? { ...target, ...updates }
                        : target
                    )
                  );
                }}
              />
            ) : (
              <div
                key={child.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {getBlockLabel(child)}
                </p>
                <button
                  type="button"
                  onClick={() => handleRemoveChild(child.id)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg text-slate-400 transition-colors hover:bg-red-100 hover:text-red-500"
                  aria-label={`${getBlockLabel(child)} 삭제`}
                >
                  ×
                </button>
              </div>
            )
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500">
            반복할 블록을 아래 버튼으로 추가해보세요.
          </div>
        )}
      </div>
    </div>
  );
}

function renderBlockLine(
  block: Block,
  index: number,
  errorBlockIndex: number | null,
  onRemoveBlock: (id: string) => void,
  availableChildBlocks: BlockType[],
  onUpdateBlock: ((id: string, updates: Partial<RepeatBlock>) => void) | undefined,
  createBlock: (type: BlockType) => Block
) {
  if (block.type === 'repeat' && onUpdateBlock) {
    return (
      <RepeatEditor
        key={block.id}
        block={block}
        depth={0}
        rootBlockId={block.id}
        rootChildren={block.children}
        availableChildBlocks={availableChildBlocks}
        createBlock={createBlock}
        onCommitRootChildren={(children) => onUpdateBlock(block.id, { children })}
        onRemoveSelf={() => onRemoveBlock(block.id)}
        onUpdateRootBlock={onUpdateBlock}
      />
    );
  }

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
        <p className="text-xs font-semibold text-slate-400">{index + 1}번째 블록</p>
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
}

export function CodeEditor({
  blocks,
  errorBlockIndex = null,
  availableChildBlocks = [],
  onRemoveBlock,
  onClearBlocks,
  onUpdateBlock,
  createBlock = (type) => {
    const id = `${type}-${crypto.randomUUID()}`;

    switch (type) {
      case 'repeat':
        return { id, type, count: 2, children: [] };
      case 'color':
        return { id, type, color: '#0099CC' };
      case 'pen-up':
      case 'pen-down':
      case 'move-up':
      case 'move-down':
      case 'move-left':
      case 'move-right':
        return { id, type };
    }
  },
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
          blocks.map((block, index) =>
            renderBlockLine(
              block,
              index,
              errorBlockIndex,
              onRemoveBlock,
              availableChildBlocks,
              onUpdateBlock,
              createBlock
            )
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
            아래 블록을 눌러 코드를 만들어보세요.
          </div>
        )}
      </div>
    </section>
  );
}
