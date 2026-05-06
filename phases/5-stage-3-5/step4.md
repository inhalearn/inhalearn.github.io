# Step 4: completion-progress

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 5 완료 조건)
- `/docs/LEVELS.md` (완주 축하 화면 의도)
- `/docs/ARCHITECTURE.md` (page flow, progressStore 계층)
- `/docs/UI_GUIDE.md` (완주/카드/버튼 시각 규칙)
- `/CLAUDE.md` (progressStore, localStorage, 모바일 우선)
- `phases/5-stage-3-5/step3.md`
- `src/App.tsx`
- `src/store/progressStore.ts`
- `src/data/levels.ts`
- 관련 테스트 파일

Step 3까지의 산출물을 읽고, Phase 5 완료 조건인 "완주 화면 + 진행률 저장/불러오기"를 마무리하라.

## 작업

진행 상황 표시와 완주 화면을 실제 사용자 경험으로 연결한다.

### 1. 수정 대상

- `src/App.tsx`
- 필요 시 `src/components/screens/Completion.tsx` 생성
- 필요 시 `src/components/screens/LevelSelect.tsx`로 분리 가능

### 2. 인터페이스 수준 요구사항

- 레벨 선택 화면은 6개 스테이지 전체를 보여야 한다.
- progressStore를 읽어 완료 여부, 획득 별 수, 다음 해금 상태를 표시하라.
- 마지막 레벨 완료 후 `/completion`에서 총 별 수와 완주 메시지를 보여라.
- LevelSelect/Completion 어디서도 localStorage에 직접 접근하지 마라.
- 공유/저장 버튼이 실제 구현되지 않더라도, 동작 없는 가짜 버튼만 두지 말고 명확한 CTA만 남겨라.

### 3. 테스트 추가/수정

최소 검증 항목:

- 진행 데이터가 있을 때 레벨 선택 화면에 완료/별 수가 표시됨
- 마지막 레벨 완료 시 completion 화면에 총 별 수와 축하 메시지가 표시됨
- 새로고침을 가정한 store 재초기화 이후에도 persist 데이터 렌더링 계약이 유지됨

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 추가로 `npm run dev` 후 브라우저에서 아래를 수동 확인한다:
   - 레벨 완료 후 `/levels`에서 별 개수와 완료 상태가 보이는지
   - 마지막 레벨 완료 후 `/completion`에서 총 별 수가 반영되는지
3. 아키텍처 체크리스트를 확인한다:
   - 진행도 표시는 progressStore 단일 출처를 유지하는가?
   - Completion/LevelSelect가 문서의 모바일 우선 라이트 UI 규칙을 지키는가?
4. 결과에 따라 `phases/5-stage-3-5/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "6개 스테이지 진행 표시와 완주 화면 연결 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 컴포넌트에서 직접 localStorage를 읽거나 쓰지 마라. 이유: progressStore 책임을 침범한다.
- 실제 구현되지 않은 저장/공유 기능을 동작하는 척하는 UI로 두지 마라. 이유: 사용자 혼란을 만든다.
- 기존 테스트를 깨뜨리지 마라.
