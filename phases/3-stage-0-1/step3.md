# Step 3: level-screen

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 3 > 레벨 화면)
- `/docs/ARCHITECTURE.md` (페이지 흐름, Level 화면 역할)
- `/docs/UI_GUIDE.md` (헤더, 미션, 실행 버튼, 진행 표시 규칙)
- `/CLAUDE.md` (3개 store 분리, 렌더링 전략, localStorage 접근 금지)
- `src/data/levels.ts` (Step 0에서 생성됨)
- `src/components/canvas/Canvas.tsx` (Step 1에서 생성됨)
- `src/components/blocks/BlockPicker.tsx` (Step 2에서 생성됨)
- `src/components/blocks/CodeEditor.tsx` (Step 2에서 생성됨)
- `src/store/codeStore.ts`
- `src/store/levelStore.ts`
- `src/store/progressStore.ts`
- `src/App.tsx`

이전 step 산출물을 모두 읽고, Level 화면을 하나의 통합 플레이 플로우로 묶어라.

## 작업

스테이지 0-1을 실제로 플레이할 수 있는 최소 레벨 화면과 라우트 연동을 구현한다.

### 1. 아래 파일들을 생성 또는 수정하라

- `src/components/screens/Level.tsx`
- 필요 시 `src/components/layout/` 아래에 작은 프레젠테이션 컴포넌트 추가
- `src/App.tsx` (기존 placeholder를 실제 Level 화면으로 교체)

### 2. 인터페이스 수준 요구사항

`Level.tsx`는 최소한 다음 흐름을 제공해야 한다:

1. URL의 `:id`로 현재 레벨 조회
2. 레벨 없으면 안전한 fallback UI 또는 `/levels` 이동
3. 현재 레벨의 `availableBlocks`로 `BlockPicker` 구성
4. `codeStore`의 블록을 편집
5. 실행 버튼 클릭 시 `levelStore.execute(blocks, level)` 호출
6. 실행 결과로 canvas 위치/경로/에러 상태 반영
7. 성공 시 별점과 다음 액션(다음 레벨 / 레벨 선택) 제공

핵심 규칙:

- 컴포넌트는 localStorage에 직접 접근하지 마라. 진행도 저장은 `progressStore` 간접 효과만 사용하라.
- 실행 중에는 중복 실행을 막아라.
- 에러 발생 시 `errorBlockIndex`를 `CodeEditor`에 전달해 문제 블록을 강조하라.
- 스테이지 0, 1이 모두 실제로 완료 가능해야 한다.
- `/level/:id` 외 라우트 구조는 Phase 2에서 만든 뼈대를 유지하되, 불필요한 placeholder는 줄여라.

### 3. 테스트 추가

- `src/components/screens/Level.test.tsx`
- 필요 시 `src/App.test.tsx` 업데이트

최소 검증 항목:

- 레벨 0 로딩 시 move-right만 노출
- 레벨 1 로딩 시 move-up, move-right 노출
- 실행 성공 시 완료 UI 또는 성공 메시지 표시
- 잘못된 레벨 ID 처리

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 추가로 `npm run dev` 후 브라우저에서 아래를 수동 확인한다:
   - `/level/0`에서 튜토리얼 성공 가능
   - `/level/1`에서 계단 레벨 성공 가능
   - 실패 시 문제 블록 강조
3. 아키텍처 체크리스트를 확인한다:
   - Level 화면이 engine을 직접 생성하지 않고 `levelStore`를 통해 실행하는가?
   - 3개 store의 책임이 섞이지 않았는가?
   - UI_GUIDE의 헤더/버튼/밝은 톤 규칙을 유지하는가?
4. 결과에 따라 `phases/3-stage-0-1/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 0-1 플레이 가능한 Level 화면과 라우트 연동 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `App.tsx`에 모든 레벨 로직을 몰아넣지 마라. 이유: 화면 로직은 `components/screens/Level.tsx`로 분리해야 한다.
- `levelStore.execute`를 우회해 컴포넌트에서 `BlockInterpreter`를 직접 호출하지 마라. 이유: 관심사 분리 위반이다.
- 성공/실패 판단을 컴포넌트에서 재구현하지 마라. 이유: validator와 store 결과를 신뢰해야 한다.
- 기존 테스트를 깨뜨리지 마라.
