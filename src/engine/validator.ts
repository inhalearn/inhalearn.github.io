import { Block } from '@/types/block';
import { LevelConfig, LevelStarRules } from '@/types/level';
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
    level: LevelConfig,
    blocks: Block[]
  ): ValidationResult {
    const success = this.checkGoalReached(current, level.goalPosition);

    return {
      success,
      stars: success ? this.calculateStarsForLevel(level, blocks) : 0,
    };
  }

  private calculateStarsForLevel(level: LevelConfig, blocks: Block[]): number {
    const starRules = level.starRules;

    if (!starRules || starRules.type === 'optimal-blocks') {
      return this.calculateStars(
        this.countBlocks(blocks),
        level.optimalBlockCount
      );
    }

    if (starRules.type === 'free-draw') {
      return starRules.autoStars ?? 3;
    }

    return this.calculateRepeatUsageStars(blocks, level.optimalBlockCount, starRules);
  }

  private calculateRepeatUsageStars(
    blocks: Block[],
    optimalBlocks: number,
    starRules: LevelStarRules
  ): number {
    const totalBlocks = this.countBlocks(blocks);
    const repeatBlocks = this.countRepeatBlocks(blocks);
    const minRepeatForThreeStars = starRules.minRepeatBlocksForThreeStars ?? 1;
    const minRepeatForTwoStars = starRules.minRepeatBlocksForTwoStars ?? 0;

    if (
      repeatBlocks >= minRepeatForThreeStars &&
      (starRules.threeStarMaxBlocks === undefined ||
        totalBlocks <= starRules.threeStarMaxBlocks)
    ) {
      return 3;
    }

    if (
      repeatBlocks >= minRepeatForTwoStars &&
      (starRules.twoStarMaxBlocks === undefined ||
        totalBlocks <= starRules.twoStarMaxBlocks)
    ) {
      return 2;
    }

    return this.calculateStars(totalBlocks, optimalBlocks);
  }

  private countBlocks(blocks: Block[]): number {
    return blocks.reduce((count, block) => {
      if (block.type === 'repeat') {
        return count + 1 + this.countBlocks(block.children);
      }

      return count + 1;
    }, 0);
  }

  private countRepeatBlocks(blocks: Block[]): number {
    return blocks.reduce((count, block) => {
      if (block.type !== 'repeat') {
        return count;
      }

      return count + 1 + this.countRepeatBlocks(block.children);
    }, 0);
  }
}
