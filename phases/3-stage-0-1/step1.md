# Step 1: canvas-core

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 3 > Canvas 컴포넌트)
- `/docs/ARCHITECTURE.md` (components/canvas 구조, 렌더링 전략)
- `/docs/UI_GUIDE.md` (캔버스, 격자, 캐릭터 규칙)
- `/CLAUDE.md` (렌더링 전략, 애니메이션 제한)
- `src/data/levels.ts` (Step 0에서 생성됨)
- `src/types/position.ts`
- `src/types/execution.ts`
- `src/utils/constants.ts`

Step 0에서 만든 레벨 데이터를 읽고, 그 좌표계를 그대로 사용하는 canvas 레이어를 구현하라.

## 작업

캔버스 영역의 시각적 핵심인 격자, 목표 지점, 인덕이 표시 컴포넌트를 구현한다.

### 1. 아래 파일들을 생성하라

- `src/components/canvas/Grid.tsx`
- `src/components/canvas/Induck.tsx`
- `src/components/canvas/Canvas.tsx`

### 2. 인터페이스 수준 요구사항

`Canvas.tsx`는 최소한 아래 props를 받아야 한다:

```typescript
interface CanvasProps {
  level: LevelConfig;
  currentPosition: Position;
  trail?: Position[];
  isExecuting?: boolean;
}
```

핵심 규칙:

- 정적 배경/격자는 CSS Grid 또는 단순 div 조합으로 구현하라. Phase 3에서는 Canvas API를 강제하지 않는다.
- `Induck`는 현재 좌표만 시각화하고, 게임 상태를 직접 저장하지 마라.
- `trail`이 주어지면 이동 경로를 간단한 점/선/셀 하이라이트로 표시하되, 구현은 가볍게 유지하라.
- 벽(`level.walls`)과 목표 지점(`level.goalPosition`)을 명확히 구분해 렌더링하라.
- 애니메이션은 Framer Motion 또는 CSS transition으로 0.3초 이내만 사용하라.
- 레벨 좌표계와 화면 좌표계의 변환 로직은 컴포넌트 내부의 순수 계산으로 처리하라.

### 3. 테스트 추가

`src/components/canvas/Canvas.test.tsx`를 작성하여 최소한 다음을 검증하라:

- level 정보에 따라 격자 셀 수가 렌더링됨
- goal과 wall 마커가 렌더링됨
- 현재 위치에 인덕이 표시가 이동함

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `components/canvas/`가 시각화만 담당하고 엔진 로직을 복제하지 않았는가?
   - 인덕이 위치 계산이 `Position` 기반으로 일관적인가?
   - UI_GUIDE의 밝은 라이트 모드, 둥근 모서리, 44px 이상 터치 영역 규칙을 위반하지 않았는가?
3. 결과에 따라 `phases/3-stage-0-1/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "격자/벽/목표/인덕이 시각화용 canvas 컴포넌트 구현 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `engine/` 로직을 복사해 좌표 이동을 재구현하지 마라. 이유: 실행 규칙의 단일 출처는 engine이어야 한다.
- 컴포넌트 내부에서 localStorage에 접근하지 마라. 이유: 진행 상태 저장은 store가 담당한다.
- backdrop blur/glassmorphism을 사용하지 마라. 이유: UI_GUIDE와 CLAUDE.md 금지사항 위반이다.
- 기존 테스트를 깨뜨리지 마라.
