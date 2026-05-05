import { Block, MoveBlock, RepeatBlock } from '@/types/block';
import { ExecutionResult, ExecutionSpeed } from '@/types/execution';
import { Position } from '@/types/position';
import { Turtle } from './turtle';

// 필수 제한값 (CLAUDE.md)
const MAX_ITERATIONS = 1000; // 최대 이동 횟수
const MAX_REPEAT_DEPTH = 3; // 중첩 깊이

export class BlockInterpreter {
  private turtle: Turtle;
  private iterationCount: number;

  constructor(turtle: Turtle) {
    this.turtle = turtle;
    this.iterationCount = 0;
  }

  async execute(
    blocks: Block[],
    speed: ExecutionSpeed = 'normal',
    goalPosition?: Position
  ): Promise<ExecutionResult> {
    // 반복 카운터 초기화
    this.iterationCount = 0;

    // 재귀 실행 시작
    const result = await this.executeBlocks(blocks, speed, 0);

    // 목표 위치 도달 체크 (선택적)
    if (result.success && goalPosition) {
      const currentPos = this.turtle.getPosition();
      if (currentPos.x === goalPosition.x && currentPos.y === goalPosition.y) {
        return {
          ...result,
          reason: 'goal-reached',
        };
      }
    }

    return result;
  }

  private async executeBlocks(
    blocks: Block[],
    speed: ExecutionSpeed,
    currentDepth: number
  ): Promise<ExecutionResult> {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      // 무한 루프 감지
      if (this.iterationCount > MAX_ITERATIONS) {
        return {
          success: false,
          reason: 'collision',
          errorBlockIndex: i,
          trail: this.turtle.getTrail(),
        };
      }

      if (block.type === 'repeat') {
        // 반복 블록 처리
        const repeatBlock = block as RepeatBlock;

        // 중첩 깊이 체크
        if (currentDepth >= MAX_REPEAT_DEPTH) {
          return {
            success: false,
            reason: 'collision',
            errorBlockIndex: i,
            trail: this.turtle.getTrail(),
          };
        }

        // 반복 실행
        for (let j = 0; j < repeatBlock.count; j++) {
          const result = await this.executeBlocks(
            repeatBlock.children,
            speed,
            currentDepth + 1
          );

          if (!result.success) {
            // 반복 블록 내부에서 에러 발생 시 외부 반복 블록의 인덱스 반환
            return {
              ...result,
              errorBlockIndex: i,
            };
          }
        }
      } else if (this.isMoveBlock(block.type)) {
        // 이동 블록 처리
        const moveBlock = block as MoveBlock;
        const direction = this.getDirection(moveBlock.type);

        const success = this.turtle.move(direction);
        this.iterationCount++;

        if (!success) {
          return {
            success: false,
            reason: 'collision',
            errorBlockIndex: i,
            trail: this.turtle.getTrail(),
          };
        }

        // 애니메이션 대기 (skip이 아닐 때만)
        if (speed !== 'skip') {
          const duration = speed === 'fast' ? 100 : 300;
          await this.sleep(duration);
        }
      }
      // color, pen-up, pen-down 블록은 무시 (Phase 3에서 구현)
    }

    return {
      success: true,
      finalPosition: this.turtle.getPosition(),
      trail: this.turtle.getTrail(),
    };
  }

  private isMoveBlock(type: string): boolean {
    return ['move-up', 'move-down', 'move-left', 'move-right'].includes(type);
  }

  private getDirection(
    type: 'move-up' | 'move-down' | 'move-left' | 'move-right'
  ): 'up' | 'down' | 'left' | 'right' {
    const map = {
      'move-up': 'up',
      'move-down': 'down',
      'move-left': 'left',
      'move-right': 'right',
    } as const;
    return map[type];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
