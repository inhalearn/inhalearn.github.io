import { Position } from './position';

export interface ExecutionResult {
  success: boolean;
  reason?: 'collision' | 'out-of-bounds' | 'goal-reached';
  errorBlockIndex?: number;
  finalPosition?: Position;
  trail: Position[];
}

export type ExecutionSpeed = 'normal' | 'fast' | 'skip';
