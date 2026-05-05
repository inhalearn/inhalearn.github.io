# Step 0: code-store

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` (상태 관리 계층 섹션)
- `/docs/ADR.md` (ADR-003: Zustand)
- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 2 섹션)
- `src/types/block.ts` (Phase 1에서 생성됨)

Phase 1에서 만들어진 타입 정의를 꼼꼼히 읽고, 블록 시스템의 설계 의도를 이해한 뒤 작업하라.

## 작업

블록 에디터의 상태를 관리하는 Zustand store를 구현한다. 이 store는 사용자가 추가/삭제/수정한 블록 리스트를 관리한다.

### 1. `src/store/codeStore.ts` 구현

다음 인터페이스를 구현하라:

```typescript
interface CodeStore {
  blocks: Block[];
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  clearBlocks: () => void;
}
```

**핵심 규칙:**
- `addBlock`: 최대 블록 수(`MAX_BLOCKS = 50`) 제한. 초과 시 console.warn 후 무시.
- `removeBlock`: id로 블록 삭제. 존재하지 않는 id는 무시.
- `updateBlock`: 특정 블록의 속성만 부분 업데이트 (예: RepeatBlock의 count 변경).
- `clearBlocks`: 모든 블록 제거.
- 모든 상태 업데이트는 불변성(immutability) 유지.

**파일 위치**: `src/store/codeStore.ts`

**타입 import**: `src/types/block.ts`에서 `Block` 타입 import

### 2. `src/store/codeStore.test.ts` 테스트 작성

다음 시나리오를 테스트하라:
- 블록 추가 (정상)
- 블록 추가 (최대 개수 초과 시 무시)
- 블록 삭제 (정상)
- 블록 삭제 (존재하지 않는 id 무시)
- 블록 업데이트 (정상)
- 블록 전체 삭제
- 상태 불변성 검증 (원본 배열 변경 안 됨)

**테스트 프레임워크**: Vitest

**파일 위치**: `src/store/codeStore.test.ts`

## Acceptance Criteria

```bash
npm run test:unit
# codeStore 테스트 통과

npm run lint
# 에러 없음

npm run build
# 빌드 성공
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md의 상태 관리 계층을 따르는가?
   - ADR-003의 Zustand 사용 원칙을 따르는가?
   - CLAUDE.md의 CRITICAL 규칙(any 타입 금지 등)을 위반하지 않았는가?
3. 결과에 따라 `phases/2-ui-structure/index.json`의 step 0을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "codeStore 구현 완료 (블록 추가/삭제/수정/초기화, MAX_BLOCKS=50 제한, 테스트 N개 통과)"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **any 타입 사용 금지**. 이유: TypeScript strict mode 위반.
- **localStorage 직접 접근 금지**. 이유: codeStore는 메모리 상태만 관리. 영구 저장은 progressStore(Step 1)에서 담당.
- **engine/ 폴더 코드 import 금지**. 이유: store는 UI 레이어, engine은 로직 레이어. 분리 유지.
- **React import 금지**. 이유: Zustand store는 React와 독립적.
- 기존 테스트를 깨뜨리지 마라.
