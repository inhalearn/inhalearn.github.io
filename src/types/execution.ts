import { Position } from './position';

export interface ExecutionResult {
  success: boolean;
  reason?: 'collision' | 'out-of-bounds' | 'goal-reached';
  errorBlockIndex?: number; // 에러 발생 블록의 인덱스 (Phase 1 개선)
  finalPosition?: Position;
  trail: Position[];
}

export type ExecutionSpeed = 'normal' | 'fast' | 'skip';
