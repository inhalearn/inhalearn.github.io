import { Position } from '@/types/position';

export interface ValidationResult {
  success: boolean;
  stars: number; // 0-3
}

export class Validator {
  /**
   * 현재 위치가 목표 위치에 도달했는지 확인
   */
  checkGoalReached(current: Position, goal: Position): boolean {
    return current.x === goal.x && current.y === goal.y;
  }

  /**
   * 사용한 블록 수를 기준으로 별점 계산
   * - 최적 블록 수 사용 → 3개
   * - 최적 × 1.5 이하 사용 → 2개
   * - 그 외 → 1개
   */
  calculateStars(usedBlocks: number, optimalBlocks: number): number {
    if (usedBlocks === optimalBlocks) {
      return 3;
    }
    if (usedBlocks <= Math.floor(optimalBlocks * 1.5)) {
      return 2;
    }
    return 1;
  }

  /**
   * 레벨 완료 여부 검증 및 별점 계산
   * - 목표 미도달 시 stars는 항상 0
   * - 목표 도달 시 사용한 블록 수에 따라 별점 부여
   */
  validate(
    current: Position,
    goal: Position,
    usedBlocks: number,
    optimalBlocks: number
  ): ValidationResult {
    const success = this.checkGoalReached(current, goal);
    const stars = success ? this.calculateStars(usedBlocks, optimalBlocks) : 0;
    return { success, stars };
  }
}
