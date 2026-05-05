import { Position } from './position';
import { BlockType } from './block';

export interface LevelConfig {
  id: number;
  title: string;
  mission: string;
  gridSize: number; // MIN_GRID_SIZE(3) ~ MAX_GRID_SIZE(10)
  startPosition: Position;
  goalPosition: Position;
  walls?: Position[];
  availableBlocks: BlockType[];
  maxBlocks?: number; // 생략 시 MAX_BLOCKS(50) 적용
  hints: string[];
  optimalBlockCount: number;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number; // 0~3
  hintsUsed: number;
  attempts: number;
  completedAt?: number; // Date.now() timestamp
}
