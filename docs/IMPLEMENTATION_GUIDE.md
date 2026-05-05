# 하네스 구현 가이드

## 개요
이 문서는 인하런 프로젝트를 **단계별로 안전하게 구현**하기 위한 하네스 엔지니어링 가이드입니다.
각 Phase는 독립적으로 검증 가능하며, 이전 Phase가 완료되어야 다음 Phase로 진행할 수 있습니다.

## Phase 구조

```
Phase 0: 프로젝트 초기 설정
  ↓
Phase 1: 핵심 엔진 구현 (순수 로직)
  ↓
Phase 2: UI 기본 구조
  ↓
Phase 3: 스테이지 0-1 구현 (튜토리얼 + 계단)
  ↓
Phase 4: 스테이지 2 구현 (반복문 발견)
  ↓
Phase 5: 스테이지 3-5 구현 (사각형 + 미로 + 자유 창작)
  ↓
Phase 6: 최적화 및 배포
```

---

## Phase 0: 프로젝트 초기 설정

### 목표
개발 환경 구축 및 기본 설정 완료

### 구현 항목

#### 1. 프로젝트 초기화
```bash
npm create vite@latest inhalearn -- --template react-ts
cd inhalearn
npm install
```

#### 2. 의존성 설치
```bash
# 필수 의존성
npm install zustand framer-motion

# 개발 의존성
npm install -D \
  @types/react \
  @types/react-dom \
  tailwindcss \
  postcss \
  autoprefixer \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  prettier \
  husky \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @playwright/test
```

#### 3. Tailwind CSS 설정
```bash
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'inha-blue': '#0099CC',
        'inha-blue-light': '#33B5E5',
        'inha-blue-dark': '#007299',
      },
    },
  },
  plugins: [],
}
```

#### 4. TypeScript 설정
**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 5. ESLint 설정
**.eslintrc.json:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

#### 6. Prettier 설정
**.prettierrc:**
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

#### 7. Vitest 설정
**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

#### 8. package.json 스크립트
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "prepare": "husky install"
  }
}
```

### 검증 기준
- [ ] `npm run dev` 실행 시 로컬 서버 정상 동작
- [ ] `npm run build` 실행 시 dist/ 폴더 생성
- [ ] `npm run lint` 실행 시 에러 없음
- [ ] `npm run test:unit` 실행 시 테스트 통과 (초기에는 0개)
- [ ] TypeScript strict 모드 활성화 확인

### 완료 조건
```bash
npm run lint && npm run build
```
위 명령어가 에러 없이 통과하면 Phase 0 완료.

---

## Phase 1: 핵심 엔진 구현 (순수 로직)

### 목표
React와 독립적인 게임 엔진 로직 구현 및 테스트

### 원칙
- **CRITICAL**: engine/ 폴더 코드는 React를 import하지 않음
- **CRITICAL**: 모든 함수는 순수 함수 (같은 입력 → 같은 출력)
- **CRITICAL**: 100% 테스트 커버리지 필수

### 구현 항목

#### 1. 타입 정의 (types/)
**types/block.ts** (89줄):
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
  count: number;
  children: Block[];
}

export type Block = MoveBlock | RepeatBlock | /* ... */;
```

**types/position.ts** (23줄):
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
  right: { x: 1, y: 0 },
};
```

**types/level.ts** (45줄):
```typescript
export interface LevelConfig {
  id: number;
  title: string;
  mission: string;
  gridSize: number;
  startPosition: Position;
  goalPosition: Position;
  walls?: Position[];
  availableBlocks: BlockType[];
  maxBlocks?: number;
  hints: string[];
  optimalBlockCount: number;
}
```

**types/execution.ts** (32줄):
```typescript
export interface ExecutionResult {
  success: boolean;
  reason?: 'collision' | 'out-of-bounds' | 'goal-reached';
  errorBlockIndex?: number;  // Phase 1 개선
  finalPosition?: Position;
  trail: Position[];
}

export type ExecutionSpeed = 'normal' | 'fast' | 'skip';
```

#### 2. Turtle 엔진 (engine/turtle.ts)
**약 150줄 예상**

```typescript
import { Position, Direction, DIRECTION_VECTORS } from '@/types/position';

export interface TurtleConfig {
  gridSize: number;
  startPosition: Position;
  walls?: Position[];
}

export class Turtle {
  private position: Position;
  private trail: Position[] = [];
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
    return [...this.trail];
  }

  reset(): void {
    this.position = { ...this.config.startPosition };
    this.trail = [{ ...this.config.startPosition }];
  }
}
```

**테스트 (engine/turtle.test.ts)** - 약 100줄:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Turtle } from './turtle';

describe('Turtle', () => {
  let turtle: Turtle;

  beforeEach(() => {
    turtle = new Turtle({
      gridSize: 5,
      startPosition: { x: 0, y: 0 },
    });
  });

  it('should start at initial position', () => {
    expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
  });

  it('should move right correctly', () => {
    const success = turtle.move('right');
    expect(success).toBe(true);
    expect(turtle.getPosition()).toEqual({ x: 1, y: 0 });
  });

  it('should move up correctly', () => {
    const success = turtle.move('up');
    expect(success).toBe(false);  // y=0에서 위로 못 감
  });

  it('should detect out of bounds', () => {
    turtle = new Turtle({
      gridSize: 2,
      startPosition: { x: 1, y: 1 },
    });
    const success = turtle.move('right');
    expect(success).toBe(false);
  });

  it('should detect wall collision', () => {
    turtle = new Turtle({
      gridSize: 5,
      startPosition: { x: 0, y: 0 },
      walls: [{ x: 1, y: 0 }],
    });
    const success = turtle.move('right');
    expect(success).toBe(false);
  });

  it('should track trail', () => {
    turtle.move('right');
    turtle.move('down');
    const trail = turtle.getTrail();
    expect(trail).toHaveLength(3);  // start + 2 moves
    expect(trail[2]).toEqual({ x: 1, y: 1 });
  });

  it('should reset correctly', () => {
    turtle.move('right');
    turtle.reset();
    expect(turtle.getPosition()).toEqual({ x: 0, y: 0 });
    expect(turtle.getTrail()).toHaveLength(1);
  });
});
```

#### 3. BlockInterpreter (engine/interpreter.ts)
**약 200줄 예상**

```typescript
import { Block, BlockType } from '@/types/block';
import { ExecutionResult, ExecutionSpeed } from '@/types/execution';
import { Turtle } from './turtle';

export class BlockInterpreter {
  private turtle: Turtle;

  constructor(turtle: Turtle) {
    this.turtle = turtle;
  }

  async execute(
    blocks: Block[],
    speed: ExecutionSpeed = 'normal'
  ): Promise<ExecutionResult> {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      if (block.type === 'repeat') {
        // 재귀: 반복 블록 실행
        for (let j = 0; j < block.count; j++) {
          const result = await this.execute(block.children, speed);
          if (!result.success) {
            return {
              ...result,
              errorBlockIndex: i,  // 반복 블록이 에러
            };
          }
        }
      } else if (this.isMoveBlock(block.type)) {
        // 이동 블록
        const direction = this.getDirection(block.type);
        const success = this.turtle.move(direction);

        if (!success) {
          return {
            success: false,
            reason: 'collision',
            errorBlockIndex: i,  // Phase 1 개선
            trail: this.turtle.getTrail(),
          };
        }

        // 애니메이션 대기
        if (speed !== 'skip') {
          const duration = speed === 'fast' ? 100 : 300;
          await this.sleep(duration);
        }
      }
      // 다른 블록 타입들 (color, pen 등) 처리...
    }

    return {
      success: true,
      finalPosition: this.turtle.getPosition(),
      trail: this.turtle.getTrail(),
    };
  }

  private isMoveBlock(type: BlockType): boolean {
    return ['move-up', 'move-down', 'move-left', 'move-right'].includes(type);
  }

  private getDirection(type: BlockType): Direction {
    const map: Record<string, Direction> = {
      'move-up': 'up',
      'move-down': 'down',
      'move-left': 'left',
      'move-right': 'right',
    };
    return map[type];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

**테스트 (engine/interpreter.test.ts)** - 약 150줄:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { BlockInterpreter } from './interpreter';
import { Turtle } from './turtle';
import { Block } from '@/types/block';

describe('BlockInterpreter', () => {
  let interpreter: BlockInterpreter;
  let turtle: Turtle;

  beforeEach(() => {
    turtle = new Turtle({
      gridSize: 5,
      startPosition: { x: 0, y: 0 },
    });
    interpreter = new BlockInterpreter(turtle);
  });

  it('should execute simple move sequence', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-down' },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 1, y: 1 });
  });

  it('should handle repeat block', async () => {
    const blocks: Block[] = [
      {
        id: '1',
        type: 'repeat',
        count: 3,
        children: [{ id: '2', type: 'move-right' }],
      },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(true);
    expect(result.finalPosition).toEqual({ x: 3, y: 0 });
  });

  it('should handle nested repeat blocks', async () => {
    const blocks: Block[] = [
      {
        id: '1',
        type: 'repeat',
        count: 2,
        children: [
          {
            id: '2',
            type: 'repeat',
            count: 2,
            children: [{ id: '3', type: 'move-right' }],
          },
        ],
      },
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.finalPosition).toEqual({ x: 4, y: 0 });
  });

  it('should return error block index on collision', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-up' },  // 경계 밖
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(result.success).toBe(false);
    expect(result.errorBlockIndex).toBe(1);  // Phase 1 개선
  });

  it('should stop execution on first error', async () => {
    const blocks: Block[] = [
      { id: '1', type: 'move-right' },
      { id: '2', type: 'move-up' },  // 에러
      { id: '3', type: 'move-right' },  // 실행 안 됨
    ];
    const result = await interpreter.execute(blocks, 'skip');
    expect(turtle.getPosition()).toEqual({ x: 1, y: 0 });  // 블록 1만 실행
  });
});
```

#### 4. Validator (engine/validator.ts)
**약 80줄 예상**

```typescript
import { Position } from '@/types/position';

export interface ValidationResult {
  success: boolean;
  stars: number;  // 0-3
}

export class Validator {
  calculateStars(usedBlocks: number, optimalBlocks: number): number {
    if (usedBlocks === optimalBlocks) return 3;
    if (usedBlocks <= optimalBlocks * 1.5) return 2;
    return 1;
  }

  checkGoalReached(current: Position, goal: Position): boolean {
    return current.x === goal.x && current.y === goal.y;
  }

  validate(
    current: Position,
    goal: Position,
    usedBlocks: number,
    optimalBlocks: number
  ): ValidationResult {
    const success = this.checkGoalReached(current, goal);
    const stars = success ? this.calculateStars(usedBlocks, optimalBlocks) : 0;
    return { success, stars };
  }
}
```

**테스트 (engine/validator.test.ts)** - 약 60줄

### 검증 기준
- [ ] 모든 engine/ 파일에 테스트 작성
- [ ] `npm run test:unit` 실행 시 모든 테스트 통과
- [ ] `npm run test:coverage` 실행 시 engine/ 폴더 100% 커버리지
- [ ] engine/ 폴더에서 React import 없음 (검증: `grep -r "from 'react'" src/engine/`)

### 완료 조건
```bash
npm run test:coverage
# engine/ 폴더 100% 커버리지 확인

npm run lint
# 에러 없음
```

---

## Phase 2: UI 기본 구조

### 목표
레이아웃, 라우팅, 상태 관리 구조 구축

### 구현 항목

#### 1. 상태 관리 (store/)

**store/codeStore.ts** (약 60줄):
```typescript
import { create } from 'zustand';
import { Block } from '@/types/block';

interface CodeStore {
  blocks: Block[];
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  clearBlocks: () => void;
}

export const useCodeStore = create<CodeStore>((set) => ({
  blocks: [],
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  removeBlock: (id) =>
    set((state) => ({ blocks: state.blocks.filter((b) => b.id !== id) })),
  updateBlock: (id, updates) =>
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  clearBlocks: () => set({ blocks: [] }),
}));
```

**store/levelStore.ts** (약 100줄):
```typescript
import { create } from 'zustand';
import { ExecutionResult, ExecutionSpeed } from '@/types/execution';

interface LevelStore {
  currentLevel: number;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  executionSpeed: ExecutionSpeed;
  errorBlockIndex: number | null;
  hintsUsed: number;
  setCurrentLevel: (level: number) => void;
  setExecutionSpeed: (speed: ExecutionSpeed) => void;
  setErrorBlockIndex: (index: number | null) => void;
  execute: (blocks: Block[]) => Promise<void>;
  showHint: () => void;
  reset: () => void;
}

export const useLevelStore = create<LevelStore>((set, get) => ({
  currentLevel: 0,
  isExecuting: false,
  executionResult: null,
  executionSpeed: 'normal',
  errorBlockIndex: null,
  hintsUsed: 0,
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setExecutionSpeed: (speed) => set({ executionSpeed: speed }),
  setErrorBlockIndex: (index) => set({ errorBlockIndex: index }),
  execute: async (blocks) => {
    set({ isExecuting: true, errorBlockIndex: null });
    // 실행 로직 (BlockInterpreter 사용)
    // ...
    set({ isExecuting: false });
  },
  showHint: () => set((state) => ({ hintsUsed: state.hintsUsed + 1 })),
  reset: () =>
    set({
      isExecuting: false,
      executionResult: null,
      errorBlockIndex: null,
      hintsUsed: 0,
    }),
}));
```

**store/progressStore.ts** (약 120줄, localStorage 연동):
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LevelProgress } from '@/types/level';

interface ProgressStore {
  completedLevels: number[];
  levelProgress: Record<number, LevelProgress>;
  totalStars: number;
  completeLevel: (levelId: number, stars: number) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedLevels: [],
      levelProgress: {},
      totalStars: 0,
      completeLevel: (levelId, stars) => {
        set((state) => {
          const newProgress = {
            ...state.levelProgress,
            [levelId]: {
              levelId,
              completed: true,
              stars,
              hintsUsed: 0,
              attempts: (state.levelProgress[levelId]?.attempts || 0) + 1,
              completedAt: Date.now(),
            },
          };

          const newCompletedLevels = state.completedLevels.includes(levelId)
            ? state.completedLevels
            : [...state.completedLevels, levelId];

          const newTotalStars = Object.values(newProgress).reduce(
            (sum, progress) => sum + progress.stars,
            0
          );

          return {
            completedLevels: newCompletedLevels,
            levelProgress: newProgress,
            totalStars: newTotalStars,
          };
        });
      },
      reset: () =>
        set({
          completedLevels: [],
          levelProgress: {},
          totalStars: 0,
        }),
    }),
    {
      name: 'inhalearn-progress',
    }
  )
);
```

#### 2. 라우팅 구조

**App.tsx** (약 80줄):
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '@/components/screens/Landing';
import InteractiveDemo from '@/components/screens/InteractiveDemo';
import LevelSelect from '@/components/screens/LevelSelect';
import Level from '@/components/screens/Level';
import Completion from '@/components/screens/Completion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<InteractiveDemo />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/level/:id" element={<Level />} />
        <Route path="/completion" element={<Completion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 3. 공통 UI 컴포넌트

**components/ui/Button.tsx** (약 50줄):
```typescript
import { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`button button-${variant} button-${size}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

### 검증 기준
- [ ] `npm run dev` 실행 시 라우팅 동작
- [ ] Zustand store 테스트 작성 및 통과
- [ ] localStorage에 진행 상황 저장 확인

### 완료 조건
```bash
npm run test:unit
# store/ 테스트 통과

npm run dev
# 라우팅 동작 확인
```

---

## Phase 3: 스테이지 0-1 구현

### 목표
튜토리얼(스테이지 0) + 계단 오르기(스테이지 1) 구현

### 구현 항목

#### 1. 레벨 데이터 정의

**data/levels.ts** (약 200줄):
```typescript
import { LevelConfig } from '@/types/level';

export const levels: LevelConfig[] = [
  // 스테이지 0: 튜토리얼
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
  // 스테이지 1: 계단
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
```

#### 2. Canvas 컴포넌트

**components/canvas/Canvas.tsx** (약 150줄)
**components/canvas/Grid.tsx** (약 80줄)
**components/canvas/Induck.tsx** (약 100줄)

#### 3. 블록 에디터

**components/blocks/BlockPicker.tsx** (약 120줄)
**components/blocks/CodeEditor.tsx** (약 150줄)

#### 4. 레벨 화면

**components/screens/Level.tsx** (약 300줄)

### 검증 기준
- [ ] 스테이지 0 완료 가능
- [ ] 스테이지 1 완료 가능
- [ ] 블록 추가/삭제 동작
- [ ] 실행 시 애니메이션 동작
- [ ] 별점 계산 정확
- [ ] localStorage에 진행 상황 저장

### 완료 조건
- E2E 테스트 작성 및 통과
- 실제 플레이 테스트 (10명 이상)

---

## Phase 4: 스테이지 2 구현 (반복문 발견)

### 목표
**핵심 교육 경험** - 반복문의 필요성을 체감하고 발견하는 스테이지

### 구현 항목

#### 1. 발견 모달 (DiscoveryModal.tsx)
**약 150줄**

```typescript
export function DiscoveryModal({ onHint, onContinue }: Props) {
  return (
    <Modal>
      <div className="text-center">
        <div className="text-6xl animate-pulse">💡</div>
        <h2 className="text-2xl font-bold text-orange-500 mt-4">발견!</h2>
        <p className="mt-4 text-gray-700">
          같은 블록을 계속 쓰고 있네요...
          <br />
          더 쉬운 방법이 있을까요?
        </p>
        <div className="flex flex-col gap-3 mt-6">
          <Button variant="primary" onClick={onHint}>
            💡 힌트 보기
          </Button>
          <Button variant="secondary" onClick={onContinue}>
            ➡️ 계속하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

#### 2. 비교 모달 (ComparisonModal.tsx)
**약 200줄**

#### 3. 레벨 데이터
```typescript
{
  id: 2,
  title: '반복의 발견',
  mission: '인덕이를 5칸 오른쪽으로 이동시키세요',
  gridSize: 6,
  startPosition: { x: 0, y: 2 },
  goalPosition: { x: 5, y: 2 },
  availableBlocks: ['move-right'],  // 처음엔 이동만
  optimalBlockCount: 2,  // repeat 사용 시
  hints: [
    '같은 블록을 여러 번 쓰고 있나요?',
    '반복 블록을 사용하면 훨씬 간단해져요!',
  ],
  // 특수 설정
  discoveryMode: true,  // 5개 블록 추가 후 발견 모달
  unlockRepeatAt: 5,    // 5개 블록 추가 시 repeat 해금
}
```

### 검증 기준
- [ ] 블록 5개 추가 시 발견 모달 표시
- [ ] 힌트 선택 시 반복 블록 해금
- [ ] 비교 모달에서 코드 비교 표시
- [ ] 반복 블록 사용 가능
- [ ] 중첩 반복 동작 확인

### 완료 조건
- E2E 테스트: 발견 모달 플로우
- 사용자 테스트: "반복문 필요성 이해" 피드백 70% 이상

---

## Phase 5: 스테이지 3-5 구현

### 목표
사각형(3), 미로(4), 자유 창작(5) 구현

### 구현 항목
- 스테이지 3: 사각형 그리기 (반복 + 방향 조합)
- 스테이지 4: 미로 탈출 (복잡한 문제 해결)
- 스테이지 5: 자유 창작 (정답 없음, 창의성)

### 검증 기준
- [ ] 모든 스테이지 완료 가능
- [ ] 완주 축하 화면 표시
- [ ] 진행률 저장 및 불러오기

---

## Phase 6: 최적화 및 배포

### 목표
성능 최적화, 번들 크기 감소, GitHub Pages 배포

### 구현 항목

#### 1. 성능 최적화
```bash
# 번들 분석
npm run build
npx vite-bundle-visualizer

# 목표: < 500KB gzipped
```

#### 2. GitHub Actions 배포
**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 검증 기준
- [ ] Lighthouse 점수: Performance > 90
- [ ] First Contentful Paint < 1.5초
- [ ] Bundle size < 500KB
- [ ] 모든 테스트 통과
- [ ] https://inhalearn.github.io 접속 가능

---

## 제약 조건 (CRITICAL)

### 아키텍처 규칙 검증
```bash
# engine/ 폴더에서 React import 금지
grep -r "from 'react'" src/engine/
# 결과: (empty)

# store에서 localStorage 직접 접근 금지 (persist 사용)
grep -r "localStorage" src/components/
# 결과: (empty, store에서만 사용)

# 컴포넌트에서 engine 직접 호출 금지 (store 경유)
grep -r "new Turtle" src/components/
# 결과: (empty)
```

### TypeScript strict 모드 검증
```bash
# any 타입 사용 금지
npm run lint
# @typescript-eslint/no-explicit-any 에러 확인
```

### 테스트 커버리지 검증
```bash
npm run test:coverage
# engine/ : 100%
# store/  : 90%+
# hooks/  : 80%+
```

---

## 롤백 전략

각 Phase는 독립적으로 롤백 가능:

```bash
# Phase 4 실패 시 Phase 3으로 롤백
git revert <commit-hash>

# 또는 feature 브랜치 전략
git checkout phase-3
git branch -D phase-4
```

---

## 체크리스트

### Phase 0
- [ ] 프로젝트 초기화
- [ ] 의존성 설치
- [ ] TypeScript/ESLint 설정
- [ ] `npm run build` 성공

### Phase 1
- [ ] types/ 정의 완료
- [ ] Turtle 엔진 + 테스트
- [ ] BlockInterpreter + 테스트
- [ ] Validator + 테스트
- [ ] 100% 커버리지

### Phase 2
- [ ] Zustand store 구현
- [ ] 라우팅 구조
- [ ] 기본 UI 컴포넌트

### Phase 3
- [ ] 스테이지 0-1 데이터
- [ ] Canvas 컴포넌트
- [ ] 블록 에디터
- [ ] E2E 테스트

### Phase 4
- [ ] 발견 모달
- [ ] 비교 모달
- [ ] 스테이지 2 구현
- [ ] 사용자 테스트

### Phase 5
- [ ] 스테이지 3-5 구현
- [ ] 완주 화면

### Phase 6
- [ ] 성능 최적화
- [ ] GitHub Actions
- [ ] 배포 성공
