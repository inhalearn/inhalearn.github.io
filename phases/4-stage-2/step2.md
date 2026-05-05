# Step 2: repeat-editor

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 4와 repeat 블록 구조 예시)
- `/docs/ARCHITECTURE.md` (blocks/ 구조, 코드 편집 데이터 흐름)
- `/docs/UI_GUIDE.md` (반복 블록 버튼, 코드 영역 규칙)
- `/CLAUDE.md` (블록 타입 규칙, Presenter/Container 분리)
- `src/types/block.ts`
- `src/store/codeStore.ts`
- `src/store/codeStore.test.ts`
- `src/components/blocks/BlockPicker.tsx`
- `src/components/blocks/CodeEditor.tsx`

Phase 1에서 이미 구현된 repeat 타입과 store update 시그니처를 활용해, 실제 편집 가능한 반복 UX를 구현하라.

## 작업

반복 블록 추가/수정/하위 블록 편집이 가능한 최소 에디터를 구현한다.

### 1. 수정 대상

- `src/components/blocks/BlockPicker.tsx`
- `src/components/blocks/CodeEditor.tsx`
- 필요 시 `src/components/blocks/` 아래 작은 보조 presenter 컴포넌트 추가 가능

### 2. 인터페이스 수준 요구사항

기존 props 계약은 최대한 유지하되, repeat 편집에 필요한 최소 확장은 허용한다. 예를 들어:

```typescript
interface CodeEditorProps {
  blocks: Block[];
  errorBlockIndex?: number | null;
  availableChildBlocks?: BlockType[];
  onRemoveBlock: (id: string) => void;
  onClearBlocks: () => void;
  onUpdateBlock?: (id: string, updates: Partial<RepeatBlock>) => void;
}
```

핵심 규칙:

- `availableBlocks` 또는 `availableChildBlocks`에 없는 블록은 repeat 내부에도 추가하지 마라.
- repeat 블록은 최소한 횟수 선택(1-10 범위)과 child 1개 이상 추가 UI를 제공하라.
- 중첩 repeat는 타입상 허용되더라도, UI에서는 기존 제한값과 문서 의도에 맞게 과도한 중첩을 유도하지 마라.
- 코드 원본 상태는 계속 부모/store에서 받아야 하며, 컴포넌트 내부에 별도 source-of-truth를 두지 마라.
- 블록 ID 생성 규칙은 충돌 가능성이 낮고 테스트 가능해야 한다.

### 3. 테스트 추가/수정

- `src/components/blocks/BlockPicker.test.tsx`
- `src/components/blocks/CodeEditor.test.tsx`
- 필요 시 `src/store/codeStore.test.ts`

최소 검증 항목:

- repeat가 허용된 경우에만 팔레트에 노출
- repeat 블록 count 변경 동작
- repeat children 추가/삭제 동작
- repeat children이 인터프리터가 소비 가능한 `Block[]` 구조를 유지

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - 편집기 컴포넌트가 store를 직접 import하지 않고 props 기반으로 동작하는가?
   - repeat children 구조가 `src/types/block.ts` 계약과 일치하는가?
   - UI가 허용 블록 집합을 단일 출처로 삼고 있는가?
3. 결과에 따라 `phases/4-stage-2/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "반복 블록 count/children 편집이 가능한 코드 에디터 UX 구현 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 반복 편집 로직을 store 밖에서 임시 문자열/텍스트 DSL로 바꾸지 마라. 이유: 엔진은 `Block[]` 구조를 기대한다.
- `codeStore` 시그니처를 불필요하게 전면 교체하지 마라. 이유: 기존 phase의 editor/테스트 영향을 최소화해야 한다.
- repeat 허용 여부를 컴포넌트 내부 상수로 하드코딩하지 마라. 이유: 레벨 데이터와 화면 상태가 단일 출처여야 한다.
- 기존 테스트를 깨뜨리지 마라.
