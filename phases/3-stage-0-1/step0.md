# Step 0: level-data

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 3 섹션)
- `/docs/LEVELS.md` (스테이지 0, 1 학습 목표와 카피)
- `/docs/ARCHITECTURE.md` (data/, types/, store/ 구조)
- `/CLAUDE.md` (CRITICAL 규칙, 블록/레벨 데이터 규칙)
- `src/types/level.ts`
- `src/types/block.ts`
- `src/store/progressStore.ts`
- `src/store/levelStore.ts`

이전 phase에서 만들어진 타입과 store를 꼼꼼히 읽고, 그 시그니처를 깨지 않는 방향으로 작업하라.

## 작업

스테이지 0-1의 정적 데이터와 데이터 접근 유틸리티를 구현한다.

### 1. `src/data/levels.ts` 생성

다음 시그니처를 제공하라:

```typescript
export const levels: LevelConfig[];
export function getLevelById(levelId: number): LevelConfig | undefined;
export function getNextLevelId(levelId: number): number | null;
```

### 2. 스테이지 0, 1 정의

- **좌표/격자/availableBlocks/optimalBlockCount는 `/docs/IMPLEMENTATION_GUIDE.md`를 기준으로 구현하라.**
- `/docs/LEVELS.md`와 수치가 충돌하더라도 Phase 3에서는 IMPLEMENTATION_GUIDE를 우선한다.
- `/docs/LEVELS.md`의 스토리/힌트 어조는 미션 문구와 힌트 텍스트를 다듬을 때만 참고한다.

필수 규칙:

- 스테이지 0: `availableBlocks`는 `['move-right']`만 허용.
- 스테이지 1: `availableBlocks`는 `['move-up', 'move-right']`만 허용.
- `goalPosition`, `walls`, `optimalBlockCount`는 validator/engine이 그대로 소비할 수 있는 순수 데이터 구조여야 한다.
- 새로운 블록 타입을 추가하지 마라. `src/types/block.ts`에 있는 타입만 사용하라.
- 이후 레벨 화면에서 직접 참조할 수 있도록 export 이름을 안정적으로 유지하라.

### 3. 테스트 추가

`src/data/levels.test.ts`를 생성하여 최소한 다음을 검증하라:

- 레벨 0, 1이 모두 존재
- 각 레벨의 `availableBlocks`가 문서 요구사항과 일치
- `getLevelById()`와 `getNextLevelId()` 동작
- 스테이지 1의 `walls`가 goal과 겹치지 않음

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `data/`에 정적 설정만 두고 로직을 넣지 않았는가?
   - `types/block.ts`에 없는 블록 타입을 쓰지 않았는가?
   - CLAUDE.md의 "블록 추가/수정 시 availableBlocks도 함께 관리" 규칙을 만족하는가?
3. 결과에 따라 `phases/3-stage-0-1/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 0-1 레벨 데이터와 조회 유틸리티 구현 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `LevelConfig` 타입을 임의 확장하지 마라. 이유: 이후 phase의 화면/엔진 계약이 이미 이 타입을 전제로 한다.
- 문서 충돌을 임의로 절충하지 마라. 이유: Phase 3의 실행 기준은 IMPLEMENTATION_GUIDE다.
- 컴포넌트나 store 코드를 이 step에서 수정하지 마라. 이유: 데이터 레이어만 다루는 step이다.
- 기존 테스트를 깨뜨리지 마라.
