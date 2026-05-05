# Step 2: block-editor

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 3 > 블록 에디터)
- `/docs/ARCHITECTURE.md` (components/blocks 구조, 데이터 흐름)
- `/docs/UI_GUIDE.md` (블록 버튼, 코드 영역 규칙)
- `/CLAUDE.md` (Presenter/Container 분리, 상태 관리 규칙)
- `src/data/levels.ts` (Step 0에서 생성됨)
- `src/store/codeStore.ts`
- `src/store/levelStore.ts`
- `src/types/block.ts`
- `src/components/ui/Button.tsx`

이전 step의 레벨 데이터와 store 시그니처를 이해한 뒤, 블록 추가/삭제 UI를 구현하라.

## 작업

스테이지 0-1 플레이에 필요한 최소 블록 편집 UI를 구현한다.

### 1. 아래 파일들을 생성하라

- `src/components/blocks/BlockPicker.tsx`
- `src/components/blocks/CodeEditor.tsx`

필요하면 블록 행 렌더링을 위한 작은 내부 컴포넌트를 같은 파일 또는 `src/components/blocks/` 아래에 추가할 수 있다. 다만 Step 범위를 넘겨 반복 블록 편집기까지 만들지는 마라.

### 2. 인터페이스 수준 요구사항

`BlockPicker.tsx`:

```typescript
interface BlockPickerProps {
  availableBlocks: BlockType[];
  onAddBlock: (type: BlockType) => void;
  disabled?: boolean;
}
```

`CodeEditor.tsx`:

```typescript
interface CodeEditorProps {
  blocks: Block[];
  errorBlockIndex?: number | null;
  onRemoveBlock: (id: string) => void;
  onClearBlocks: () => void;
}
```

핵심 규칙:

- 스테이지 0-1에서는 실제로 쓰이는 이동 블록만 명확하게 노출하라.
- `availableBlocks`에 없는 블록 버튼은 렌더링하지 마라.
- `CodeEditor`는 현재 코드 목록, 삭제, 전체 초기화, 에러 블록 강조를 제공하라.
- 블록 생성 시 ID는 UI 계층에서 만들 수 있지만, 생성 규칙은 충돌 가능성이 낮고 테스트 가능해야 한다.
- 상태는 부모 컨테이너에서 받아 사용하고, 컴포넌트 내부에 코드 원본 상태를 중복 저장하지 마라.

### 3. 테스트 추가

- `src/components/blocks/BlockPicker.test.tsx`
- `src/components/blocks/CodeEditor.test.tsx`

최소 검증 항목:

- 허용된 블록만 렌더링
- 블록 버튼 클릭 시 `onAddBlock` 호출
- 코드 블록 삭제 버튼 동작
- `errorBlockIndex`에 해당하는 블록 강조

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - store 조작은 props로 전달된 콜백을 통해서만 수행하는가?
   - `availableBlocks`를 단일 출처로 사용하고 있는가?
   - UI_GUIDE의 블록 버튼 크기와 즉각적 피드백 규칙을 따르는가?
3. 결과에 따라 `phases/3-stage-0-1/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 0-1용 블록 선택기와 코드 편집 UI 구현 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 컴포넌트에서 `codeStore`를 직접 import해 조작하지 마라. 이유: Presenter/Container 분리를 지켜야 한다.
- `repeat`, `color`, `pen-*` 전용 편집 UX를 이 step에서 미리 구현하지 마라. 이유: Phase 4 이후 범위다.
- `availableBlocks`를 하드코딩하지 마라. 이유: 레벨 데이터가 단일 출처여야 한다.
- 기존 테스트를 깨뜨리지 마라.
