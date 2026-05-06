# Step 1: pages-routing

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 6 배포 목표)
- `/docs/ADR.md` (GitHub Pages 정적 호스팅 결정)
- `/docs/ARCHITECTURE.md` (페이지 흐름과 라우팅 구조)
- `/CLAUDE.md` (서버 사용 금지, GitHub Pages 제약)
- `phases/6-optimization-deploy/step0.md`
- `src/App.tsx`
- `src/main.tsx`
- `vite.config.ts`
- `index.html`

Step 0 산출물을 읽고, GitHub Pages 정적 호스팅 환경에서 SPA 라우팅이 직접 진입/새로고침에도 깨지지 않도록 보강하라.

## 작업

GitHub Pages는 정적 파일 서버이므로 `/level/2` 같은 직접 접근이 404가 되기 쉽다. 서버를 추가하지 않는 선에서 SPA deep-link 문제를 해결하라.

### 1. 수정 대상

- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- 필요 시 `public/404.html` 또는 동등한 GitHub Pages fallback 파일
- 필요 시 `vite.config.ts`

### 2. 인터페이스 수준 요구사항

- `Landing -> LevelSelect -> Level -> Completion` 라우트 구조는 유지하라.
- GitHub Pages 정적 배포에서 새로고침/직접 접근 시에도 앱이 정상 진입해야 한다.
- 저장소명이 `inhalearn.github.io`인 사용자 사이트 특성을 고려하되, 루트 경로 동작을 함부로 깨뜨리지 마라.
- 가능하면 URL 스킴(`/level/:id`)은 유지하라. 단, 정적 호스팅 제약 때문에 불가피하면 그 이유를 코드와 summary에 명확히 남겨라.
- 배포 호환성 때문에 필요한 최소 HTML/redirect 스크립트만 추가하라. 복잡한 커스텀 라우터를 새로 만들지 마라.

### 3. 테스트 추가/수정

최소 검증 항목:

- 기존 앱 라우트 테스트 회귀 없음
- fallback 진입 로직이 있을 경우 해당 계약을 검증하는 테스트 또는 최소한 재현 가능한 수동 검증 절차가 문서화됨

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 추가로 `npm run preview` 또는 동등한 정적 미리보기 환경에서 아래를 수동 확인한다:
   - `/`
   - `/levels`
   - `/level/2`
   - `/completion`
3. 아키텍처 체크리스트를 확인한다:
   - 정적 호스팅 제약 해결이 라우트 컴포넌트 구조를 불필요하게 복잡하게 만들지 않았는가?
   - 서버/백엔드 없이 GitHub Pages 제약 안에서 해결했는가?
4. 결과에 따라 `phases/6-optimization-deploy/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "GitHub Pages 정적 환경에서 SPA deep-link/refresh 대응 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- HashRouter로 즉시 바꿔서 문제를 덮지 마라. 이유: 기존 URL 계약을 불필요하게 깨뜨릴 수 있다.
- 서버 리라이트를 전제로 한 해결책을 넣지 마라. 이유: GitHub Pages에서는 동작하지 않는다.
- 라우트별 상태 복구 로직을 각 화면에 분산시키지 마라. 이유: 진입 복구 책임이 UI 전반에 흩어진다.
- 기존 테스트를 깨뜨리지 마라.
