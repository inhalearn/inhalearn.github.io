import { Block, BlockType } from '@/types/block';
import { ExecutionResult, ExecutionSpeed } from '@/types/execution';
import { Direction } from '@/types/position';
import { ANIMATION_DURATION, MAX_ITERATIONS } from '@/utils/constants';
import { Turtle } from './turtle';

export class BlockInterpreter {
  private readonly turtle: Turtle;
  private iterations = 0;

  constructor(turtle: Turtle) {
    this.turtle = turtle;
  }

  async execute(
    blocks: Block[],
    speed: ExecutionSpeed = 'normal'
  ): Promise<ExecutionResult> {
    this.iterations = 0;
    return this.executeBlocks(blocks, speed);
  }

  private async executeBlocks(
    blocks: Block[],
    speed: ExecutionSpeed
  ): Promise<ExecutionResult> {
    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index];

      if (block.type === 'repeat') {
        for (let repeatIndex = 0; repeatIndex < block.count; repeatIndex += 1) {
          const result = await this.executeBlocks(block.children, speed);

          if (!result.success) {
            return {
              ...result,
              errorBlockIndex: index,
            };
          }
        }

        continue;
      }

      if (block.type === 'color') {
        this.turtle.setPenColor(block.color);
        continue;
      }

      if (block.type === 'pen-up') {
        this.turtle.setPenDown(false);
        continue;
      }

      if (block.type === 'pen-down') {
        this.turtle.setPenDown(true);
        continue;
      }

      if (!this.isMoveBlock(block.type)) {
        continue;
      }

      this.iterations += 1;
      if (this.iterations > MAX_ITERATIONS) {
        return {
          success: false,
          reason: 'collision',
          errorBlockIndex: index,
          trail: this.turtle.getTrail(),
        };
      }

      const moved = this.turtle.move(this.getDirection(block.type));
      if (!moved) {
        return {
          success: false,
          reason: this.turtle.getLastFailureReason() ?? 'collision',
          errorBlockIndex: index,
          trail: this.turtle.getTrail(),
          drawSegments: this.turtle.getDrawSegments(),
        };
      }

      const duration = ANIMATION_DURATION[
        speed.toUpperCase() as keyof typeof ANIMATION_DURATION
      ];
      if (duration > 0) {
        await this.sleep(duration);
      }
    }

    return {
      success: true,
      finalPosition: this.turtle.getPosition(),
      trail: this.turtle.getTrail(),
      drawSegments: this.turtle.getDrawSegments(),
    };
  }

  private isMoveBlock(
    type: BlockType
  ): type is Extract<BlockType, `move-${string}`> {
    return (
      type === 'move-up' ||
      type === 'move-down' ||
      type === 'move-left' ||
      type === 'move-right'
    );
  }

  private getDirection(type: Extract<BlockType, `move-${string}`>): Direction {
    const directionMap: Record<Extract<BlockType, `move-${string}`>, Direction> =
      {
        'move-up': 'up',
        'move-down': 'down',
        'move-left': 'left',
        'move-right': 'right',
      };

    return directionMap[type];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
