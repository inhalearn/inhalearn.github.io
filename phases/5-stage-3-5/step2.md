# Step 2: canvas-drawing

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` (components/canvas 구조, 렌더링 전략)
- `/docs/UI_GUIDE.md` (캔버스, 색상, 라이트 모드 규칙)
- `/CLAUDE.md` (Canvas/CSS/Framer Motion 렌더링 전략, 과도한 애니메이션 금지)
- `phases/5-stage-3-5/step1.md`
- `src/types/execution.ts`
- `src/data/levels.ts`
- `src/components/canvas/Canvas.tsx`
- `src/components/canvas/Grid.tsx`
- `src/components/canvas/Induck.tsx`
- 관련 테스트 파일

Step 1에서 만들어진 실행 메타데이터를 읽고, 보드 시각화 레이어에만 필요한 최소 표현을 구현하라.

## 작업

자유 창작과 사각형/미로 스테이지에서 실행 결과가 눈에 보이도록 캔버스 시각화를 확장한다.

### 1. 수정 대상

- `src/components/canvas/Canvas.tsx`
- `src/components/canvas/Grid.tsx`
- 필요 시 보조 컴포넌트 1개 추가 가능 (`Trail.tsx` 등)

### 2. 인터페이스 수준 요구사항

- 기존 `CanvasProps`의 public 계약은 가능한 한 유지하라.
- Step 1에서 추가한 trail/segment 메타데이터를 사용해 선분 또는 셀 하이라이트를 렌더링하라.
- pen-up 구간은 선을 그리지 말고, pen-down 구간만 표시하라.
- 색상 블록이 반영된 선색을 표시하라.
- 레벨 4의 벽과 레벨 5의 큰 격자에서도 시인성이 유지되어야 한다.
- 애니메이션은 0.3초 이내의 가벼운 transition 정도로 제한하라.

### 3. 테스트 보강

관련 테스트를 추가/수정하여 최소한 다음을 검증하라:

- level 4의 goal/wall/induck 표시가 기존처럼 유지됨
- drawing metadata가 있을 때 trail 시각 요소가 렌더링됨
- pen-up 구간은 그려지지 않음
- color 변경이 trail 시각 속성에 반영됨

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 추가로 `npm run dev` 후 브라우저에서 아래를 수동 확인한다:
   - 스테이지 3/4에서 이동 경로가 자연스럽게 보이는지
   - 스테이지 5에서 색상/펜 올림/내림이 시각적으로 구분되는지
3. 아키텍처 체크리스트를 확인한다:
   - 캔버스가 시각화만 담당하고 실행 규칙을 복제하지 않는가?
   - UI_GUIDE의 밝은 색상/라이트 모드 규칙을 벗어나지 않는가?
4. 결과에 따라 `phases/5-stage-3-5/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 3-5용 이동/그리기 trail 시각화 확장 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- Canvas 컴포넌트 안에서 블록 해석이나 별점 계산을 재구현하지 마라. 이유: engine/store 책임을 침범한다.
- backdrop blur/glassmorphism을 사용하지 마라. 이유: UI_GUIDE/CLAUDE.md 금지사항 위반이다.
- 기존 테스트를 깨뜨리지 마라.
