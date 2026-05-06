# Step 0: performance-audit

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 6 목표와 번들 기준)
- `/docs/ARCHITECTURE.md` (렌더링 최적화 원칙, 모바일 우선 제약)
- `/docs/UI_GUIDE.md` (애니메이션 시간, 터치 타겟, 라이트 UI 규칙)
- `/CLAUDE.md` (engine/store/UI 책임 분리, 성능 제약)
- `package.json`
- `vite.config.ts`
- `src/App.tsx`
- `src/main.tsx`
- 성능에 영향이 큰 화면/에셋 관련 파일 (`src/components/screens/*`, `src/assets/*`)

이 step의 목적은 현재 앱을 배포 직전 수준으로 가볍게 다듬는 것이다. 이미 통과 중인 기능을 크게 뒤엎지 말고, 측정 가능한 성능/번들 개선만 수행하라.

## 작업

프로덕션 번들 크기와 초기 로딩 경로를 점검하고, 필요한 최소 수정만 적용하라.

### 1. 수정 대상

- `src/App.tsx`
- `src/main.tsx`
- `vite.config.ts`
- 필요 시 실제로 사용되지 않는 에셋/보조 파일
- 필요 시 성능 검증에 도움이 되는 소규모 테스트 파일

### 2. 인터페이스 수준 요구사항

- 문서 목표인 `Bundle size < 500KB`를 유지하거나 개선하라.
- 첫 진입 시 꼭 필요하지 않은 화면은 route-level lazy loading 또는 동등한 방식으로 분리할 수 있다.
- 랜딩/레벨 선택/레벨 플레이 UX를 눈에 띄게 변경하지 마라. 최적화 때문에 플로우가 바뀌면 안 된다.
- 애니메이션 시간 제한(기본 0.3초 이내)과 모바일 우선 레이아웃을 깨뜨리지 마라.
- `engine/` 순수 함수 원칙, 3개 store 분리 원칙을 건드리지 마라.
- 측정 결과는 `phases/6-optimization-deploy/index.json`의 step summary에 번들 핵심 수치와 함께 남겨라.

### 3. 테스트 추가/수정

최소 검증 항목:

- 기존 unit test 회귀 없음
- 프로덕션 빌드 성공
- 빌드 출력에서 메인 JS/CSS 번들 크기 확인 가능

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `npm run build` 출력에서 최소한 아래를 확인해 summary에 반영한다:
   - 메인 JS 번들 크기
   - gzip 기준 번들 크기
3. 아키텍처 체크리스트를 확인한다:
   - 최적화 과정에서 `engine/` 또는 `store/` 책임이 UI로 새지 않았는가?
   - Browser 진입 플로우와 화면 구조가 기존 레벨 경험을 유지하는가?
   - 사용하지 않는 코드/에셋만 제거했고, 문서상 필수 캐릭터/화면은 유지되는가?
4. 결과에 따라 `phases/6-optimization-deploy/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "초기 로딩 경로 최적화 및 번들 크기 확인 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 단순히 숫자를 맞추기 위해 기능을 제거하지 마라. 이유: Phase 0-5에서 완성한 학습 플로우가 제품 본체다.
- `engine/` 내부에 React 최적화 코드를 넣지 마라. 이유: 순수 로직 계층 오염이다.
- 측정 없이 “최적화되었다”고 summary를 쓰지 마라. 이유: Phase 6은 검증 가능한 결과가 핵심이다.
- 기존 테스트를 깨뜨리지 마라.
