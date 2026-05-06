import { DrawSegment } from '@/types/execution';

interface TrailProps {
  gridSize: number;
  segments: DrawSegment[];
}

function toCenterPercent(coordinate: number, gridSize: number): number {
  return ((coordinate + 0.5) / gridSize) * 100;
}

export function Trail({ gridSize, segments }: TrailProps) {
  if (segments.length === 0) {
    return null;
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      data-testid="trail-layer"
      aria-label="trail-layer"
    >
      {segments.map((segment, index) => (
        <line
          key={`${segment.from.x}-${segment.from.y}-${segment.to.x}-${segment.to.y}-${index}`}
          x1={toCenterPercent(segment.from.x, gridSize)}
          y1={toCenterPercent(segment.from.y, gridSize)}
          x2={toCenterPercent(segment.to.x, gridSize)}
          y2={toCenterPercent(segment.to.y, gridSize)}
          stroke={segment.color}
          strokeWidth={gridSize > 9 ? 1.8 : 2.6}
          strokeLinecap="round"
          data-testid={`trail-line-${index}`}
        />
      ))}
    </svg>
  );
}
