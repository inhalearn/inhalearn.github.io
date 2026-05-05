import { LevelConfig } from '@/types/level';
import { Position } from '@/types/position';

interface GridProps {
  level: LevelConfig;
  trail?: Position[];
}

function isSamePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function Grid({ level, trail = [] }: GridProps) {
  const cells = Array.from({ length: level.gridSize * level.gridSize }, (_, index) => {
    const x = index % level.gridSize;
    const y = Math.floor(index / level.gridSize);
    const position = { x, y };
    const isGoal = isSamePosition(position, level.goalPosition);
    const isWall =
      level.walls?.some((wall) => isSamePosition(wall, position)) ?? false;
    const isTrail = trail.some((step) => isSamePosition(step, position));

    return {
      key: `${x}-${y}`,
      x,
      y,
      isGoal,
      isWall,
      isTrail,
    };
  });

  return (
    <div
      className="grid h-full w-full gap-1 rounded-[24px] bg-slate-200/80 p-2"
      style={{
        gridTemplateColumns: `repeat(${level.gridSize}, minmax(0, 1fr))`,
      }}
      data-testid="level-grid"
    >
      {cells.map((cell) => (
        <div
          key={cell.key}
          data-testid={`grid-cell-${cell.x}-${cell.y}`}
          className={[
            'relative flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg',
            cell.isTrail ? 'bg-sky-100' : '',
            cell.isWall ? 'bg-slate-300 text-slate-600' : '',
            cell.isGoal ? 'bg-amber-100 text-amber-600' : '',
          ].join(' ')}
        >
          {cell.isGoal ? (
            <span aria-label="goal" data-testid={`goal-${cell.x}-${cell.y}`}>
              ⭐
            </span>
          ) : null}
          {cell.isWall ? (
            <span aria-label="wall" data-testid={`wall-${cell.x}-${cell.y}`}>
              🧱
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
