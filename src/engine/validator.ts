import { Position } from '@/types/position';

export interface ValidationResult {
  success: boolean;
  stars: number;
}

export class Validator {
  checkGoalReached(current: Position, goal: Position): boolean {
    return current.x === goal.x && current.y === goal.y;
  }

  calculateStars(usedBlocks: number, optimalBlocks: number): number {
    if (usedBlocks <= optimalBlocks) {
      return 3;
    }

    if (usedBlocks <= Math.ceil(optimalBlocks * 1.5)) {
      return 2;
    }

    return 1;
  }

  validate(
    current: Position,
    goal: Position,
    usedBlocks: number,
    optimalBlocks: number
  ): ValidationResult {
    const success = this.checkGoalReached(current, goal);

    return {
      success,
      stars: success ? this.calculateStars(usedBlocks, optimalBlocks) : 0,
    };
  }
}
