# Step 1: engine-rules

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 1 엔진 원칙 + Phase 5 완료 조건)
- `/docs/LEVELS.md` (스테이지 3-5 별점/완료 규칙)
- `/docs/ARCHITECTURE.md` (engine/, store/ 책임 분리)
- `/CLAUDE.md` (engine 순수 함수, 3개 store 분리, localStorage 직접 접근 금지)
- `phases/5-stage-3-5/step0.md`
- `src/types/level.ts`
- `src/types/execution.ts`
- `src/types/block.ts`
- `src/engine/turtle.ts`
- `src/engine/interpreter.ts`
- `src/engine/validator.ts`
- `src/store/levelStore.ts`
- 관련 테스트 파일

Step 0에서 추가된 레벨 계약을 읽고, 이를 순수 엔진/검증 규칙으로 해석하라.

## 작업

스테이지 3-5에서 필요한 실행 메타데이터, 그리기 규칙, 별점 계산 규칙을 순수 로직 레이어에 추가한다.

### 1. 실행 결과와 터틀 상태 확장

필요하다면 아래 파일을 수정하라:

- `src/types/execution.ts`
- `src/engine/turtle.ts`
- `src/engine/interpreter.ts`

최소 요구사항:

- `color`, `pen-up`, `pen-down` 블록이 무시되지 않고 실행 상태에 반영되어야 한다.
- 이동 경로는 단순 `Position[]`만으로 부족하면 별도 drawing segment/trace 구조를 추가해도 된다.
- pen-up 상태의 이동은 "보드 위치 변화는 있지만 선은 남기지 않음"을 표현해야 한다.
- 현재 색상은 `color` 블록 적용 후 이후 선분에 반영되어야 한다.
- `engine/`은 계속 React import 없이 순수 로직만 유지하라.

### 2. `src/engine/validator.ts` 일반화

레벨 데이터의 `completionMode`/`starRules`를 읽어 스테이지별 판정을 처리하도록 확장하라.

핵심 규칙:

- goal 기반 레벨은 기존처럼 목표 좌표 도달 판정을 유지하라.
- 레벨 3의 별점은 "repeat 사용량" 의도를 반영하라.
- 레벨 4의 별점은 "repeat 사용 + 총 블록 수 제한" 의도를 반영하라.
- 레벨 5는 자유 창작이므로 자동 별점 부여 또는 별도 완료 규칙을 data-driven 하게 처리하라.
- 별점 계산 정책을 `Level.id` 분기 하드코딩만으로 구현하지 마라. 이유: 레벨 데이터가 source-of-truth여야 한다.

### 3. `src/store/levelStore.ts` 최소 확장

필요 최소 범위에서만 store를 수정하라:

- 일반 goal 레벨은 기존 `execute()` 플로우를 유지
- 자유 창작 레벨 완료를 위한 명시적 action이 필요하면 추가
- progress 저장은 계속 `progressStore` 경유만 사용
- 레벨 완료 후 `hintsUsed` 반영 계약은 유지

### 4. 테스트 보강

관련 테스트를 추가/수정하여 최소한 다음을 검증하라:

- `color`, `pen-up`, `pen-down`가 실행 메타데이터에 반영됨
- 레벨 3/4의 별점 규칙이 문서 의도대로 계산됨
- 자유 창작 레벨 완료 시 progress 저장이 가능함
- 기존 레벨 0-2 goal 판정 회귀가 없음

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `engine/`이 여전히 React/localStorage 의존성 없이 순수한가?
   - 별점/완료 규칙이 data-driven 구조로 수렴했는가?
   - `levelStore`가 progress 저장의 유일한 진입점 역할을 유지하는가?
3. 결과에 따라 `phases/5-stage-3-5/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 3-5용 그리기 메타데이터, validator 규칙, levelStore 완료 플로우 확장 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `Level.tsx`나 Canvas 쪽에서 별점 계산/펜 상태를 재구현하지 마라. 이유: 로직의 단일 출처는 engine/store여야 한다.
- 레벨별 분기를 `if (level.id === 3)` 같은 하드코딩으로만 누적하지 마라. 이유: 확장성과 테스트성이 떨어진다.
- `engine/`에 React import를 추가하지 마라. 이유: CLAUDE.md CRITICAL 위반이다.
- 기존 테스트를 깨뜨리지 마라.
