import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Block, BlockType } from '@/types/block';
import { getLevelById, getNextLevelId } from '@/data/levels';
import { useCodeStore } from '@/store/codeStore';
import { useLevelStore } from '@/store/levelStore';
import { Button } from '@/components/ui/Button';
import { Canvas } from '@/components/canvas/Canvas';
import { BlockPicker } from '@/components/blocks/BlockPicker';
import { CodeEditor } from '@/components/blocks/CodeEditor';

function createBlock(type: BlockType): Block {
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
}

export function Level() {
  const { id } = useParams();
  const levelId = Number(id);
  const level = Number.isNaN(levelId) ? undefined : getLevelById(levelId);

  const blocks = useCodeStore((state) => state.blocks);
  const addBlock = useCodeStore((state) => state.addBlock);
  const removeBlock = useCodeStore((state) => state.removeBlock);
  const clearBlocks = useCodeStore((state) => state.clearBlocks);

  const currentLevel = useLevelStore((state) => state.currentLevel);
  const isExecuting = useLevelStore((state) => state.isExecuting);
  const executionResult = useLevelStore((state) => state.executionResult);
  const errorBlockIndex = useLevelStore((state) => state.errorBlockIndex);
  const execute = useLevelStore((state) => state.execute);
  const reset = useLevelStore((state) => state.reset);
  const setCurrentLevel = useLevelStore((state) => state.setCurrentLevel);
  const setExecutionSpeed = useLevelStore((state) => state.setExecutionSpeed);

  useEffect(() => {
    clearBlocks();
    reset();

    if (level) {
      setCurrentLevel(level.id);
    }
  }, [clearBlocks, level, reset, setCurrentLevel]);

  if (!level) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-8">
        <div className="mx-auto max-w-md rounded-[28px] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
          <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
            레벨을 찾을 수 없어요
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            요청한 스테이지가 아직 준비되지 않았습니다.
          </p>
          <Link to="/levels" className="mt-6 block">
            <Button className="w-full">레벨 목록으로</Button>
          </Link>
        </div>
      </main>
    );
  }

  const currentPosition = executionResult?.finalPosition ?? level.startPosition;
  const trail = executionResult?.trail ?? [level.startPosition];
  const nextLevelId = getNextLevelId(level.id);
  const missionComplete = executionResult?.success ?? false;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf8fd_0%,#f8fbfd_45%,#ffffff_100%)] px-4 py-6 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <header className="rounded-[28px] bg-[linear-gradient(135deg,#0099CC_0%,#33B5E5_100%)] p-5 text-white shadow-[0_16px_40px_rgba(0,153,204,0.24)]">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/levels"
              className="inline-flex min-h-11 items-center rounded-full bg-white/20 px-4 text-sm font-semibold"
            >
              뒤로
            </Link>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              📍 {currentLevel + 1}/6
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em]">
            스테이지 {level.id}
          </h1>
          <p className="mt-1 text-lg font-semibold">{level.title}</p>
          <p className="mt-4 rounded-2xl bg-white/20 px-4 py-3 text-sm leading-6">
            💬 {level.mission}
          </p>
        </header>

        <Canvas
          level={level}
          currentPosition={currentPosition}
          trail={trail}
          isExecuting={isExecuting}
        />

        <div className="grid grid-cols-3 gap-2 rounded-[28px] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExecutionSpeed('normal')}
          >
            보통
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExecutionSpeed('fast')}
          >
            빠르게
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExecutionSpeed('skip')}
          >
            건너뛰기
          </Button>
        </div>

        <BlockPicker
          availableBlocks={level.availableBlocks}
          disabled={isExecuting}
          onAddBlock={(type) => addBlock(createBlock(type))}
        />

        <CodeEditor
          blocks={blocks}
          errorBlockIndex={errorBlockIndex}
          onRemoveBlock={removeBlock}
          onClearBlocks={clearBlocks}
        />

        <section className="rounded-[28px] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
          <Button
            className="w-full"
            size="lg"
            disabled={isExecuting || blocks.length === 0}
            onClick={() => void execute(blocks, level)}
          >
            ▶ 실행하기
          </Button>

          {executionResult && !missionComplete ? (
            <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {executionResult.reason === 'out-of-bounds'
                ? '격자 밖으로 나갔어요. 방향을 다시 확인해보세요.'
                : '목표에 도달하지 못했어요. 문제 블록을 수정해보세요.'}
            </p>
          ) : null}

          {missionComplete ? (
            <div className="mt-3 space-y-3 rounded-[24px] bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
              <p className="font-bold">성공! 인덕이가 목표에 도착했어요.</p>
              <div className="grid grid-cols-2 gap-2">
                {nextLevelId !== null ? (
                  <Link to={`/level/${nextLevelId}`} className="block">
                    <Button className="w-full">다음 레벨</Button>
                  </Link>
                ) : (
                  <Link to="/completion" className="block">
                    <Button className="w-full">완주 화면</Button>
                  </Link>
                )}
                <Link to="/levels" className="block">
                  <Button variant="secondary" className="w-full">
                    레벨 목록
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
