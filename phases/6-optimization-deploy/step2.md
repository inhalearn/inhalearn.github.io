# Step 2: github-actions-deploy

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 6 배포 요구사항)
- `/docs/ADR.md` (GitHub Pages 정적 배포 결정)
- `/CLAUDE.md` (빌드/테스트 규칙)
- `package.json`
- `vite.config.ts`
- `phases/6-optimization-deploy/step0.md`
- `phases/6-optimization-deploy/step1.md`
- Step 0-1에서 수정된 실제 파일들

Step 0-1 산출물을 기준으로 GitHub Actions 배포 파이프라인을 추가하라.

## 작업

main 브랜치 푸시 시 lint, unit test, build를 거친 뒤 GitHub Pages로 배포되는 워크플로우를 만든다.

### 1. 수정 대상

- `.github/workflows/deploy.yml`
- 필요 시 배포에 필요한 최소 설정 파일 (`vite.config.ts`, `package.json`)

### 2. 인터페이스 수준 요구사항

- 워크플로우는 최소한 `npm ci`, `npm run lint`, `npm run test:unit`, `npm run build`를 실행해야 한다.
- GitHub Pages 배포는 현재 GitHub 권장 방식(`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`) 또는 동등하게 유지보수 가능한 방식으로 구성하라.
- 배포 전용 설정 때문에 로컬 개발(`npm run dev`)을 깨뜨리지 마라.
- 리포지토리 비밀값을 새로 요구하지 않는 구성을 우선하라. GitHub 기본 토큰으로 해결 가능한 경로를 택하라.
- 배포 URL/base path 가정이 있다면 코드와 summary에 명확히 남겨라.

### 3. 테스트 추가/수정

최소 검증 항목:

- 워크플로우 YAML 문법이 유효해야 한다.
- 로컬에서 `npm run lint && npm run test:unit && npm run build`가 계속 통과해야 한다.

## Acceptance Criteria

```bash
npm run test:unit && npm run lint && npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 워크플로우 파일을 직접 점검하여 다음이 모두 포함되는지 확인한다:
   - Pages 권한/배포 job
   - build artifact 업로드
   - main 브랜치 push 트리거
3. 아키텍처 체크리스트를 확인한다:
   - 서버 없는 정적 호스팅 결정과 충돌하지 않는가?
   - 로컬 개발/테스트 명령 체계를 그대로 재사용하는가?
4. 결과에 따라 `phases/6-optimization-deploy/index.json`의 해당 step을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "GitHub Actions 기반 Pages 배포 파이프라인 추가 완료 (...)" `
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- 배포를 위해 테스트나 lint 단계를 빼지 마라. 이유: 하네스 검증 체인을 스스로 무력화한다.
- 사용자에게 별도 수동 서버 배포를 요구하는 스크립트를 넣지 마라. 이유: 문서의 GitHub Pages 자동 배포 방향과 충돌한다.
- 저장소 구조를 크게 바꾸지 마라. 이유: Phase 6은 마감 단계이며 위험한 리팩터보다 안정성이 우선이다.
- 기존 테스트를 깨뜨리지 마라.
