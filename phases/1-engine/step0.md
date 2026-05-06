# Step 0: core-types

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`
- `/docs/IMPLEMENTATION_GUIDE.md` — Phase 1 > 구현 항목 > 1. 타입 정의(types/) 섹션 집중 참조
- `/CLAUDE.md` — 블록 시스템, 핵심 개념 섹션

## 작업

`src/types/` 폴더를 새로 만들고 아래 4개 파일을 구현하라.
파일 간 의존 관계: `position.ts` → `block.ts` → `level.ts`, `execution.ts`

### src/types/position.ts

```typescript
export interface Position { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right';
export const DIRECTION_VECTORS: Record<Direction, Position>
```

- 방향별 이동 벡터를 정의한다. y축은 아래가 양수(그리드 좌표계).
- `up` → y: -1, `down` → y: +1, `left` → x: -1, `right` → x: +1

### src/types/block.ts

```typescript
export type BlockType =
  | 'move-up' | 'move-down' | 'move-left' | 'move-right'
  | 'repeat'
  | 'color' | 'pen-up' | 'pen-down';

export interface BaseBlock { id: string; type: BlockType }
export interface MoveBlock extends BaseBlock { type: 'move-up' | 'move-down' | 'move-left' | 'move-right' }
export interface RepeatBlock extends BaseBlock { type: 'repeat'; count: number; children: Block[] }
export interface ColorBlock extends BaseBlock { type: 'color'; color: string }
export interface PenBlock extends BaseBlock { type: 'pen-up' | 'pen-down' }

export type Block = MoveBlock | RepeatBlock | ColorBlock | PenBlock;
```

- CLAUDE.md에 정의된 블록 타입만 사용. 임의 추가 금지.
- `Block`은 판별 유니온(discriminated union)으로 구성한다.
- `RepeatBlock.count` 범위: 1~10 (`MAX_REPEAT_COUNT`), `children`은 빈 배열 허용.

### src/types/level.ts

```typescript
import { Position } from './position';
import { BlockType } from './block';

export interface LevelConfig {
  id: number;
  title: string;
  mission: string;
  gridSize: number;          // MIN_GRID_SIZE(3) ~ MAX_GRID_SIZE(10)
  startPosition: Position;
  goalPosition: Position;
  walls?: Position[];
  availableBlocks: BlockType[];
  maxBlocks?: number;        // 생략 시 MAX_BLOCKS(50) 적용
  hints: string[];
  optimalBlockCount: number;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number;             // 0~3
  hintsUsed: number;
  attempts: number;
  completedAt?: number;      // Date.now() timestamp
}
```

### src/types/execution.ts

```typescript
import { Position } from './position';

export interface ExecutionResult {
  success: boolean;
  reason?: 'collision' | 'out-of-bounds' | 'goal-reached';
  errorBlockIndex?: number;  // 에러 발생 블록의 인덱스 (Phase 1 개선)
  finalPosition?: Position;
  trail: Position[];
}

export type ExecutionSpeed = 'normal' | 'fast' | 'skip';
```

### src/types/index.ts (barrel export)

위 4개 파일의 모든 export를 재내보내는 barrel 파일을 작성한다.

## Acceptance Criteria

```bash
npm run build   # 컴파일 에러 없음
npm run lint    # 에러 없음
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `src/types/` 폴더만 생성했는가? (`src/engine/` 등 다른 폴더 미리 생성 금지)
   - `any` 타입 사용이 없는가?
   - React import가 없는가?
3. 결과에 따라 `phases/1-engine/index.json`의 step 0을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`

## 금지사항

- `any` 타입을 사용하지 마라. 이유: TypeScript strict 모드, ESLint no-explicit-any 규칙.
- CLAUDE.md에 없는 블록 타입을 추가하지 마라. 이유: 나머지 Phase가 이 타입에 의존하며, 임의 추가는 게임 설계를 훼손한다.
- `src/engine/` 등 이 step 범위 밖의 폴더를 생성하지 마라. 이유: 각 step은 독립적으로 검증되어야 한다.
- 기존 `src/App.tsx`, `src/main.tsx`, `src/test/setup.ts`를 수정하지 마라.
