# Step 1: progress-store

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` (상태 관리 계층, progressStore 섹션)
- `/docs/ADR.md` (ADR-006: localStorage)
- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 2 > progressStore 섹션)
- `src/types/level.ts` (Phase 1에서 생성됨)
- `src/store/codeStore.ts` (Step 0에서 생성됨)

Phase 1에서 만들어진 타입 정의와 Step 0의 codeStore 패턴을 참고하여, 일관된 설계로 작업하라.

## 작업

사용자의 진행 상황(완료한 레벨, 별점, 통계)을 관리하고 localStorage에 영구 저장하는 Zustand store를 구현한다.

### 1. `src/store/progressStore.ts` 구현

다음 인터페이스를 구현하라:

```typescript
interface ProgressStore {
  completedLevels: number[];
  levelProgress: Record<number, LevelProgress>;
  totalStars: number;
  completeLevel: (levelId: number, stars: number) => void;
  reset: () => void;
}
```

**핵심 규칙:**
- **Zustand persist middleware 사용**: localStorage에 자동 저장/복원.
- **storage key**: `'inhalearn-progress'`
- **completeLevel**: 레벨 완료 시 호출. 다음을 수행:
  1. `levelProgress[levelId]` 업데이트 (별점, 시도 횟수, 완료 시각)
  2. `completedLevels` 배열에 levelId 추가 (중복 방지)
  3. `totalStars` 재계산 (모든 레벨의 stars 합산)
- **reset**: 모든 진행 상황 초기화.
- **localStorage 에러 처리**: persist onRehydrateStorage에서 에러 발생 시 console.warn + 기본값 사용.

**LevelProgress 타입** (`src/types/level.ts`에 이미 정의됨):
```typescript
export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number;        // 0-3
  hintsUsed: number;
  attempts: number;
  completedAt?: number; // timestamp
}
```

**파일 위치**: `src/store/progressStore.ts`

**타입 import**: `src/types/level.ts`에서 `LevelProgress` import

**Zustand persist 예시**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      // store 구현
    }),
    {
      name: 'inhalearn-progress',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('진행 상황 불러오기 실패:', error);
        }
      },
    }
  )
);
```

### 2. `src/store/progressStore.test.ts` 테스트 작성

다음 시나리오를 테스트하라:
- 레벨 완료 (처음 완료)
- 레벨 재완료 (별점 갱신, attempts 증가)
- totalStars 계산 정확성
- completedLevels 중복 방지
- reset 후 초기 상태 확인
- localStorage 저장 확인 (persist 동작)
- localStorage 불러오기 확인

**주의**: localStorage mock 필요. Vitest의 `beforeEach`에서 `localStorage.clear()` 호출.

**파일 위치**: `src/store/progressStore.test.ts`

## Acceptance Criteria

```bash
npm run test:unit
# progressStore 테스트 통과

npm run lint
# 에러 없음

npm run build
# 빌드 성공

# localStorage 동작 확인
npm run dev
# 브라우저 콘솔에서 수동 테스트:
# useProgressStore.getState().completeLevel(0, 3)
# localStorage.getItem('inhalearn-progress') 확인
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md의 상태 관리 계층(localStorage → progressStore → Components)을 따르는가?
   - ADR-006의 localStorage 사용 원칙(서버 없음, 10분 실습)을 따르는가?
   - localStorage 에러 처리가 올바른가? (console.warn + 계속 진행)
3. 결과에 따라 `phases/2-ui-structure/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "progressStore 구현 완료 (persist middleware, localStorage 연동, 테스트 N개 통과)"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **any 타입 사용 금지**. 이유: TypeScript strict mode 위반.
- **컴포넌트에서 localStorage 직접 접근 금지**. 이유: progressStore를 통해서만 접근. 단일 책임 원칙.
- **localStorage.setItem 직접 호출 금지**. 이유: Zustand persist가 자동 관리.
- **빈 catch 블록 금지**. 이유: 에러 발생 시 최소한 console.warn.
- **LevelProgress 타입 재정의 금지**. 이유: `src/types/level.ts`에 이미 정의됨.
- 기존 테스트를 깨뜨리지 마라.
