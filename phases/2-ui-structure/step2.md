# Step 2: level-store

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` (levelStore 섹션, 데이터 흐름)
- `/docs/ADR.md` (ADR-018: 실행 속도 조절, ADR-019: 에러 피드백)
- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 2 > levelStore 섹션)
- `src/engine/interpreter.ts` (Phase 1에서 생성됨)
- `src/engine/turtle.ts` (Phase 1에서 생성됨)
- `src/engine/validator.ts` (Phase 1에서 생성됨)
- `src/types/execution.ts` (Phase 1에서 생성됨)
- `src/store/codeStore.ts` (Step 0에서 생성됨)
- `src/store/progressStore.ts` (Step 1에서 생성됨)

Phase 1의 engine 로직과 Step 0-1의 store 패턴을 이해한 뒤 작업하라. 이 store는 **engine과 UI를 연결하는 다리** 역할을 한다.

## 작업

현재 레벨의 실행 상태를 관리하는 Zustand store를 구현한다. 블록 코드 실행, 속도 조절, 에러 피드백, 힌트 관리를 담당한다.

### 1. `src/store/levelStore.ts` 구현

다음 인터페이스를 구현하라:

```typescript
interface LevelStore {
  currentLevel: number;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  executionSpeed: ExecutionSpeed;
  errorBlockIndex: number | null;
  hintsUsed: number;

  setCurrentLevel: (level: number) => void;
  setExecutionSpeed: (speed: ExecutionSpeed) => void;
  setErrorBlockIndex: (index: number | null) => void;
  execute: (blocks: Block[], levelConfig: LevelConfig) => Promise<void>;
  showHint: () => void;
  reset: () => void;
}
```

**핵심 규칙:**
- **execute 함수**: 가장 중요한 함수. 다음을 수행:
  1. `isExecuting = true` 설정
  2. `errorBlockIndex = null` 초기화
  3. `Turtle` 인스턴스 생성 (levelConfig 사용)
  4. `BlockInterpreter` 인스턴스 생성 (turtle 전달)
  5. `interpreter.execute(blocks, executionSpeed)` 호출 (비동기)
  6. 결과 저장 (`executionResult`)
  7. 실패 시 `errorBlockIndex` 설정 (Phase 1 개선)
  8. `isExecuting = false` 설정
  9. 성공 시 `Validator`로 별점 계산하여 `progressStore.completeLevel()` 호출

- **setExecutionSpeed**: 'normal' | 'fast' | 'skip' 설정 (ADR-018)
- **setErrorBlockIndex**: 에러 발생 블록 위치 설정 (ADR-019)
- **showHint**: hintsUsed 증가
- **reset**: 실행 상태 초기화 (레벨 재시도 시 사용)

**주의사항:**
- engine 인스턴스(Turtle, Interpreter)는 execute 함수 내에서 매번 새로 생성. store에 저장하지 않음. 이유: 레벨마다 설정이 다름.
- progressStore는 `useProgressStore.getState()` 방식으로 접근.
- 에러 처리: try-catch로 감싸고, 에러 시 console.warn + executionResult에 실패 기록.

**파일 위치**: `src/store/levelStore.ts`

**타입 import**:
- `src/types/block.ts`: Block
- `src/types/level.ts`: LevelConfig
- `src/types/execution.ts`: ExecutionResult, ExecutionSpeed
- `src/engine/`: Turtle, BlockInterpreter, Validator

### 2. `src/store/levelStore.test.ts` 테스트 작성

다음 시나리오를 테스트하라:
- 현재 레벨 설정
- 실행 속도 변경 (normal → fast → skip)
- execute: 성공 케이스 (간단한 블록 시퀀스)
- execute: 실패 케이스 (벽 충돌, errorBlockIndex 확인)
- execute: isExecuting 상태 변화 (실행 전 true, 완료 후 false)
- showHint: hintsUsed 증가
- reset: 상태 초기화

**주의**:
- `execute`는 비동기이므로 `await` 사용.
- mock LevelConfig 필요 (gridSize, startPosition, goalPosition 등).
- progressStore mock 필요 (completeLevel 호출 확인).

**파일 위치**: `src/store/levelStore.test.ts`

## Acceptance Criteria

```bash
npm run test:unit
# levelStore 테스트 통과

npm run lint
# 에러 없음

npm run build
# 빌드 성공

# 수동 테스트 (선택)
npm run dev
# 브라우저 콘솔에서:
# const blocks = [{ id: '1', type: 'move-right' }];
# const config = { gridSize: 5, startPosition: {x:0,y:0}, goalPosition: {x:1,y:0}, ... };
# await useLevelStore.getState().execute(blocks, config);
# useLevelStore.getState().executionResult 확인
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md의 데이터 흐름(블록 추가 → 실행 → 결과)을 따르는가?
   - engine/ 폴더 코드를 올바르게 사용하는가? (Turtle, Interpreter, Validator)
   - ADR-018(실행 속도 조절)과 ADR-019(에러 피드백)의 요구사항을 만족하는가?
   - store에 engine 인스턴스를 저장하지 않았는가? (execute 함수 내에서만 생성)
3. 결과에 따라 `phases/2-ui-structure/index.json`의 step 2를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "levelStore 구현 완료 (engine 연동, 비동기 실행, 속도 조절, 에러 추적, 테스트 N개 통과)"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **any 타입 사용 금지**. 이유: TypeScript strict mode 위반.
- **engine 인스턴스를 store에 저장 금지**. 이유: 레벨마다 설정이 다름. execute 함수 내에서 매번 생성.
- **동기 실행 금지**. 이유: execute는 async/await 사용. 애니메이션 대기 시간 필요.
- **progressStore에 직접 의존성 주입 금지**. 이유: `useProgressStore.getState()` 방식 사용. 순환 참조 방지.
- **빈 catch 블록 금지**. 이유: 에러 발생 시 최소한 console.warn.
- **컴포넌트에서 engine 직접 생성 금지**. 이유: levelStore.execute를 통해서만 접근. 관심사 분리.
- 기존 테스트를 깨뜨리지 마라.
