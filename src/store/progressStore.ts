/**
 * Progress Store - Manages user progress with localStorage persistence
 *
 * Architecture:
 * - Uses Zustand persist middleware for automatic localStorage sync
 * - Storage key: 'inhalearn-progress'
 * - Handles localStorage errors gracefully (console.warn + continue)
 * - Follows ADR-006: localStorage (DB 없음) principles
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LevelProgress } from '@/types/level';

/**
 * Progress store interface
 */
interface ProgressStore {
  completedLevels: number[];
  levelProgress: Record<number, LevelProgress>;
  totalStars: number;
  completeLevel: (levelId: number, stars: number) => void;
  reset: () => void;
}

/**
 * Progress store with localStorage persistence
 *
 * State management layer:
 * localStorage (영구) → progressStore (Zustand) → React Components
 */
export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      // Initial state
      completedLevels: [],
      levelProgress: {},
      totalStars: 0,

      /**
       * Complete a level with given stars
       * - Updates levelProgress with stars, attempts, timestamp
       * - Adds to completedLevels (no duplicates)
       * - Recalculates totalStars
       */
      completeLevel: (levelId: number, stars: number) => {
        set((state) => {
          // Get existing progress for this level (if any)
          const existingProgress = state.levelProgress[levelId];

          // Create updated progress entry
          const newProgress: Record<number, LevelProgress> = {
            ...state.levelProgress,
            [levelId]: {
              levelId,
              completed: true,
              stars,
              hintsUsed: existingProgress?.hintsUsed || 0,
              attempts: (existingProgress?.attempts || 0) + 1,
              completedAt: Date.now(),
            },
          };

          // Add to completedLevels if not already present
          const newCompletedLevels = state.completedLevels.includes(levelId)
            ? state.completedLevels
            : [...state.completedLevels, levelId];

          // Recalculate total stars from all levels
          const newTotalStars = Object.values(newProgress).reduce(
            (sum, progress) => sum + progress.stars,
            0
          );

          return {
            completedLevels: newCompletedLevels,
            levelProgress: newProgress,
            totalStars: newTotalStars,
          };
        });
      },

      /**
       * Reset all progress (for testing or restart)
       */
      reset: () =>
        set({
          completedLevels: [],
          levelProgress: {},
          totalStars: 0,
        }),
    }),
    {
      name: 'inhalearn-progress',
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn('진행 상황 불러오기 실패:', error);
          // Continue with default state - not a fatal error
        }
      },
    }
  )
);
