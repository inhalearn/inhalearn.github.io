# Step 3: level-discovery-flow

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 4 완료 조건)
- `/docs/LEVELS.md` (스테이지 2의 1단계/2단계 플로우와 비교 경험)
- `/docs/ARCHITECTURE.md` (Level 화면 데이터 흐름, 실행 결과 처리)
- `/docs/UI_GUIDE.md` (발견 모달, 비교 모달, 실행 버튼, 피드백 규칙)
- `/CLAUDE.md` (3개 store 분리, localStorage 직접 접근 금지)
- `src/data/levels.ts` (Step 0)
- `src/components/ui/DiscoveryModal.tsx` (Step 1)
- `src/components/ui/ComparisonModal.tsx` (Step 1)
- `src/components/blocks/BlockPicker.tsx` (Step 2)
- `src/components/blocks/CodeEditor.tsx` (Step 2)
- `src/components/screens/Level.tsx`
- `src/store/codeStore.ts`
- `src/store/levelStore.ts`

이전 step 산출물을 모두 읽고, 스테이지 2의 발견 경험을 Level 화면 플로우에 통합하라.

## 작업

스테이지 2에서 "수동 5개 추가 → 발견 모달 → repeat 해금 → 반복으로 재해결 → 비교 모달" 흐름이 실제로 작동하도록 구현한다.

### 1. 수정 대상

- `src/components/screens/Level.tsx`
- 필요 시 `src/store/levelStore.ts`의 최소 확장
- 필요 시 `src/App.tsx` 또는 관련 테스트 파일

### 2. 인터페이스 수준 요구사항

Level 화면은 최소한 다음 플로우를 제공해야 한다:

1. 레벨 2에서 초기에는 `move-right`만 노출
2. 블록이 `unlockRepeatAt` 이상 쌓이면 발견 모달 표시
3. 사용자가 `힌트 보기`를 선택하면 repeat 사용이 해금되고 `levelStore.showHint()`가 반영됨
4. repeat 해금 후에는 `BlockPicker`/`CodeEditor`가 repeat 편집을 지원
5. repeat를 사용해 성공한 경우 비교 모달 표시
6. 비교 모달에서 이전 5줄 코드와 현재 코드(예상 2줄)를 함께 보여주고 다음 액션 제공

핵심 규칙:

- localStorage 직접 접근 금지. 진행도 저장은 계속 `progressStore` 간접 효과만 사용하라.
- 스테이지 0-1의 기존 플레이 플로우를 깨뜨리지 마라.
- 발견 모달은 한 번의 수동 작성 경험 이후에만 뜨도록 제어하라. 무한 재표시 금지.
- repeat 해금 여부는 레벨 화면 상태 또는 최소 store 상태로 관리하되, source-of-truth가 분산되지 않게 하라.
- 비교 모달 표시 조건은 "레벨 2 + repeat 사용 성공"으로 명확하게 유지하라.

### 3. 테스트 추가/수정

- `src/components/screens/Level.test.tsx`
- 필요 시 `src/App.test.tsx`

최소 검증 항목:

- 레벨 2에서 처음에는 move-right만 노출
- 5개 수동 블록 추가 후 발견 모달 표시
- 힌트 선택 후 repeat 버튼 노출
- repeat 포함 코드로 성공 시 비교 모달 표시
- 레벨 0-1 기존 동작 회귀 없음

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 추가로 `npm run dev` 후 브라우저에서 아래를 수동 확인한다:
   - `/level/2`에서 5개 수동 블록 입력 후 발견 모달이 뜨는지
   - `힌트 보기` 후 repeat가 해금되는지
   - repeat 5회 + 오른쪽 1개 child 구성으로 성공 가능한지
   - 성공 후 비교 모달이 뜨고 다음 이동이 가능한지
3. 아키텍처 체크리스트를 확인한다:
   - Level 화면이 여전히 engine을 직접 호출하지 않고 `levelStore.execute`를 사용하는가?
   - 발견/해금/비교 상태가 UI 통합 레이어에 머무르고 engine/data 책임을 침범하지 않는가?
   - 기존 3개 store 책임 분리가 유지되는가?
4. 결과에 따라 `phases/4-stage-2/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "스테이지 2 발견→repeat 해금→비교 모달까지의 플레이 플로우 통합 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- `Level.tsx` 안에 반복 실행 규칙이나 validator 판정을 재구현하지 마라. 이유: 엔진/스토어 책임을 침범한다.
- 발견 모달 표시를 단순 `blocks.length >= 5`만으로 모든 레벨에 적용하지 마라. 이유: 스테이지 2 전용 경험이다.
- 비교 모달 데이터를 하드코딩한 문자열로만 표현하지 마라. 이유: 실제 블록 구조와 일치해야 테스트와 유지보수가 가능하다.
- 기존 테스트를 깨뜨리지 마라.
