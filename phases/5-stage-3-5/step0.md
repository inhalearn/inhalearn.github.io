# Step 0: level-data

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 5 섹션)
- `/docs/LEVELS.md` (스테이지 3, 4, 5 요구사항과 별점 규칙)
- `/docs/ARCHITECTURE.md` (data/, types/, screens 구조)
- `/docs/UI_GUIDE.md` (미션 카드, 완주 흐름, 라이트 모드 규칙)
- `/CLAUDE.md` (블록 타입 제한, availableBlocks 관리, 서버/다크모드 금지)
- `src/types/level.ts`
- `src/types/block.ts`
- `src/data/levels.ts`
- `src/data/levels.test.ts`

Phase 4까지의 레벨 계약을 꼼꼼히 읽고, 기존 레벨 0-2를 깨지 않는 확장만 하라.

## 작업

스테이지 3-5를 위한 정적 레벨 데이터와 타입 확장을 구현한다.

### 1. `src/types/level.ts` 확장

기존 필드는 유지하고, 아래와 같은 **선택 필드 중심** 확장만 허용한다:

```typescript
interface LevelStarRules {
  type: 'optimal-blocks' | 'repeat-usage' | 'free-draw';
  threeStarMaxBlocks?: number;
  twoStarMaxBlocks?: number;
  minRepeatBlocksForThreeStars?: number;
  minRepeatBlocksForTwoStars?: number;
  autoStars?: number;
}

interface PresetMissionOption {
  id: string;
  title: string;
  description: string;
}

interface LevelConfig {
  goalPosition?: Position;
  completionMode?: 'goal' | 'free-draw';
  starRules?: LevelStarRules;
  palette?: string[];
  presetMissions?: PresetMissionOption[];
}
```

핵심 규칙:

- 기존 레벨 0-2가 그대로 타입 에러 없이 유지되어야 한다.
- `goalPosition`을 optional로 바꾸더라도, goal 기반 레벨의 데이터 의미를 흐리지 마라.
- 새 블록 타입을 추가하지 마라. `repeat`, `color`, `pen-up`, `pen-down`은 기존 타입만 사용하라.
- 별점 계산 정책은 하드코딩 문자열이 아니라 레벨 데이터가 표현할 수 있는 구조로 두어라.

### 2. `src/data/levels.ts`에 스테이지 3, 4, 5 추가

다음 의도를 만족하는 레벨 데이터를 추가하라:

- **레벨 3: 사각형 그리기**
  - 4방향 이동 + `repeat` 사용 가능
  - 반복 활용 학습용
  - 별점 규칙은 `/docs/LEVELS.md`의 "repeat 사용량 기반" 의도를 반영
- **레벨 4: 미로 탈출**
  - 벽(`walls`)이 있는 9x9 전후의 미로형 레벨
  - 최단 경로 성격이 드러나는 이동 경로와 goal 제공
  - 별점 규칙은 "repeat 사용 + 블록 수" 의도를 반영
- **레벨 5: 자유 창작**
  - 큰 격자, goal 없는 자유 창작 모드
  - `color`, `pen-up`, `pen-down`, `repeat`, 이동 4종 모두 제공
  - 팔레트 색상은 UI_GUIDE/CLAUDE.md에 맞는 밝은 라이트 모드 계열만 사용
  - preset mission 2-3개 이상 제공 (`INHA`, `하트`, `자유 창작` 같은 선택지)
  - auto completion용 별점 규칙을 데이터에 표현

추가 규칙:

- `getLevelById()`와 `getNextLevelId()`의 export 이름/동작은 유지하라.
- 구체 좌표와 벽 배치는 `/docs/IMPLEMENTATION_GUIDE.md`를 우선 참고하되, 문서에 수치가 부족하면 `/docs/LEVELS.md`의 ASCII 레이아웃 의도를 보존하는 최소 데이터로 결정하라.
- 레벨 5는 goal이 없어도 타입/조회 유틸리티가 자연스럽게 동작해야 한다.

### 3. 테스트 보강

`src/data/levels.test.ts`를 업데이트해 최소한 다음을 검증하라:

- 레벨 3, 4, 5가 모두 존재
- 레벨 3의 availableBlocks에 4방향 이동과 `repeat`가 포함됨
- 레벨 4의 `walls`와 `goalPosition`이 충돌하지 않음
- 레벨 5가 `completionMode: 'free-draw'`와 preset mission/palette를 가짐
- `getNextLevelId(4)`가 `5`를 반환하고, 마지막 레벨 다음은 `null`을 반환

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 정적 레벨 데이터에 UI 로직이나 실행 로직을 섞지 않았는가?
   - 기존 레벨 타입 계약을 optional 확장만으로 유지했는가?
   - `availableBlocks`와 실제 블록 타입 집합이 모순되지 않는가?
3. 결과에 따라 `phases/5-stage-3-5/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 3-5 레벨 타입 확장과 정적 데이터 구현 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 기존 레벨 0-2의 필수 필드를 임의로 삭제하거나 의미를 바꾸지 마라. 이유: 이전 phase 화면/스토어 계약이 이미 의존한다.
- 이 step에서 엔진, store, 컴포넌트 코드를 수정하지 마라. 이유: 데이터/타입 레이어만 다루는 step이다.
- 새 블록 타입이나 서버 의존성을 추가하지 마라. 이유: CLAUDE.md 금지사항 위반이다.
- 기존 테스트를 깨뜨리지 마라.
