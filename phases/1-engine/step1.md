# Step 1: turtle

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md`
- `/docs/IMPLEMENTATION_GUIDE.md` — Phase 1 > 2. Turtle 엔진 섹션
- `/CLAUDE.md` — 핵심 개념 > 실행 플로우, 필수 제한값
- `src/types/position.ts` — 이전 step에서 생성됨
- `src/types/index.ts` — barrel export

## 작업

`src/engine/turtle.ts`와 `src/engine/turtle.test.ts`를 구현하라.

### src/engine/turtle.ts

```typescript
import { Position, Direction, DIRECTION_VECTORS } from '@/types/position';

export interface TurtleConfig {
  gridSize: number;
  startPosition: Position;
  walls?: Position[];
}

export class Turtle {
  constructor(config: TurtleConfig) { ... }
  move(direction: Direction): boolean { ... }   // 이동 성공 여부 반환
  getPosition(): Position { ... }               // 불변 복사본 반환
  getTrail(): Position[] { ... }                // 불변 복사본 반환
  reset(): void { ... }                         // startPosition으로 복귀
}
```

핵심 규칙:
- `move()`는 이동 전 경계·벽 검사를 선행한다. 실패 시 위치를 변경하지 않고 `false` 반환.
- `getPosition()`, `getTrail()`은 내부 상태를 직접 노출하지 않는다(불변 복사본).
- `reset()` 호출 후 trail은 startPosition 1개만 남는다.
- React import 절대 금지.

### src/engine/turtle.test.ts

아래 케이스를 **모두** 커버하는 테스트를 작성하라:

1. 초기 위치 확인
2. 4방향 이동 (up/down/left/right) 성공 케이스
3. 경계 초과 이동 → `false` 반환 + 위치 불변
4. 벽 충돌 이동 → `false` 반환 + 위치 불변
5. trail 추적 (시작점 포함, 이동할수록 길이 증가)
6. reset() 후 위치·trail 초기화
7. getPosition()/getTrail() 반환값 변경해도 내부 상태 영향 없음 (불변성)

## Acceptance Criteria

```bash
npm run test:unit   # turtle 테스트 전부 통과
npm run lint        # 에러 없음
npm run build       # 컴파일 에러 없음
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - `grep -r "from 'react'" src/engine/` → 결과 없어야 함
   - `any` 타입 없음
3. 결과에 따라 `phases/1-engine/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`

## 금지사항

- `from 'react'` import를 사용하지 마라. 이유: engine/은 순수 로직 레이어, React 의존성 금지.
- `move()` 성공 시 trail에 startPosition 중복 추가하지 마라. 이유: trail[0]은 항상 startPosition이고, 이후 이동마다 1개씩 추가된다.
- `getPosition()`/`getTrail()`에서 내부 배열/객체 참조를 직접 반환하지 마라. 이유: 호출자가 반환값을 수정하면 내부 상태가 오염된다.
- `src/types/` 외의 타입을 임의로 정의하지 마라. 이유: 타입은 step 0에서 중앙 관리한다.
