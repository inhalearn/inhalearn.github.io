# 아키텍처

## 디렉토리 구조
```
src/
├── components/
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── Header.tsx           # 헤더 (뒤로가기, 스테이지명, 별)
│   │   ├── LevelLayout.tsx      # 레벨 전체 레이아웃
│   │   ├── Footer.tsx           # 실행 버튼 영역
│   │   └── ProgressDisplay.tsx  # 진행 표시 (Phase 1 ⭐)
│   ├── canvas/          # 캔버스 관련
│   │   ├── Canvas.tsx           # 메인 캔버스
│   │   ├── Grid.tsx             # 격자 배경
│   │   ├── Induck.tsx           # 인덕이 캐릭터
│   │   ├── Star.tsx             # 목표 별
│   │   └── Trail.tsx            # 이동 경로 표시
│   ├── blocks/          # 블록 에디터
│   │   ├── BlockPicker.tsx      # 블록 선택 팔레트
│   │   ├── BlockButton.tsx      # 개별 블록 버튼
│   │   ├── CodeEditor.tsx       # 내 코드 영역
│   │   ├── CodeBlock.tsx        # 코드 블록 (개별)
│   │   ├── RepeatBlock.tsx      # 반복 블록 (중첩 가능)
│   │   └── ErrorFeedback.tsx    # 에러 블록 표시 (Phase 1 ⭐)
│   ├── ui/              # 공통 UI
│   │   ├── Button.tsx
│   │   ├── Mission.tsx          # 미션 설명 말풍선
│   │   ├── Stars.tsx            # 별점 표시
│   │   ├── ProgressBar.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── HintButton.tsx
│   │   ├── SpeedControl.tsx     # 속도 조절 (Phase 1 ⭐)
│   │   ├── DiscoveryModal.tsx   # 발견 모달 (스테이지 2, Phase 1 ⭐)
│   │   └── ComparisonModal.tsx  # 코드 비교 (스테이지 2, Phase 1 ⭐)
│   └── screens/         # 화면
│       ├── Landing.tsx          # 랜딩 페이지
│       ├── InteractiveDemo.tsx  # 20초 데모 (Phase 1 ⭐)
│       ├── LevelSelect.tsx      # 레벨 선택
│       ├── Level.tsx            # 레벨 플레이
│       ├── Completion.tsx       # 완주 축하
│       └── Result.tsx           # 레벨 완료
├── engine/              # 게임 엔진 (순수 로직)
│   ├── turtle.ts                # 터틀 그래픽 엔진
│   ├── interpreter.ts           # 블록 코드 해석기
│   ├── validator.ts             # 정답 체크
│   ├── animator.ts              # 이동 애니메이션 제어
│   └── collision.ts             # 충돌 감지 (벽, 경계)
├── data/                # 정적 데이터
│   ├── levels.ts                # 6개 핵심 레벨 정의 (Phase 1)
│   ├── blocks.ts                # 블록 타입 정의
│   └── messages.ts              # 메시지 (성공/실패/힌트)
├── store/               # 상태 관리 (Zustand)
│   ├── levelStore.ts            # 현재 레벨 상태
│   ├── codeStore.ts             # 코드 에디터 상태
│   └── progressStore.ts         # 진행 상황 (localStorage)
├── hooks/               # React Hooks
│   ├── useProgress.ts
│   ├── useLocalStorage.ts
│   ├── useAnimation.ts
│   └── useShareUrl.ts
├── types/               # TypeScript 타입
│   ├── block.ts
│   ├── level.ts
│   ├── position.ts
│   └── direction.ts
├── utils/               # 유틸리티
│   ├── constants.ts
│   ├── storage.ts
│   └── share.ts
└── styles/
    └── globals.css
```

## 패턴

### 1. 순수 함수형 엔진
`engine/` 폴더의 모든 로직은 React와 독립적인 순수 함수.
- 테스트 용이
- 재사용 가능
- 예측 가능

```typescript
// ✅ 좋은 예
class Turtle {
  move(direction: Direction): ExecutionResult {
    // 순수 함수: 같은 입력 → 같은 출력
    return { success: true, position: newPos };
  }
}

// ❌ 나쁜 예
class Turtle {
  move(direction: Direction) {
    // React 상태에 직접 접근 금지
    setPosition(newPos);
  }
}
```

### 2. Presenter/Container 분리
- **Container 컴포넌트**: 로직, 상태, 데이터
- **Presenter 컴포넌트**: UI만 담당

```tsx
// Container
function LevelContainer() {
  const { blocks, execute } = useCodeStore();
  return <LevelPresenter blocks={blocks} onExecute={execute} />;
}

// Presenter
function LevelPresenter({ blocks, onExecute }) {
  return <button onClick={onExecute}>실행</button>;
}
```

### 3. 상태 관리 계층
```
localStorage (영구)
    ↓
progressStore (Zustand)
    ↓
React Components
```

- 진행 상황만 localStorage에 저장
- 현재 레벨 상태는 Zustand
- UI 로컬 상태는 useState

## 데이터 흐름

### 블록 추가 → 실행 → 결과 (Phase 1 개선)
```
1. 사용자가 블록 버튼 클릭
   ↓
2. codeStore.addBlock(block)
   ↓
3. 사용자가 실행 속도 선택 (Phase 1 ⭐)
   [보통 0.3초] [빠르게 0.1초] [건너뛰기]
   ↓
4. levelStore.setSpeed(speed)
   ↓
5. 사용자가 "실행" 버튼 클릭
   ↓
6. BlockInterpreter.execute(blocks, speed)
   ↓
7. Turtle.move() 호출 (순차적)
   ↓
8. 충돌 발생 시 (Phase 1 ⭐)
   - 실행 중단
   - 에러 블록 인덱스 반환
   - ErrorFeedback 표시
   ↓
9. Animator가 각 이동을 애니메이션 (speed 적용)
   ↓
10. 성공/실패 판정
    ↓
11. Validator.check(finalPosition, goalPosition)
    ↓
12. 별점 계산 (3/2/1)
    ↓
13. progressStore.completeLevel(stars)
    ↓
14. localStorage에 저장
```

### 페이지 흐름 (Phase 1 개선)
```
Landing (랜딩 페이지)
  ↓
  ├─ [20초 체험하기] → InteractiveDemo (Phase 1 ⭐)
  │                        ↓
  │                    (완료 후 LevelSelect로)
  ↓
  └─ [바로 시작하기] → LevelSelect (진행 상황 표시)
                           ↓
                       Level (플레이)
                           ↓
                       Result (레벨 완료)
                           ↓
                       LevelSelect (다음 레벨 해금)
                           ↓
                       Completion (전체 완주)
```

## 상태 관리

### Zustand Store 3개

#### 1. codeStore (코드 에디터)
```typescript
{
  blocks: Block[];          // 현재 작성한 블록들
  addBlock(block): void;
  removeBlock(id): void;
  updateBlock(id, updates): void;
  clearBlocks(): void;
}
```

#### 2. levelStore (현재 레벨)
```typescript
{
  currentLevel: number;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  executionSpeed: 'normal' | 'fast' | 'skip';  // Phase 1 ⭐
  errorBlockIndex: number | null;               // Phase 1 ⭐
  hintsUsed: number;
  execute(blocks): Promise<void>;
  setSpeed(speed): void;                        // Phase 1 ⭐
  showHint(): void;
  reset(): void;
}
```

#### 3. progressStore (진행 상황, localStorage 연동)
```typescript
{
  completedLevels: number[];
  levelProgress: Record<number, LevelProgress>;
  totalStars: number;
  completeLevel(levelId, stars): void;
  reset(): void;
}
```

## 타입 정의

### types/block.ts
```typescript
export type BlockType =
  | 'move-up'
  | 'move-down'
  | 'move-left'
  | 'move-right'
  | 'repeat'
  | 'color'
  | 'pen-up'
  | 'pen-down';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface MoveBlock extends BaseBlock {
  type: 'move-up' | 'move-down' | 'move-left' | 'move-right';
}

export interface RepeatBlock extends BaseBlock {
  type: 'repeat';
  count: number;         // 반복 횟수 (1-10)
  children: Block[];     // 중첩된 블록들
}

export interface ColorBlock extends BaseBlock {
  type: 'color';
  color: string;         // hex 색상 코드
}

export interface PenBlock extends BaseBlock {
  type: 'pen-up' | 'pen-down';
}

export type Block = MoveBlock | RepeatBlock | ColorBlock | PenBlock;
```

### types/level.ts
```typescript
export interface Position {
  x: number;
  y: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  mission: string;
  gridSize: number;              // 격자 크기 (예: 5 → 5x5)
  startPosition: Position;
  goalPosition: Position;
  walls?: Position[];            // 벽 위치 (선택)
  availableBlocks: BlockType[];  // 사용 가능한 블록
  maxBlocks?: number;            // 최대 블록 수 (선택)
  hints: string[];               // 힌트 목록
  optimalBlockCount: number;     // 최적 블록 수 (별 3개 기준)
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number;                 // 0-3
  hintsUsed: number;
  attempts: number;
  completedAt?: number;          // timestamp
}
```

### types/position.ts
```typescript
export interface Position {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};
```

### types/execution.ts
```typescript
export interface ExecutionResult {
  success: boolean;
  reason?: 'collision' | 'out-of-bounds' | 'goal-reached';
  errorBlockIndex?: number;      // Phase 1 ⭐ 에러 발생 블록 위치
  finalPosition?: Position;
  trail: Position[];             // 이동 경로
}

export type ExecutionSpeed = 'normal' | 'fast' | 'skip';

export interface ExecutionState {
  isExecuting: boolean;
  speed: ExecutionSpeed;
  currentBlockIndex: number;
  errorBlockIndex: number | null;
}
```

## 핵심 로직

### Turtle 엔진
```typescript
class Turtle {
  private position: Position;
  private trail: Position[];

  move(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    const newPos = this.calculateNewPosition(direction);

    // 경계 체크
    if (this.isOutOfBounds(newPos)) return false;

    // 벽 체크
    if (this.hitWall(newPos)) return false;

    // 이동
    this.position = newPos;
    this.trail.push(newPos);

    return true;
  }
}
```

### BlockInterpreter (재귀, Phase 1 개선)
```typescript
async execute(
  blocks: Block[],
  speed: 'normal' | 'fast' | 'skip' = 'normal'  // Phase 1 ⭐
): Promise<ExecutionResult> {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.type === 'repeat') {
      // 재귀: 반복 블록 내부도 같은 방식으로 실행
      for (let j = 0; j < block.count; j++) {
        const result = await this.execute(block.children, speed);
        if (!result.success) {
          return {
            ...result,
            errorBlockIndex: i  // Phase 1 ⭐
          };
        }
      }
    } else {
      // 기본 이동
      const success = this.turtle.move(block.type);

      if (!success) {
        return {
          success: false,
          reason: 'collision',
          errorBlockIndex: i  // Phase 1 ⭐ 어디서 실패했는지
        };
      }

      // 애니메이션 대기 (속도에 따라, Phase 1 ⭐)
      if (speed !== 'skip') {
        const duration = speed === 'fast' ? 100 : 300;
        await this.animator.animate(block, duration);
      }
    }
  }

  return { success: true };
}
```

## 렌더링 최적화

### 1. React.memo
```tsx
// 블록 버튼은 자주 변하지 않음
export const BlockButton = React.memo(({ block, onClick }) => {
  return <button onClick={onClick}>{block.icon}</button>;
});
```

### 2. useMemo
```tsx
// 레벨 데이터는 변하지 않음
const levelConfig = useMemo(() => levels[currentLevel], [currentLevel]);
```

### 3. useCallback
```tsx
// 콜백 함수 메모이제이션
const handleAddBlock = useCallback((block: Block) => {
  addBlock(block);
}, [addBlock]);
```

## 애니메이션

### Framer Motion
```tsx
<motion.div
  animate={{ x: position.x * 50, y: position.y * 50 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  🦆 인덕이
</motion.div>
```

### 애니메이션 시퀀스 (Phase 1 개선)
```typescript
class Animator {
  async animate(block: Block, duration: number = 300) {  // Phase 1 ⭐
    // 1. 시작 위치
    // 2. 이동 애니메이션 (duration ms)
    // 3. 종료 위치
    await sleep(duration);
  }
}

// 사용 예시
animator.animate(block, 300);  // 보통 (0.3초)
animator.animate(block, 100);  // 빠르게 (0.1초)
// skip일 때는 animate 호출 안 함
```

## 에러 처리

### 1. 벽 충돌 (Phase 1 개선 ⭐)
```typescript
if (!success) {
  const errorIndex = result.errorBlockIndex;

  // 구체적 위치 표시
  showToast(`${errorIndex + 1}번째 블록에서 벽에 부딪혔어요!`);

  // 에러 블록 시각적 강조
  levelStore.setErrorBlockIndex(errorIndex);

  // ErrorFeedback 컴포넌트에서 표시:
  // ✅ 1. ➡️ 오른쪽
  // ✅ 2. ➡️ 오른쪽
  // ❌ 3. ➡️ 오른쪽 ← 여기서 멈췄어요!
  // 4. ⬆️ 위로

  resetTurtle();
  return;
}
```

### 2. localStorage 실패
```typescript
try {
  localStorage.setItem('progress', JSON.stringify(progress));
} catch (e) {
  console.warn('저장 실패 (용량 초과?)', e);
  // 계속 진행 (치명적 에러 아님)
}
```

### 3. 이미지 로드 실패
```tsx
<img
  src="/induck/default.png"
  onError={(e) => {
    e.currentTarget.src = '/fallback.png'; // 대체 이미지
  }}
/>
```

## 성능 목표

- First Contentful Paint: < 1.5초
- Time to Interactive: < 3초
- Bundle Size: < 500KB (gzipped)
- 60fps 애니메이션

## 기본 안전장치

### 1. 무한 루프 방지
```typescript
// BlockInterpreter에서 최대 실행 횟수 제한
const MAX_ITERATIONS = 1000;  // 최대 1000칸 이동

async execute(blocks: Block[]): Promise<ExecutionResult> {
  let iterations = 0;

  for (const block of blocks) {
    if (iterations++ > MAX_ITERATIONS) {
      return {
        success: false,
        reason: 'max-iterations-exceeded',
        trail: this.turtle.getTrail()
      };
    }
    // ... 실행 로직
  }
}
```

### 2. 블록 개수 제한
```typescript
// codeStore에서 최대 블록 수 제한
const MAX_BLOCKS = 50;

addBlock: (block) => set((state) => {
  if (state.blocks.length >= MAX_BLOCKS) {
    console.warn('최대 블록 수 초과');
    return state;  // 추가 안 함
  }
  return { blocks: [...state.blocks, block] };
})
```

### 3. 반복 횟수 제한
```typescript
// RepeatBlock count 검증
interface RepeatBlock {
  type: 'repeat';
  count: number;  // 1-10만 허용
  children: Block[];
}

// UI에서 입력 제한
<input
  type="number"
  min={1}
  max={10}
  value={count}
/>
```

### 4. 중첩 깊이 제한
```typescript
// 반복 블록 최대 3단계까지만
const MAX_DEPTH = 3;

function getDepth(block: Block, currentDepth = 0): number {
  if (block.type !== 'repeat') return currentDepth;

  if (currentDepth >= MAX_DEPTH) {
    throw new Error('반복 블록은 3단계까지만 중첩 가능합니다');
  }

  return Math.max(
    ...block.children.map(child => getDepth(child, currentDepth + 1))
  );
}
```

### 5. localStorage 에러 처리
```typescript
// progressStore persist 실패 대비
persist(
  (set, get) => ({ /* ... */ }),
  {
    name: 'inhalearn-progress',
    onRehydrateStorage: () => (state, error) => {
      if (error) {
        console.warn('진행 상황 불러오기 실패:', error);
        // 기본값으로 계속 진행
      }
    },
  }
)

// 저장 실패 시
try {
  localStorage.setItem('key', value);
} catch (e) {
  console.warn('저장 용량 초과 또는 프라이빗 모드');
  // 메모리에만 저장하고 계속 진행
}
```

### 6. 타입 가드
```typescript
// Block 타입 검증
function isMoveBlock(block: Block): block is MoveBlock {
  return ['move-up', 'move-down', 'move-left', 'move-right'].includes(block.type);
}

function isRepeatBlock(block: Block): block is RepeatBlock {
  return block.type === 'repeat';
}

// 사용 예시
if (isRepeatBlock(block)) {
  // TypeScript가 block.children 인식
  for (const child of block.children) {
    // ...
  }
}
```

### 7. 필수 값 검증
```typescript
// LevelConfig 검증 (data/levels.ts)
function validateLevel(level: LevelConfig): void {
  if (level.gridSize < 3 || level.gridSize > 10) {
    throw new Error(`gridSize는 3-10 사이여야 함: ${level.id}`);
  }

  if (level.startPosition.x < 0 || level.startPosition.x >= level.gridSize) {
    throw new Error(`시작 위치가 격자 밖: ${level.id}`);
  }

  if (level.optimalBlockCount < 1) {
    throw new Error(`optimalBlockCount는 1 이상: ${level.id}`);
  }
}

// 앱 시작 시 모든 레벨 검증
levels.forEach(validateLevel);
```

### 8. 애니메이션 중단 처리
```typescript
// 실행 중 사용자가 리셋 클릭 시
class BlockInterpreter {
  private aborted = false;

  abort(): void {
    this.aborted = true;
  }

  async execute(blocks: Block[]): Promise<ExecutionResult> {
    this.aborted = false;

    for (const block of blocks) {
      if (this.aborted) {
        return { success: false, reason: 'aborted' };
      }

      // ... 실행
      await this.sleep(duration);
    }
  }
}

// 리셋 버튼
function handleReset() {
  interpreter.abort();  // 실행 중단
  turtle.reset();       // 위치 초기화
}
```

## 금지 패턴

### ❌ 하지 마라

```typescript
// ❌ 1. 컴포넌트에서 engine 직접 생성
function Level() {
  const turtle = new Turtle({ /* ... */ });  // NO!
  // → store에서 관리
}

// ❌ 2. 무한 루프 가능성
function execute(blocks: Block[]) {
  while (true) {  // NO!
    // ...
  }
  // → MAX_ITERATIONS 제한 필수
}

// ❌ 3. any 타입 사용
function process(data: any) {  // NO!
  // ...
}
// → 명시적 타입 정의

// ❌ 4. React import in engine/
import { useState } from 'react';  // engine/ 폴더에서 NO!
// → 순수 로직만

// ❌ 5. 동기 sleep
function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}  // NO! 브라우저 멈춤
}
// → async/await + Promise 사용

// ❌ 6. localStorage 직접 접근 (컴포넌트)
function MyComponent() {
  localStorage.setItem('key', 'value');  // NO!
  // → progressStore 사용
}

// ❌ 7. 에러 무시
try {
  dangerousOperation();
} catch (e) {
  // 빈 catch  // NO!
}
// → 최소한 console.warn
```

### ✅ 올바른 패턴

```typescript
// ✅ 1. store에서 engine 관리
const useLevelStore = create((set) => ({
  turtle: null,
  interpreter: null,
  initEngine: (config) => {
    const turtle = new Turtle(config);
    const interpreter = new BlockInterpreter(turtle);
    set({ turtle, interpreter });
  }
}));

// ✅ 2. 제한된 루프
const MAX_ITERATIONS = 1000;
for (let i = 0; i < blocks.length && i < MAX_ITERATIONS; i++) {
  // ...
}

// ✅ 3. 명시적 타입
function process(data: Block[]): ExecutionResult {
  // ...
}

// ✅ 4. 비동기 sleep
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ✅ 5. 에러 처리
try {
  dangerousOperation();
} catch (e) {
  console.warn('작업 실패:', e);
  // 사용자에게 알림 또는 기본값 사용
}
```

## 보안

- XSS 방지: React가 기본 제공
- localStorage 검증: JSON.parse 시 try-catch
- 외부 스크립트 없음
- HTTPS: GitHub Pages 기본 제공

## 테스트 전략

### 1. 단위 테스트 (Vitest)

#### engine/ 폴더 (필수 100% 커버리지)
```typescript
// engine/turtle.test.ts
describe('Turtle', () => {
  it('should move right correctly', () => {
    const turtle = new Turtle({ x: 0, y: 0 });
    const result = turtle.move('right');
    expect(result.success).toBe(true);
    expect(turtle.position).toEqual({ x: 1, y: 0 });
  });

  it('should detect wall collision', () => {
    const turtle = new Turtle({ x: 0, y: 0 }, { walls: [{ x: 1, y: 0 }] });
    const result = turtle.move('right');
    expect(result.success).toBe(false);
    expect(result.reason).toBe('collision');
  });

  it('should detect out of bounds', () => {
    const turtle = new Turtle({ x: 0, y: 0 }, { gridSize: 5 });
    const result = turtle.move('left');
    expect(result.success).toBe(false);
    expect(result.reason).toBe('out-of-bounds');
  });
});

// engine/interpreter.test.ts
describe('BlockInterpreter', () => {
  it('should execute simple move sequence', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-up' }
    ];
    const result = await interpreter.execute(blocks);
    expect(result.success).toBe(true);
  });

  it('should handle repeat block', async () => {
    const blocks: Block[] = [
      {
        id: '1',
        type: 'repeat',
        count: 3,
        children: [{ id: '2', type: 'move-right' }]
      }
    ];
    const result = await interpreter.execute(blocks);
    expect(result.finalPosition).toEqual({ x: 3, y: 0 });
  });

  it('should return error block index on collision', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-right' },  // 벽에 부딪힘
      { id: '3', type: 'move-up' }
    ];
    const result = await interpreter.execute(blocks);
    expect(result.success).toBe(false);
    expect(result.errorBlockIndex).toBe(1);  // Phase 1 ⭐
  });
});

// engine/validator.test.ts
describe('Validator', () => {
  it('should validate goal reached', () => {
    const result = validator.check(
      { x: 3, y: 3 },  // current
      { x: 3, y: 3 }   // goal
    );
    expect(result.success).toBe(true);
  });

  it('should calculate stars based on block count', () => {
    const stars = validator.calculateStars(5, 5);  // used, optimal
    expect(stars).toBe(3);  // 최적 블록 수
  });

  it('should give 2 stars if slightly over optimal', () => {
    const stars = validator.calculateStars(7, 5);
    expect(stars).toBe(2);
  });
});
```

#### store/ 폴더 (Zustand)
```typescript
// store/codeStore.test.ts
describe('codeStore', () => {
  beforeEach(() => {
    codeStore.getState().clearBlocks();
  });

  it('should add block', () => {
    codeStore.getState().addBlock({ id: '1', type: 'move-right' });
    expect(codeStore.getState().blocks).toHaveLength(1);
  });

  it('should remove block', () => {
    const { addBlock, removeBlock } = codeStore.getState();
    addBlock({ id: '1', type: 'move-right' });
    removeBlock('1');
    expect(codeStore.getState().blocks).toHaveLength(0);
  });

  it('should clear all blocks', () => {
    const { addBlock, clearBlocks } = codeStore.getState();
    addBlock({ id: '1', type: 'move-right' });
    addBlock({ id: '2', type: 'move-up' });
    clearBlocks();
    expect(codeStore.getState().blocks).toHaveLength(0);
  });
});

// store/progressStore.test.ts
describe('progressStore', () => {
  it('should persist to localStorage', () => {
    progressStore.getState().completeLevel(0, 3);
    const saved = JSON.parse(localStorage.getItem('inhalearn-progress')!);
    expect(saved.completedLevels).toContain(0);
  });

  it('should calculate total stars correctly', () => {
    const { completeLevel } = progressStore.getState();
    completeLevel(0, 3);
    completeLevel(1, 2);
    expect(progressStore.getState().totalStars).toBe(5);
  });
});
```

### 2. 통합 테스트 (Playwright)

```typescript
// e2e/level0.spec.ts
test('튜토리얼 레벨 완료', async ({ page }) => {
  await page.goto('/');
  await page.click('text=바로 시작하기');

  // 스테이지 0 선택
  await page.click('[data-level="0"]');

  // 블록 추가
  await page.click('[data-block="move-right"]');
  await page.click('[data-block="move-up"]');

  // 실행
  await page.click('text=실행');

  // 성공 확인
  await expect(page.locator('text=완벽해요!')).toBeVisible();
  await expect(page.locator('[data-stars="3"]')).toBeVisible();
});

// e2e/stage2-discovery.spec.ts
test('스테이지 2 발견 모달', async ({ page }) => {
  // ... 스테이지 2 진입

  // 블록 5개 수동 추가
  for (let i = 0; i < 5; i++) {
    await page.click('[data-block="move-right"]');
  }

  // 실행
  await page.click('text=실행');

  // 발견 모달 확인
  await expect(page.locator('text=💡 발견!')).toBeVisible();
  await expect(page.locator('text=더 쉬운 방법이 있을까요?')).toBeVisible();

  // 힌트 보기
  await page.click('text=힌트 보기');

  // 반복 블록 소개 확인
  await expect(page.locator('[data-block="repeat"]')).toBeVisible();
});

// e2e/error-feedback.spec.ts
test('에러 피드백 표시', async ({ page }) => {
  // ... 레벨 진입

  // 벽에 부딪히는 코드 작성
  await page.click('[data-block="move-right"]');
  await page.click('[data-block="move-right"]');  // 벽
  await page.click('[data-block="move-up"]');

  // 실행
  await page.click('text=실행');

  // 에러 메시지 확인 (Phase 1 ⭐)
  await expect(page.locator('text=2번째 블록에서 벽에 부딪혔어요!')).toBeVisible();

  // 에러 블록 시각적 강조 확인
  const errorBlock = page.locator('[data-block-index="1"]');
  await expect(errorBlock).toHaveClass(/error/);
});
```

### 3. 성능 테스트

```typescript
// performance/bundle-size.test.ts
test('번들 크기 체크', async () => {
  const bundleSize = await getBundleSize('dist');
  expect(bundleSize).toBeLessThan(500 * 1024);  // 500KB gzipped
});

// performance/animation.test.ts
test('애니메이션 60fps 유지', async ({ page }) => {
  await page.goto('/level/3');

  // 복잡한 코드 실행
  const blocks = Array(20).fill({ type: 'move-right' });
  await executeBlocks(blocks);

  // FPS 측정
  const fps = await page.evaluate(() => {
    return performance.getEntriesByType('measure')[0].duration;
  });

  expect(fps).toBeGreaterThan(55);  // 최소 55fps
});
```

### 4. 커버리지 목표

| 영역 | 목표 | 우선순위 |
|------|------|----------|
| engine/ | 100% | CRITICAL |
| store/ | 90% | HIGH |
| hooks/ | 80% | MEDIUM |
| components/ | 70% | MEDIUM |
| utils/ | 90% | HIGH |

### 5. CI/CD 통합

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

## 코드 품질

### ESLint 규칙
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier 설정
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

### Husky Pre-commit Hook
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test:unit
npm run build
```

---

## Phase 2 아키텍처 확장 (추후 구현)

### Firebase 교사 대시보드

#### 추가 폴더 구조
```
src/
├── firebase/
│   ├── config.ts        # Firebase 설정
│   ├── realtime.ts      # Realtime Database 헬퍼
│   └── hooks.ts         # useFirebase 등
├── components/
│   └── teacher/         # 교사 모드 컴포넌트
│       ├── TeacherDashboard.tsx
│       ├── StudentList.tsx
│       └── ProgressChart.tsx
```

#### 데이터 구조 (Firebase Realtime Database)
```typescript
// /rooms/{roomCode}/students/{studentId}
{
  progress: number;        // 현재 스테이지 (0-5)
  stars: number;           // 획득 별 개수
  timestamp: number;       // 마지막 업데이트 시간
}
```

#### 실시간 동기화
```typescript
// 학생 측 (자동 업데이트)
const roomCode = searchParams.get('room');
if (roomCode) {
  firebase.database()
    .ref(`rooms/${roomCode}/students/${anonymousId}`)
    .set({
      progress: currentLevel,
      stars: totalStars,
      timestamp: Date.now()
    });
}

// 교사 측 (실시간 구독)
firebase.database()
  .ref(`rooms/${roomCode}/students`)
  .on('value', (snapshot) => {
    const students = snapshot.val();
    updateDashboard(students);
  });
```

### PWA 오프라인 지원

#### Service Worker
```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('inhalearn-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/main.js',
        '/induck/default.png'
      ]);
    })
  );
});
```

#### Manifest
```json
// public/manifest.json
{
  "name": "인하런",
  "short_name": "인하런",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0099CC",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 뱃지 시스템

#### 추가 타입
```typescript
// types/badge.ts
export type BadgeType =
  | 'first-discovery'    // 첫 발견
  | 'perfectionist'      // 완벽주의자
  | 'speedrun'           // 스피드런
  | 'artist';            // 아티스트

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}
```

#### 뱃지 획득 로직
```typescript
// hooks/useBadges.ts
export function useBadges() {
  const checkBadges = (progress: UserProgress) => {
    const badges: Badge[] = [];

    // 첫 발견: 반복 블록 첫 사용
    if (progress.levelProgress[2]?.completed) {
      badges.push({
        id: 'first-discovery',
        name: '첫 발견',
        description: '반복 블록을 처음 사용했어요!',
        icon: '🎓',
        unlocked: true,
        unlockedAt: Date.now()
      });
    }

    // ... 다른 뱃지들

    return badges;
  };

  return { checkBadges };
}
```
