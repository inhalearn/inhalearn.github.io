import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { LevelConfig } from '@/types/level';
import { Position } from '@/types/position';

interface InduckProps {
  level: LevelConfig;
  position: Position;
}

export function Induck({ level, position }: InduckProps) {
  const cellPercent = 100 / level.gridSize;

  return (
    <motion.div
      animate={{
        left: `calc(${position.x * cellPercent}% + 0.5rem)`,
        top: `calc(${position.y * cellPercent}% + 0.5rem)`,
      }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="pointer-events-none absolute z-10 flex aspect-square w-[calc(100%/var(--grid-size)_-_0.5rem)] items-center justify-center rounded-2xl bg-[#0099CC] text-2xl shadow-[0_8px_20px_rgba(0,153,204,0.28)]"
      style={
        {
          '--grid-size': String(level.gridSize),
        } as CSSProperties
      }
      data-testid="induck"
      aria-label="induck"
    >
      🦆
    </motion.div>
  );
}
