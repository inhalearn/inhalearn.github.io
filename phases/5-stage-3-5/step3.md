# Step 3: level-flow

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 5 완료 조건)
- `/docs/LEVELS.md` (스테이지 3-5 미션/힌트/완료 흐름)
- `/docs/ARCHITECTURE.md` (Level 화면 데이터 흐름)
- `/docs/UI_GUIDE.md` (미션 카드, 버튼, 모달, 터치 타겟 규칙)
- `/CLAUDE.md` (3개 store 분리, localStorage 직접 접근 금지, 인덕이 필수)
- `phases/5-stage-3-5/step0.md`
- `phases/5-stage-3-5/step1.md`
- `phases/5-stage-3-5/step2.md`
- `src/components/screens/Level.tsx`
- `src/components/blocks/BlockPicker.tsx`
- `src/components/blocks/CodeEditor.tsx`
- `src/data/levels.ts`
- `src/store/codeStore.ts`
- `src/store/levelStore.ts`
- 관련 테스트 파일

이전 step 산출물을 모두 읽고, 스테이지 3-5의 실제 플레이 플로우를 Level 화면에 통합하라.

## 작업

스테이지 3, 4는 goal 기반 플레이로, 스테이지 5는 자유 창작 기반 플레이로 동작하도록 화면 플로우를 확장한다.

### 1. 수정 대상

- `src/components/screens/Level.tsx`
- 필요 시 `src/App.tsx`
- 필요 시 Stage 5용 작은 UI 컴포넌트 1-2개 추가 가능

### 2. 인터페이스 수준 요구사항

- 스테이지 3/4는 새 레벨 데이터가 들어와도 기존 실행 버튼 플로우로 완료 가능해야 한다.
- 스테이지 5에서는 preset mission 선택 UI를 제공하라.
- preset 선택은 UI 힌트 역할만 하게 두고, 엔진 규칙이나 정답 강제를 만들지 마라.
- 스테이지 5에서는 색상 선택, pen-up/down 사용을 유도하는 보조 UI를 제공해도 되지만, 블록 시스템의 source-of-truth는 계속 code editor여야 한다.
- 자유 창작 완료는 store의 명시적 완료 action 또는 data-driven 완료 규칙으로 처리하라.
- 레벨 2의 discovery/comparison 플로우를 깨뜨리지 마라.

### 3. 테스트 추가/수정

최소 검증 항목:

- 레벨 3/4가 새 레벨 데이터로 정상 렌더링됨
- 레벨 4에서 벽이 있는 상태로 기존 실행/실패 피드백이 유지됨
- 레벨 5에서 preset mission 선택 UI가 보임
- 레벨 5에서 자유 창작 완료 액션이 동작함
- 레벨 2의 repeat 해금/비교 모달 회귀 없음

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 추가로 `npm run dev` 후 브라우저에서 아래를 수동 확인한다:
   - `/level/3`, `/level/4`, `/level/5`가 모두 진입 가능한지
   - 레벨 5에서 preset 선택 후 색상/펜 블록을 조합해 실행 가능한지
   - 레벨 5에서 완료 버튼 또는 완료 액션으로 다음 화면으로 이동 가능한지
3. 아키텍처 체크리스트를 확인한다:
   - Level 화면이 계속 `levelStore`와 `codeStore`를 통해서만 상태를 다루는가?
   - stage-specific UI가 엔진/validator 책임을 침범하지 않는가?
   - 44px 이상 터치 타겟과 라이트 모드 규칙을 유지하는가?
4. 결과에 따라 `phases/5-stage-3-5/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 3-5 플레이 플로우와 자유 창작 UI 통합 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- Level 화면 안에 validator/별점 계산 로직을 중복 구현하지 마라. 이유: store/engine과 분리되어야 한다.
- preset mission을 정답 강제 로직으로 만들지 마라. 이유: 레벨 5는 자유 창작이 핵심이다.
- 레벨 2 전용 discovery 플로우를 일반화하다가 기존 경험을 깨뜨리지 마라.
- 기존 테스트를 깨뜨리지 마라.
