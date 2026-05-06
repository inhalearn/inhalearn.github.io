import { Position } from './position';

export interface DrawSegment {
  from: Position;
  to: Position;
  color: string;
}

export interface ExecutionResult {
  success: boolean;
  reason?: 'collision' | 'out-of-bounds' | 'goal-reached';
  errorBlockIndex?: number;
  finalPosition?: Position;
  trail: Position[];
  drawSegments?: DrawSegment[];
}

export type ExecutionSpeed = 'normal' | 'fast' | 'skip';
