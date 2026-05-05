import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLevelStore } from './levelStore';
import { useProgressStore } from './progressStore';
import { Block } from '@/types/block';
import { LevelConfig } from '@/types/level';

const mockLevelConfig: LevelConfig = {
  id: 0,
  title: '테스트 레벨',
  mission: '별까지 이동하기',
  gridSize: 5,
  startPosition: { x: 0, y: 0 },
  goalPosition: { x: 1, y: 0 },
  availableBlocks: ['move-right', 'move-up'],
  hints: ['오른쪽으로 이동해 보세요'],
  optimalBlockCount: 1,
};

describe('levelStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useLevelStore.getState().reset();
    useLevelStore.setState({
      currentLevel: 0,
      executionSpeed: 'normal',
});
    useProgressStore.getState().reset();
  });

  it('should set current level', () => {
    useLevelStore.getState().setCurrentLevel(2);

    expect(useLevelStore.getState().currentLevel).toBe(2);
  });

  it('should change execution speed', () => {
    const store = useLevelStore.getState();

    store.setExecutionSpeed('fast');
    expect(useLevelStore.getState().executionSpeed).toBe('fast');

    store.setExecutionSpeed('skip');
    expect(useLevelStore.getState().executionSpeed).toBe('skip');
  });

  it('should execute blocks successfully and complete progress', async () => {
    const blocks: Block[] = [{ id: '1', type: 'move-right' }];

    await useLevelStore.getState().execute(blocks, mockLevelConfig);

    const levelState = useLevelStore.getState();
    const progressState = useProgressStore.getState();

    expect(levelState.executionResult?.success).toBe(true);
    expect(levelState.executionResult?.finalPosition).toEqual({ x: 1, y: 0 });
    expect(levelState.errorBlockIndex).toBeNull();
    expect(progressState.completedLevels).toEqual([0]);
    expect(progressState.levelProgress[0].stars).toBe(3);
  });

  it('should set errorBlockIndex on collision failure', async () => {
    const blocks: Block[] = [{ id: '1', type: 'move-up' }];

    await useLevelStore.getState().execute(blocks, mockLevelConfig);

    const state = useLevelStore.getState();
    expect(state.executionResult?.success).toBe(false);
    expect(state.executionResult?.reason).toBe('out-of-bounds');
    expect(state.errorBlockIndex).toBe(0);
  });

  it('should set isExecuting during async execution', async () => {
    vi.useFakeTimers();

    const blocks: Block[] = [{ id: '1', type: 'move-right' }];
    const executePromise = useLevelStore.getState().execute(blocks, mockLevelConfig);

    expect(useLevelStore.getState().isExecuting).toBe(true);

    await vi.runAllTimersAsync();
    await executePromise;

    expect(useLevelStore.getState().isExecuting).toBe(false);
    vi.useRealTimers();
  });

  it('should increment hintsUsed', () => {
    const { showHint } = useLevelStore.getState();

    showHint();
    showHint();

    expect(useLevelStore.getState().hintsUsed).toBe(2);
  });

  it('should reset execution state', async () => {
    useLevelStore.getState().showHint();
    useLevelStore.getState().setErrorBlockIndex(1);
    await useLevelStore.getState().execute(
      [{ id: '1', type: 'move-up' }],
      mockLevelConfig
    );

    useLevelStore.getState().reset();

    const state = useLevelStore.getState();
    expect(state.isExecuting).toBe(false);
    expect(state.executionResult).toBeNull();
    expect(state.errorBlockIndex).toBeNull();
    expect(state.hintsUsed).toBe(0);
  });
});
