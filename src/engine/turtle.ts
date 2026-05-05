import { Position } from '@/types/position';
import { Direction, DIRECTION_VECTORS } from '@/types/position';

export interface TurtleConfig {
  gridSize: number;
  startPosition: Position;
  walls?: Position[];
}

export class Turtle {
  private position: Position;
  private readonly trail: Position[];
  private readonly config: TurtleConfig;
  private lastFailureReason: 'collision' | 'out-of-bounds' | null = null;

  constructor(config: TurtleConfig) {
    this.config = config;
    this.position = { ...config.startPosition };
    this.trail = [{ ...config.startPosition }];
  }

  move(direction: Direction): boolean {
    const vector = DIRECTION_VECTORS[direction];
    const nextPosition: Position = {
      x: this.position.x + vector.x,
      y: this.position.y + vector.y,
    };

    if (this.isOutOfBounds(nextPosition)) {
      this.lastFailureReason = 'out-of-bounds';
      return false;
    }

    if (this.hitWall(nextPosition)) {
      this.lastFailureReason = 'collision';
      return false;
    }

    this.position = nextPosition;
    this.trail.push({ ...nextPosition });
    this.lastFailureReason = null;
    return true;
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getTrail(): Position[] {
    return this.trail.map((position) => ({ ...position }));
  }

  getLastFailureReason(): 'collision' | 'out-of-bounds' | null {
    return this.lastFailureReason;
  }
  
  reset(): void {
    this.position = { ...this.config.startPosition };
    this.trail.length = 0;
    this.trail.push({ ...this.config.startPosition });
    this.lastFailureReason = null;
  }

  private isOutOfBounds(position: Position): boolean {
    return (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= this.config.gridSize ||
      position.y >= this.config.gridSize
    );
  }

  private hitWall(position: Position): boolean {
    return (
      this.config.walls?.some(
        (wall) => wall.x === position.x && wall.y === position.y
      ) ?? false
    );
  }
}
