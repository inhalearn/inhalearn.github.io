/**
 * Level configuration and progress types for InhaLearn
 */

import { BlockType } from './block';
import { Position } from './position';

export interface LevelStarRules {
  type: 'optimal-blocks' | 'repeat-usage' | 'free-draw';
  threeStarMaxBlocks?: number;
  twoStarMaxBlocks?: number;
  minRepeatBlocksForThreeStars?: number;
  minRepeatBlocksForTwoStars?: number;
  autoStars?: number;
}

export interface PresetMissionOption {
  id: string;
  title: string;
  description: string;
}

/**
 * Level configuration - defines a single stage
 */
export interface LevelConfig {
  id: number;
  title: string;
  mission: string;
  gridSize: number; // 격자 크기 (예: 5 → 5x5)
  startPosition: Position;
  goalPosition: Position;
  walls?: Position[]; // 벽 위치 (선택)
  availableBlocks: BlockType[]; // 사용 가능한 블록
  maxBlocks?: number; // 최대 블록 수 (선택)
  hints: string[]; // 힌트 목록
  optimalBlockCount: number; // 최적 블록 수 (별 3개 기준)
  discoveryMode?: boolean;
  unlockRepeatAt?: number;
  completionMode?: 'goal' | 'free-draw';
  starRules?: LevelStarRules;
  palette?: string[];
  presetMissions?: PresetMissionOption[];
}

/**
 * Progress tracking for a single level
 * Stored in localStorage via progressStore
 */
export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number; // 0-3
  hintsUsed: number;
  attempts: number;
  completedAt?: number; // timestamp
}
