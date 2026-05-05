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
  {
    id: 2,
    title: '반복의 발견',
    mission: '인덕이를 5칸 오른쪽으로 이동시키세요',
    gridSize: 6,
    startPosition: { x: 0, y: 2 },
    goalPosition: { x: 5, y: 2 },
    availableBlocks: ['move-right'],
    optimalBlockCount: 2,
    hints: [
      '같은 블록을 여러 번 쓰고 있나요?',
      '반복 블록을 사용하면 훨씬 간단해져요!',
    ],
    discoveryMode: true,
    unlockRepeatAt: 5,
    completionMode: 'goal',
    starRules: {
      type: 'optimal-blocks',
    },
  },
  {
    id: 3,
    title: '사각형 그리기',
    mission: '인덕이로 운동장 트랙을 한 바퀴 돌아 시작 위치로 돌아오세요',
    gridSize: 7,
    startPosition: { x: 1, y: 1 },
    goalPosition: { x: 1, y: 1 },
    availableBlocks: [
      'move-right',
      'move-down',
      'move-left',
      'move-up',
      'repeat',
    ],
    optimalBlockCount: 4,
    hints: [
      '같은 방향을 여러 번 움직이는 부분을 먼저 찾아보세요.',
      '반복 안에 반복을 넣으면 사각형을 더 짧게 표현할 수 있어요.',
    ],
    completionMode: 'goal',
    starRules: {
      type: 'repeat-usage',
      minRepeatBlocksForThreeStars: 2,
      minRepeatBlocksForTwoStars: 1,
    },
  },
  {
    id: 4,
    title: '미로 탈출',
    mission: '벽을 피해 인덕이를 목적지까지 가장 간단하게 이동시키세요',
    gridSize: 9,
    startPosition: { x: 0, y: 0 },
    goalPosition: { x: 6, y: 8 },
    walls: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 5, y: 2 },
      { x: 7, y: 2 },
      { x: 1, y: 3 },
      { x: 5, y: 3 },
      { x: 7, y: 3 },
      { x: 1, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 7, y: 4 },
      { x: 1, y: 5 },
      { x: 7, y: 5 },
      { x: 1, y: 6 },
      { x: 2, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 7, y: 6 },
      { x: 5, y: 7 },
      { x: 7, y: 7 },
    ],
    availableBlocks: [
      'move-right',
      'move-down',
      'move-left',
      'move-up',
      'repeat',
      'color',
      'pen-up',
      'pen-down',
    ],
    optimalBlockCount: 10,
    hints: [
      '한 방향으로 길게 갈 수 있는 구간을 먼저 찾아보세요.',
      '같은 방향 이동은 반복 블록으로 묶을 수 있어요.',
    ],
    completionMode: 'goal',
    starRules: {
      type: 'repeat-usage',
      minRepeatBlocksForThreeStars: 1,
      threeStarMaxBlocks: 10,
      twoStarMaxBlocks: 15,
    },
  },
  {
    id: 5,
    title: '나만의 그림',
    mission: '색과 펜 블록을 사용해 원하는 그림을 그리고 완성 버튼을 눌러보세요',
    gridSize: 11,
    startPosition: { x: 5, y: 5 },
    goalPosition: { x: 5, y: 5 },
    availableBlocks: [
      'move-right',
      'move-down',
      'move-left',
      'move-up',
      'repeat',
      'color',
      'pen-up',
      'pen-down',
    ],
    optimalBlockCount: 1,
    hints: [
      '펜을 내린 뒤 움직이면 선이 그려져요.',
      '색을 바꾸고 반복을 조합하면 더 다양한 그림을 만들 수 있어요.',
    ],
    completionMode: 'free-draw',
    starRules: {
      type: 'free-draw',
      autoStars: 3,
    },
    palette: ['#0099CC', '#33B5E5', '#9E9E9E', '#212121'],
    presetMissions: [
      {
        id: 'inha',
        title: 'INHA 글자',
        description: '직선과 반복을 조합해 캠퍼스 로고 느낌의 글자를 그려보세요.',
      },
      {
        id: 'heart',
        title: '하트',
        description: '펜 색을 바꾸며 하트나 응원 메시지를 표현해보세요.',
      },
      {
        id: 'free',
        title: '자유 창작',
        description: '원하는 모양을 자유롭게 그린 뒤 완성해도 됩니다.',
      },
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
