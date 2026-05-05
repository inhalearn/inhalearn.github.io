import { Position, Direction, DIRECTION_VECTORS } from '@/types/position';

export interface TurtleConfig {
  gridSize: number;
  startPosition: Position;
  walls?: Position[];
}

export class Turtle {
  private position: Position;
  private trail: Position[];
  private config: TurtleConfig;

  constructor(config: TurtleConfig) {
    this.config = config;
    this.position = { ...config.startPosition };
    this.trail = [{ ...config.startPosition }];
  }

  move(direction: Direction): boolean {
    const vector = DIRECTION_VECTORS[direction];
    const newPos: Position = {
      x: this.position.x + vector.x,
      y: this.position.y + vector.y,
    };

    // 경계 체크
    if (this.isOutOfBounds(newPos)) {
      return false;
    }

    // 벽 체크
    if (this.hitWall(newPos)) {
      return false;
    }

    // 이동
    this.position = newPos;
    this.trail.push({ ...newPos });
    return true;
  }

  private isOutOfBounds(pos: Position): boolean {
    return (
      pos.x < 0 ||
      pos.y < 0 ||
      pos.x >= this.config.gridSize ||
      pos.y >= this.config.gridSize
    );
  }

  private hitWall(pos: Position): boolean {
    return (
      this.config.walls?.some((wall) => wall.x === pos.x && wall.y === pos.y) ||
      false
    );
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getTrail(): Position[] {
    return this.trail.map((pos) => ({ ...pos }));
  }

  reset(): void {
    this.position = { ...this.config.startPosition };
    this.trail = [{ ...this.config.startPosition }];
  }
}
