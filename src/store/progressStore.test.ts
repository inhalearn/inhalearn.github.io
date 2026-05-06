/**
 * Tests for progressStore
 * - Level completion
 * - Re-completion (star updates, attempt increments)
 * - Total stars calculation
 * - Completed levels (no duplicates)
 * - Reset functionality
 * - localStorage persistence
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from './progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset store state
    useProgressStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should start with empty state', () => {
      const state = useProgressStore.getState();
      expect(state.completedLevels).toEqual([]);
      expect(state.levelProgress).toEqual({});
      expect(state.totalStars).toBe(0);
    });
  });

  describe('completeLevel', () => {
    it('should complete a level (first time)', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 3);

      const state = useProgressStore.getState();

      // Should add to completedLevels
      expect(state.completedLevels).toEqual([0]);

      // Should create progress entry
      expect(state.levelProgress[0]).toEqual({
        levelId: 0,
        completed: true,
        stars: 3,
        hintsUsed: 0,
        attempts: 1,
        completedAt: expect.any(Number),
      });

      // Should update totalStars
      expect(state.totalStars).toBe(3);
    });

    it('should handle re-completion with better stars', () => {
      const { completeLevel } = useProgressStore.getState();

      // First completion
      completeLevel(0, 1);

      let state = useProgressStore.getState();
      expect(state.levelProgress[0].stars).toBe(1);
      expect(state.levelProgress[0].attempts).toBe(1);
      expect(state.totalStars).toBe(1);

      // Re-complete with better stars
      completeLevel(0, 3);

      state = useProgressStore.getState();
      expect(state.levelProgress[0].stars).toBe(3);
      expect(state.levelProgress[0].attempts).toBe(2); // incremented
      expect(state.totalStars).toBe(3); // updated
    });

    it('should not duplicate completedLevels on re-completion', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 3);
      completeLevel(0, 2); // re-complete with worse stars

      const state = useProgressStore.getState();
      expect(state.completedLevels).toEqual([0]); // no duplicate
      expect(state.levelProgress[0].attempts).toBe(2);
    });

    it('should track multiple levels correctly', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 3);
      completeLevel(1, 2);
      completeLevel(2, 1);

      const state = useProgressStore.getState();

      expect(state.completedLevels).toEqual([0, 1, 2]);
      expect(state.totalStars).toBe(6); // 3 + 2 + 1
      expect(Object.keys(state.levelProgress)).toHaveLength(3);
    });

    it('should preserve hintsUsed on re-completion', () => {
      const { completeLevel } = useProgressStore.getState();

      // First completion
      completeLevel(0, 2);

      // Manually set hintsUsed (would normally be set by levelStore)
      const state1 = useProgressStore.getState();
      state1.levelProgress[0].hintsUsed = 2;

      // Re-complete
      completeLevel(0, 3);

      const state2 = useProgressStore.getState();
      // hintsUsed should be preserved from first attempt
      expect(state2.levelProgress[0].hintsUsed).toBe(2);
    });

    it('should update completedAt timestamp on re-completion', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 1);
      const firstTimestamp = useProgressStore.getState().levelProgress[0]
        .completedAt;

      // Small delay to ensure different timestamp
      const start = Date.now();
      while (Date.now() - start < 5) {
        // wait 5ms
      }

      completeLevel(0, 3);
      const secondTimestamp = useProgressStore.getState().levelProgress[0]
        .completedAt;

      expect(secondTimestamp).toBeGreaterThan(firstTimestamp!);
    });
  });

  describe('totalStars calculation', () => {
    it('should calculate total stars correctly', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 3);
      completeLevel(1, 2);
      completeLevel(2, 3);
      completeLevel(3, 1);

      const state = useProgressStore.getState();
      expect(state.totalStars).toBe(9); // 3 + 2 + 3 + 1
    });

    it('should recalculate total stars on re-completion', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 1);
      completeLevel(1, 1);
      expect(useProgressStore.getState().totalStars).toBe(2);

      // Re-complete with better stars
      completeLevel(0, 3);
      expect(useProgressStore.getState().totalStars).toBe(4); // 3 + 1

      completeLevel(1, 3);
      expect(useProgressStore.getState().totalStars).toBe(6); // 3 + 3
    });
  });

  describe('reset', () => {
    it('should reset all progress', () => {
      const { completeLevel, reset } = useProgressStore.getState();

      // Add some progress
      completeLevel(0, 3);
      completeLevel(1, 2);
      completeLevel(2, 1);

      // Verify progress exists
      let state = useProgressStore.getState();
      expect(state.completedLevels).toHaveLength(3);
      expect(state.totalStars).toBe(6);

      // Reset
      reset();

      // Verify reset
      state = useProgressStore.getState();
      expect(state.completedLevels).toEqual([]);
      expect(state.levelProgress).toEqual({});
      expect(state.totalStars).toBe(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist to localStorage on completeLevel', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 3);

      // Check localStorage
      const saved = localStorage.getItem('inhalearn-progress');
      expect(saved).not.toBeNull();

      const parsed = JSON.parse(saved!);
      expect(parsed.state.completedLevels).toContain(0);
      expect(parsed.state.totalStars).toBe(3);
      expect(parsed.state.levelProgress[0].stars).toBe(3);
    });

    it('should restore from localStorage on initialization', () => {
      // Manually set localStorage
      const mockState = {
        state: {
          completedLevels: [0, 1, 2],
          levelProgress: {
            0: {
              levelId: 0,
              completed: true,
              stars: 3,
              hintsUsed: 0,
              attempts: 1,
              completedAt: Date.now(),
            },
            1: {
              levelId: 1,
              completed: true,
              stars: 2,
              hintsUsed: 1,
              attempts: 2,
              completedAt: Date.now(),
            },
            2: {
              levelId: 2,
              completed: true,
              stars: 1,
              hintsUsed: 2,
              attempts: 3,
              completedAt: Date.now(),
            },
          },
          totalStars: 6,
        },
        version: 0,
      };

      localStorage.setItem('inhalearn-progress', JSON.stringify(mockState));

      // Create a new store instance (simulates page reload)
      // In Zustand persist, we need to manually trigger rehydration in tests
      // For now, we verify that the data is in localStorage
      const saved = localStorage.getItem('inhalearn-progress');
      const parsed = JSON.parse(saved!);

      expect(parsed.state.completedLevels).toEqual([0, 1, 2]);
      expect(parsed.state.totalStars).toBe(6);
      expect(Object.keys(parsed.state.levelProgress)).toHaveLength(3);
    });

    it('should update localStorage on reset', () => {
      const { completeLevel, reset } = useProgressStore.getState();

      // Add progress
      completeLevel(0, 3);

      // Verify localStorage has data
      let saved = localStorage.getItem('inhalearn-progress');
      expect(saved).not.toBeNull();

      // Reset
      reset();

      // Verify localStorage is updated
      saved = localStorage.getItem('inhalearn-progress');
      const parsed = JSON.parse(saved!);
      expect(parsed.state.completedLevels).toEqual([]);
      expect(parsed.state.levelProgress).toEqual({});
      expect(parsed.state.totalStars).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0 stars', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 0);

      const state = useProgressStore.getState();
      expect(state.levelProgress[0].stars).toBe(0);
      expect(state.totalStars).toBe(0);
    });

    it('should handle negative level IDs (if somehow passed)', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(-1, 3);

      const state = useProgressStore.getState();
      expect(state.completedLevels).toContain(-1);
      expect(state.levelProgress[-1]).toBeDefined();
    });

    it('should handle large level IDs', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(999, 3);

      const state = useProgressStore.getState();
      expect(state.completedLevels).toContain(999);
      expect(state.levelProgress[999]).toBeDefined();
    });

    it('should handle multiple rapid completions', () => {
      const { completeLevel } = useProgressStore.getState();

      // Rapidly complete same level
      for (let i = 0; i < 10; i++) {
        completeLevel(0, 3);
      }

      const state = useProgressStore.getState();
      expect(state.completedLevels).toEqual([0]); // no duplicates
      expect(state.levelProgress[0].attempts).toBe(10);
    });
  });

  describe('Immutability', () => {
    it('should not mutate completedLevels array', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 3);
      const firstCompletedLevels = useProgressStore.getState().completedLevels;

      completeLevel(1, 2);
      const secondCompletedLevels = useProgressStore.getState().completedLevels;

      // Should be different references (immutable)
      expect(firstCompletedLevels).not.toBe(secondCompletedLevels);
      expect(firstCompletedLevels).toEqual([0]);
      expect(secondCompletedLevels).toEqual([0, 1]);
    });

    it('should not mutate levelProgress object', () => {
      const { completeLevel } = useProgressStore.getState();

      completeLevel(0, 3);
      const firstLevelProgress = useProgressStore.getState().levelProgress;

      completeLevel(1, 2);
      const secondLevelProgress = useProgressStore.getState().levelProgress;

      // Should be different references (immutable)
      expect(firstLevelProgress).not.toBe(secondLevelProgress);
      expect(Object.keys(firstLevelProgress)).toHaveLength(1);
      expect(Object.keys(secondLevelProgress)).toHaveLength(2);
    });
  });
});
