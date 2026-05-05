# Step 3: validator

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` — Phase 1 > 4. Validator 섹션
- `/CLAUDE.md` — 핵심 개념 > 실행 플로우 (5단계: Validator가 정답 체크 → 별점 계산)
- `src/types/position.ts`, `src/types/execution.ts` — step 0에서 생성됨
- `src/engine/turtle.ts` — step 1 산출물
- `src/engine/interpreter.ts` — step 2 산출물

## 작업

`src/engine/validator.ts`와 `src/engine/validator.test.ts`를 구현하라.
완료 후 `src/engine/index.ts` barrel export도 작성하라.

### src/engine/validator.ts

```typescript
import { Position } from '@/types/position';

export interface ValidationResult {
  success: boolean;
  stars: number;   // 0~3
}

export class Validator {
  checkGoalReached(current: Position, goal: Position): boolean { ... }
  calculateStars(usedBlocks: number, optimalBlocks: number): number { ... }
  validate(
    current: Position,
    goal: Position,
    usedBlocks: number,
    optimalBlocks: number
  ): ValidationResult { ... }
}
```

별점 계산 규칙:
- 목표 미도달 → stars: 0
- `usedBlocks === optimalBlocks` → stars: 3
- `usedBlocks <= optimalBlocks * 1.5` (소수점 내림) → stars: 2
- 그 외 도달 → stars: 1

### src/engine/validator.test.ts

아래 케이스를 **모두** 커버하는 테스트를 작성하라:

1. 목표 위치 도달 → `success: true`
2. 목표 위치 미도달 → `success: false`, `stars: 0`
3. 최적 블록 수 사용 → `stars: 3`
4. 최적 × 1.5 이하 사용 → `stars: 2`
5. 최적 × 1.5 초과 사용 → `stars: 1`
6. `validate()` 통합: 미도달 시 항상 stars 0 (블록 수 무관)

### src/engine/index.ts

```typescript
export { Turtle } from './turtle';
export type { TurtleConfig } from './turtle';
export { BlockInterpreter } from './interpreter';
export { Validator } from './validator';
export type { ValidationResult } from './validator';
```

## Acceptance Criteria

```bash
npm run test:unit       # 모든 engine 테스트 통과 (turtle + interpreter + validator)
npm run test:coverage   # engine/ 폴더 100% 커버리지 확인
npm run lint            # 에러 없음
npm run build           # 컴파일 에러 없음

# React import 없음 검증
grep -r "from 'react'" src/engine/
# 결과: (empty)
```

## 검증 절차

1. 위 AC 커맨드를 모두 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `grep -r "from 'react'" src/engine/` → 결과 없어야 함
   - `any` 타입 없음
   - engine/ 커버리지 100%
3. 결과에 따라 `phases/1-engine/index.json`의 step 3을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
4. step 3까지 모두 완료되면 `phases/index.json`의 `1-engine` 항목 `status`를 `"completed"`로 업데이트한다.

## 금지사항

- `from 'react'` import를 사용하지 마라. 이유: engine/은 순수 로직 레이어.
- `any` 타입을 사용하지 마라. 이유: TypeScript strict 모드.
- `validate()` 내부에서 블록 수만으로 stars를 계산하지 마라. 이유: 목표 미도달 시 stars는 반드시 0이어야 한다.
- 기존 `src/engine/turtle.ts`, `src/engine/interpreter.ts`를 수정하지 마라. 이유: 이미 검증된 코드를 변경하면 step 1·2 테스트가 깨질 수 있다.
