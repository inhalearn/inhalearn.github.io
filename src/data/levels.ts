import { LevelConfig } from '@/types/level';

export const levels: LevelConfig[] = [
  {
    id: 0,
    title: '튜토리얼',
    mission: '인덕이를 오른쪽으로 한 칸 이동시켜보세요',
    gridSize: 3,
    startPosition: { x: 0, y: 1 },
    goalPosition: { x: 1, y: 1 },
    availableBlocks: ['move-right'],
    optimalBlockCount: 1,
    hints: ['오른쪽 화살표 블록을 추가해보세요'],
  },
  {
    id: 1,
    title: '계단 오르기',
    mission: '인덕이를 계단을 따라 오른쪽 위로 이동시키세요',
    gridSize: 5,
    startPosition: { x: 0, y: 4 },
    goalPosition: { x: 3, y: 1 },
    walls: [
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    availableBlocks: ['move-up', 'move-right'],
    optimalBlockCount: 6,
    hints: [
      '오른쪽과 위쪽을 번갈아 사용해보세요',
      '총 6개의 블록이 필요해요',
    ],
  },
];

export function getLevelById(levelId: number): LevelConfig | undefined {
  return levels.find((level) => level.id === levelId);
}

export function getNextLevelId(levelId: number): number | null {
  const currentIndex = levels.findIndex((level) => level.id === levelId);

  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }

  return levels[currentIndex + 1].id;
}
