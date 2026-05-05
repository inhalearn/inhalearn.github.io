import { LevelConfig } from '@/types/level';
import { DrawSegment } from '@/types/execution';
import { Position } from '@/types/position';
import { Grid } from './Grid';
import { Induck } from './Induck';
import { Trail } from './Trail';

export interface CanvasProps {
  level: LevelConfig;
  currentPosition: Position;
  trail?: Position[];
  drawSegments?: DrawSegment[];
  isExecuting?: boolean;
}

export function Canvas({
  level,
  currentPosition,
  trail = [],
  drawSegments = [],
  isExecuting = false,
}: CanvasProps) {
  return (
    <section className="rounded-[28px] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">플레이 보드</p>
          <h2 className="text-lg font-bold text-slate-900">{level.title}</h2>
        </div>
        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold',
            isExecuting
              ? 'bg-sky-100 text-[#007299]'
              : 'bg-slate-100 text-slate-600',
          ].join(' ')}
        >
          {isExecuting ? '실행 중' : '대기 중'}
        </span>
      </div>

      <div
        className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[24px]"
        data-testid="level-canvas"
      >
        <Grid level={level} trail={trail} />
        <Trail gridSize={level.gridSize} segments={drawSegments} />
        <Induck level={level} position={currentPosition} />
      </div>
    </section>
  );
}
