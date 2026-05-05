import { create } from 'zustand';
import { Block } from '@/types/block';
import { ExecutionResult, ExecutionSpeed } from '@/types/execution';
import { LevelConfig } from '@/types/level';
import { BlockInterpreter } from '@/engine/interpreter';
import { Turtle } from '@/engine/turtle';
import { Validator } from '@/engine/validator';
import { useProgressStore } from './progressStore';

interface LevelStore {
  currentLevel: number;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  executionSpeed: ExecutionSpeed;
  errorBlockIndex: number | null;
  hintsUsed: number;
  setCurrentLevel: (level: number) => void;
  setExecutionSpeed: (speed: ExecutionSpeed) => void;
  setErrorBlockIndex: (index: number | null) => void;
  execute: (blocks: Block[], levelConfig: LevelConfig) => Promise<void>;
  showHint: () => void;
  reset: () => void;
}

const validator = new Validator();

const buildFailureResult = (): ExecutionResult => ({
  success: false,
  reason: 'collision',
  trail: [],
});

export const useLevelStore = create<LevelStore>((set, get) => ({
  currentLevel: 0,
  isExecuting: false,
  executionResult: null,
  executionSpeed: 'normal',
  errorBlockIndex: null,
  hintsUsed: 0,

  setCurrentLevel: (level) => set({ currentLevel: level }),

  setExecutionSpeed: (speed) => set({ executionSpeed: speed }),

  setErrorBlockIndex: (index) => set({ errorBlockIndex: index }),

  execute: async (blocks, levelConfig) => {
    set({
      isExecuting: true,
      executionResult: null,
      errorBlockIndex: null,
    });

    try {
      const turtle = new Turtle({
        gridSize: levelConfig.gridSize,
        startPosition: levelConfig.startPosition,
        walls: levelConfig.walls,
      });
      const interpreter = new BlockInterpreter(turtle);
      const result = await interpreter.execute(blocks, get().executionSpeed);

      set({
        executionResult: result,
        errorBlockIndex: result.success ? null : (result.errorBlockIndex ?? null),
      });

      if (result.success && result.finalPosition) {
        const validation = validator.validate(
          result.finalPosition,
          levelConfig.goalPosition,
          blocks.length,
          levelConfig.optimalBlockCount
        );

        if (validation.success) {
          const progressStore = useProgressStore.getState();
          progressStore.completeLevel(levelConfig.id, validation.stars);

          useProgressStore.setState((state) => {
            const currentProgress = state.levelProgress[levelConfig.id];
            if (!currentProgress) {
              return state;
            }

            return {
              levelProgress: {
                ...state.levelProgress,
                [levelConfig.id]: {
                  ...currentProgress,
                  hintsUsed: get().hintsUsed,
                },
              },
            };
          });
        } else {
          set({
            executionResult: {
              ...result,
              success: false,
              reason: 'collision',
            },
          });
        }
      }
    } catch (error) {
      console.warn('레벨 실행 실패:', error);
      set({
        executionResult: buildFailureResult(),
        errorBlockIndex: null,
      });
    } finally {
      set({ isExecuting: false });
    }
  },

  showHint: () => set((state) => ({ hintsUsed: state.hintsUsed + 1 })),

  reset: () =>
    set({
      isExecuting: false,
      executionResult: null,
      errorBlockIndex: null,
      hintsUsed: 0,
    }),
}));
