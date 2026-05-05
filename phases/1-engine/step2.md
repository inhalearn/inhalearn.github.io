# Step 2: interpreter

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md`
- `/docs/IMPLEMENTATION_GUIDE.md` — Phase 1 > 3. BlockInterpreter 섹션
- `/CLAUDE.md` — 핵심 개념 > 실행 플로우, 필수 제한값 (MAX_ITERATIONS, MAX_REPEAT_DEPTH 등)
- `src/types/block.ts`, `src/types/execution.ts` — step 0에서 생성됨
- `src/engine/turtle.ts` — step 1에서 생성됨

## 작업

`src/engine/interpreter.ts`와 `src/engine/interpreter.test.ts`를 구현하라.

### src/engine/interpreter.ts

```typescript
import { Block } from '@/types/block';
import { ExecutionResult, ExecutionSpeed } from '@/types/execution';
import { Turtle } from './turtle';

export class BlockInterpreter {
  constructor(turtle: Turtle) { ... }

  async execute(
    blocks: Block[],
    speed: ExecutionSpeed,
    goalPosition?: Position
  ): Promise<ExecutionResult> { ... }
}
```

핵심 규칙:
- 블록을 순서대로 실행하다 에러 발생 시 즉시 중단하고 `errorBlockIndex`를 반환한다.
- `repeat` 블록은 재귀 호출로 처리한다. 중첩 깊이는 `MAX_REPEAT_DEPTH = 3`을 초과하면 에러 처리.
- 총 이동 횟수가 `MAX_ITERATIONS = 1000`을 초과하면 무한 루프로 간주, 중단+경고.
- `speed === 'skip'`이면 `setTimeout` 없이 즉시 실행한다(테스트 성능 보장).
- `speed === 'fast'` → 100ms, `speed === 'normal'` → 300ms 딜레이.
- `color`, `pen-up`, `pen-down` 블록은 이 단계에서 **무시(no-op)**한다. 이유: Phase 3에서 구현.
- Turtle 이동이 실패(`move()` → `false`)하면 `reason: 'collision'`으로 반환.
- React import 절대 금지.

### src/engine/interpreter.test.ts

아래 케이스를 **모두** 커버하는 테스트를 작성하라 (speed는 항상 `'skip'` 사용):

1. 단순 이동 시퀀스 실행 → 최종 위치 확인
2. `repeat` 블록 실행 → 반복 횟수만큼 이동
3. 중첩 `repeat` 블록 (2단계) 실행
4. 이동 블록 충돌 → `success: false`, `errorBlockIndex` 정확히 반환
5. 에러 발생 후 이후 블록 실행 안 됨 (중단 확인)
6. `repeat` 내부에서 충돌 → `success: false`, 외부 `repeat` 블록의 인덱스 반환
7. `MAX_ITERATIONS` 초과 → 중단
8. `color`/`pen-up`/`pen-down` 블록 → 에러 없이 무시
9. 빈 블록 배열 → `success: true`

## Acceptance Criteria

```bash
npm run test:unit   # interpreter 테스트 전부 통과
npm run lint        # 에러 없음
npm run build       # 컴파일 에러 없음
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `grep -r "from 'react'" src/engine/` → 결과 없어야 함
   - `any` 타입 없음
3. 결과에 따라 `phases/1-engine/index.json`의 step 2를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`

## 금지사항

- `from 'react'` import를 사용하지 마라. 이유: engine/은 순수 로직 레이어.
- `any` 타입을 사용하지 마라. 이유: TypeScript strict 모드.
- `MAX_ITERATIONS`, `MAX_REPEAT_DEPTH` 제한을 생략하지 마라. 이유: 무한 루프 방지는 게임 안정성의 핵심 가드레일이다.
- `speed !== 'skip'`일 때 setTimeout을 사용해도 되지만, 테스트에서 반드시 `'skip'`을 사용하라. 이유: 실제 딜레이가 있으면 테스트 시간이 수십 초가 된다.
- `Turtle` 클래스 내부를 수정하지 마라. 이유: step 1의 인터페이스를 그대로 사용해야 한다.
