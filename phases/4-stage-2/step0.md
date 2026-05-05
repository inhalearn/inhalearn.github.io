# Step 0: level-config

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 4 섹션)
- `/docs/LEVELS.md` (스테이지 2의 학습 목표, 발견/비교 플로우)
- `/docs/ARCHITECTURE.md` (data/, types/ 구조와 level 데이터 흐름)
- `/CLAUDE.md` (블록 타입, availableBlocks 관리, store/localStorage 규칙)
- `src/types/level.ts`
- `src/types/block.ts`
- `src/data/levels.ts`
- `src/data/levels.test.ts`

기존 레벨 타입과 데이터 접근 함수를 꼼꼼히 읽고, Phase 3에서 만든 계약을 깨지 않는 방향으로 확장하라.

## 작업

스테이지 2 "반복의 발견"을 위한 타입 확장과 레벨 데이터를 구현한다.

### 1. `src/types/level.ts` 확장

기존 필드는 유지하고, Phase 4에서 필요한 선택 필드만 추가하라:

```typescript
interface LevelConfig {
  discoveryMode?: boolean;
  unlockRepeatAt?: number;
}
```

핵심 규칙:

- 기존 phase가 사용하는 필드 시그니처를 깨지 마라.
- 특수 플로우용 필드는 optional로 유지하라. 이유: 스테이지 0-1은 동일 타입으로 계속 읽혀야 한다.
- 새 블록 타입을 추가하지 마라. 반복 블록은 이미 존재하는 `'repeat'`만 사용하라.

### 2. `src/data/levels.ts`에 스테이지 2 추가

아래 요구사항을 만족하는 레벨 2를 추가하라:

```typescript
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
}
```

추가 규칙:

- `getLevelById()`와 `getNextLevelId()`의 export 이름과 동작은 유지하라.
- 스테이지 2의 초기 `availableBlocks`는 `'move-right'`만 포함하라. repeat 해금은 이후 step에서 UI 레벨로 처리한다.
- 숫자/좌표는 `/docs/IMPLEMENTATION_GUIDE.md`를 우선 기준으로 삼아라.

### 3. 테스트 보강

`src/data/levels.test.ts`를 업데이트해 최소한 다음을 검증하라:

- 레벨 2가 존재
- `discoveryMode`와 `unlockRepeatAt` 값이 문서 요구와 일치
- 레벨 2의 초기 `availableBlocks`에는 `'repeat'`가 포함되지 않음
- `getNextLevelId(1)`이 `2`를 반환

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 레벨 데이터는 여전히 정적 설정만 담고 있는가?
   - 스테이지 특수 플로우가 타입 확장만으로 표현되고, UI/store 로직이 섞이지 않았는가?
   - `availableBlocks`와 실제 블록 타입 집합이 서로 모순되지 않는가?
3. 결과에 따라 `phases/4-stage-2/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 2 레벨 타입 확장과 discovery 설정 데이터 구현 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `availableBlocks`에 `'repeat'`를 미리 넣지 마라. 이유: 발견/해금 타이밍이 Phase 4 핵심 경험이다.
- `LevelConfig`를 required 필드 위주로 재설계하지 마라. 이유: 기존 레벨과 컴포넌트 계약을 깨뜨린다.
- 이 step에서 컴포넌트/store 코드를 수정하지 마라. 이유: 데이터와 타입 레이어만 다루는 step이다.
- 기존 테스트를 깨뜨리지 마라.
