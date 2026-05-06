# Step 0: project-init

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 0 섹션)
- `/docs/ARCHITECTURE.md` (디렉토리 구조 섹션)
- `/docs/ADR.md` (ADR-001: React + Vite)
- `/CLAUDE.md` (기술 스택 및 개발 프로세스)

## 작업

Vite를 사용하여 React + TypeScript 프로젝트를 초기화한다.

### 1. 기존 파일 백업

현재 프로젝트 루트에는 docs/, scripts/, .claude/ 폴더와 CLAUDE.md, .gitignore가 존재한다. 이들을 유지하면서 Vite 프로젝트를 구성해야 한다.

### 2. Vite 프로젝트 초기화

**주의**: `npm create vite@latest`은 새 디렉토리를 생성하므로, 현재 위치에 직접 설치하는 방법을 사용한다.

```bash
# 임시 디렉토리에 Vite 프로젝트 생성
npm create vite@latest temp-vite -- --template react-ts

# 필요한 파일만 현재 디렉토리로 복사
cp -r temp-vite/src ./
cp temp-vite/index.html ./
cp temp-vite/package.json ./
cp temp-vite/tsconfig.json ./
cp temp-vite/tsconfig.node.json ./
cp temp-vite/vite.config.ts ./
cp temp-vite/public ./public 2>/dev/null || mkdir public

# .gitignore 병합 (기존 내용 유지하면서 Vite 항목 추가)
cat temp-vite/.gitignore >> .gitignore

# 임시 디렉토리 삭제
rm -rf temp-vite
```

### 3. 기본 디렉토리 구조 생성

ARCHITECTURE.md에 정의된 폴더 구조를 미리 생성한다:

```bash
mkdir -p src/{components,engine,data,store,hooks,types,utils,styles}
mkdir -p src/components/{layout,canvas,blocks,ui,screens}
```

### 4. 기존 .gitignore 정리

중복 항목을 제거하고 정리한다.

### 5. package.json 프로젝트 정보 수정

- `name`: "inhalearn"
- `version`: "0.1.0"
- `description`: "고등학생을 위한 블록 코딩 학습 플랫폼"

## Acceptance Criteria

```bash
# 1. 프로젝트 구조 확인
ls -la src/
# src/, index.html, package.json, vite.config.ts 존재 확인

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
# → localhost:5173 접속 가능 확인 (Vite 기본 화면)
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `npm run dev` 실행 후 브라우저에서 http://localhost:5173 접속 확인
3. Vite + React 기본 화면이 표시되는지 확인
4. 기존 docs/, scripts/, .claude/ 폴더가 그대로 남아있는지 확인
5. 결과에 따라 `phases/0-setup/index.json`의 step 0을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "Vite React-TS 프로젝트 초기화 및 폴더 구조 생성 완료"`
   - 실패 (3회 시도 후) → `"status": "error"`, `"error_message": "구체적 에러 내용"`

## 금지사항

- 기존 docs/, scripts/, .claude/ 폴더를 삭제하지 마라. 이들은 프로젝트 문서 및 자동화 스크립트이다.
- CLAUDE.md, .gitignore 파일을 덮어쓰지 마라. 병합 또는 추가만 허용된다.
- `npm create vite@latest .`으로 현재 디렉토리에 직접 생성하지 마라. 기존 파일이 덮어써질 수 있다.
- src/ 폴더 안에 불필요한 예제 파일(App.css, logo.svg 등)을 남기지 마라. 깔끔한 구조를 유지하라.
