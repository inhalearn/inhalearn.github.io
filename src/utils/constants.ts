/**
 * Application-wide constants for InhaLearn
 */

// Block system constraints
export const MAX_BLOCKS = 50; // Maximum number of blocks in code editor
export const MAX_REPEAT_COUNT = 10; // Maximum repeat count (1-10)
export const MAX_REPEAT_DEPTH = 3; // Maximum nesting depth for repeat blocks
export const MAX_ITERATIONS = 1000; // Maximum execution iterations (infinite loop prevention)

// Grid constraints
export const MIN_GRID_SIZE = 3;
export const MAX_GRID_SIZE = 10;

// Animation timing
export const ANIMATION_DURATION = {
  NORMAL: 300, // ms
  FAST: 100, // ms
  SKIP: 0, // ms
} as const;
