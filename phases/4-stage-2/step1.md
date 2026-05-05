# Step 1: discovery-ui

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 4 > DiscoveryModal, ComparisonModal)
- `/docs/LEVELS.md` (스테이지 2 중간 피드백/비교 화면 카피)
- `/docs/UI_GUIDE.md` (모달, 버튼, 색상 규칙)
- `/CLAUDE.md` (애니메이션 제한, 라이트 모드 금지사항)
- `src/components/ui/Modal.tsx`
- `src/components/ui/Button.tsx`
- `src/data/levels.ts` (Step 0에서 업데이트됨)

공통 모달 컴포넌트의 구조를 이해한 뒤, 스테이지 2 전용 모달 UI를 구현하라.

## 작업

발견 모달과 코드 비교 모달을 구현한다.

### 1. 아래 파일들을 생성하라

- `src/components/ui/DiscoveryModal.tsx`
- `src/components/ui/ComparisonModal.tsx`

### 2. 인터페이스 수준 요구사항

`DiscoveryModal.tsx`:

```typescript
interface DiscoveryModalProps {
  isOpen: boolean;
  onHint: () => void;
  onContinue: () => void;
  onClose: () => void;
}
```

`ComparisonModal.tsx`:

```typescript
interface ComparisonModalProps {
  isOpen: boolean;
  beforeBlocks: Block[];
  afterBlocks: Block[];
  onNext: () => void;
  onClose: () => void;
}
```

핵심 규칙:

- 두 컴포넌트 모두 기존 `Modal`을 감싸는 presenter여야 하며, 상태를 내부에 저장하지 마라.
- 발견 모달 카피는 "같은 블록을 계속 쓰고 있네요... 더 쉬운 방법이 있을까요?" 경험을 유지하라.
- 비교 모달은 "이전 방법 5줄 vs 반복 사용 2줄" 비교가 한눈에 보이도록 구성하라.
- 애니메이션은 Framer Motion 또는 기존 `Modal` transition 범위 안에서 0.3초 이내만 사용하라.
- 라이트 모드, 인하대 스카이블루, 경고/성공 포인트 컬러 규칙을 유지하라.

### 3. 테스트 추가

- `src/components/ui/DiscoveryModal.test.tsx`
- `src/components/ui/ComparisonModal.test.tsx`

최소 검증 항목:

- `isOpen`일 때 핵심 텍스트와 버튼이 렌더링됨
- 버튼 클릭 시 전달된 콜백 호출
- 비교 모달에서 before/after 블록 목록이 모두 표시됨
- overlay 또는 닫기 동작이 `onClose`로 연결됨

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 모달 컴포넌트가 store를 직접 import하지 않는가?
   - 텍스트/버튼/비교 레이아웃이 UI_GUIDE의 모바일 우선 규칙을 따르는가?
   - 비교 모달이 블록 타입을 재해석하는 대신 전달된 데이터를 표시만 하는가?
3. 결과에 따라 `phases/4-stage-2/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 2용 발견 모달과 코드 비교 모달 UI 구현 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 모달 내부에서 레벨 진행 상태를 직접 변경하지 마라. 이유: 이 step은 UI 레이어만 다룬다.
- 스테이지 2 전용 플로우를 `Modal.tsx` 자체에 하드코딩하지 마라. 이유: 공통 컴포넌트 책임이 오염된다.
- 긴 설명문을 과도하게 늘리지 마라. 이유: 모바일에서 한 화면에 핵심 선택지가 보여야 한다.
- 기존 테스트를 깨뜨리지 마라.
