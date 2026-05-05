# Step 1: dependencies

## 읽어야 할 파일

먼저 아래 파일들을 읽고 필요한 의존성을 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 0 - 의존성 설치 섹션)
- `/docs/ADR.md` (ADR-003: Zustand, ADR-004: Framer Motion, ADR-007: Tailwind CSS)
- `/CLAUDE.md` (기술 스택 섹션)
- 이전 step에서 생성된 `package.json`

## 작업

프로젝트에 필요한 모든 의존성을 설치한다.

### 1. 필수 의존성 설치

```bash
npm install zustand framer-motion
```

- **zustand**: 상태 관리 라이브러리
- **framer-motion**: 애니메이션 라이브러리

### 2. 개발 의존성 설치

```bash
npm install -D \
  @types/node \
  tailwindcss \
  postcss \
  autoprefixer \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  prettier \
  vitest \
  @vitest/ui \
  jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event
```

**주의사항**:
- `@types/react`, `@types/react-dom`은 Vite 템플릿에 이미 포함되어 있으므로 재설치 불필요
- `husky`와 `@playwright/test`는 Phase 0에서 제외 (Phase 6에서 추가)

### 3. package.json 확인

설치 후 `package.json`의 dependencies와 devDependencies 섹션이 올바르게 업데이트되었는지 확인한다.

## Acceptance Criteria

```bash
# 1. 의존성 설치 성공 확인
npm install
# → 에러 없이 완료

# 2. node_modules 폴더 생성 확인
ls -la node_modules/ | head -20

# 3. package-lock.json 생성 확인
ls -la package-lock.json

# 4. 필수 패키지 설치 확인
npm list zustand framer-motion tailwindcss vitest
# → 모두 나열되어야 함
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `npm install` 실행 시 에러가 없는지 확인
3. 주요 패키지들이 올바른 버전으로 설치되었는지 확인:
   - zustand: 최신 stable (4.x)
   - framer-motion: 최신 stable (10.x)
   - tailwindcss: 최신 stable (3.x)
   - vitest: 최신 stable (1.x)
4. 결과에 따라 `phases/0-setup/index.json`의 step 1을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "필수 의존성(zustand, framer-motion) 및 개발 도구(tailwind, vitest, eslint) 설치 완료"`
   - 실패 (3회 시도 후) → `"status": "error"`, `"error_message": "의존성 설치 실패: [에러 메시지]"`

## 금지사항

- `npm install -g`로 글로벌 설치하지 마라. 모든 의존성은 프로젝트 로컬에 설치되어야 한다.
- `package.json`의 버전을 임의로 고정하지 마라. `^` 또는 `~` prefix를 유지하여 minor/patch 업데이트를 허용하라.
- `node_modules/`를 git에 커밋하지 마라. `.gitignore`에 이미 포함되어 있어야 한다.
- Phase 0에 불필요한 패키지(husky, playwright)를 설치하지 마라. 각 Phase에 맞는 의존성만 설치한다.
