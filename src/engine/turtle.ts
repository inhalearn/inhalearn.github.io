import { Position } from '@/types/position';
import { Direction, DIRECTION_VECTORS } from '@/types/position';
import { DrawSegment } from '@/types/execution';

export interface TurtleConfig {
  gridSize: number;
  startPosition: Position;
  walls?: Position[];
}

export class Turtle {
  private position: Position;
  private readonly trail: Position[];
  private readonly drawSegments: DrawSegment[];
  private readonly config: TurtleConfig;
  private lastFailureReason: 'collision' | 'out-of-bounds' | null = null;
  private penDown = true;
  private penColor = '#0099CC';

  constructor(config: TurtleConfig) {
    this.config = config;
    this.position = { ...config.startPosition };
    this.trail = [{ ...config.startPosition }];
    this.drawSegments = [];
  }

  move(direction: Direction): boolean {
    const previousPosition = { ...this.position };
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
    if (this.penDown) {
      this.drawSegments.push({
        from: previousPosition,
        to: { ...nextPosition },
        color: this.penColor,
      });
    }
    this.lastFailureReason = null;
    return true;
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getTrail(): Position[] {
    return this.trail.map((position) => ({ ...position }));
  }

  getDrawSegments(): DrawSegment[] {
    return this.drawSegments.map((segment) => ({
      from: { ...segment.from },
      to: { ...segment.to },
      color: segment.color,
    }));
  }

  getLastFailureReason(): 'collision' | 'out-of-bounds' | null {
    return this.lastFailureReason;
  }

  setPenDown(penDown: boolean): void {
    this.penDown = penDown;
  }

  setPenColor(color: string): void {
    this.penColor = color;
  }

  reset(): void {
    this.position = { ...this.config.startPosition };
    this.trail.length = 0;
    this.trail.push({ ...this.config.startPosition });
    this.drawSegments.length = 0;
    this.lastFailureReason = null;
    this.penDown = true;
    this.penColor = '#0099CC';
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
