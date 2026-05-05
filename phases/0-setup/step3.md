# Step 3: test-setup

## 읽어야 할 파일

먼저 아래 파일들을 읽고 테스트 환경 요구사항을 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 0 - 7, 8번 섹션)
- `/docs/ARCHITECTURE.md` (테스트 전략 섹션)
- `/CLAUDE.md` (기본 검증 체크리스트)
- 이전 step에서 생성된 `vite.config.ts`, `package.json`

## 작업

Vitest 테스트 환경을 구축하고 package.json 스크립트를 완성한다.

### 1. vite.config.ts 업데이트

테스트 설정을 포함하도록 수정:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/', 'dist/'],
    },
  },
});
```

### 2. 테스트 셋업 파일 생성

**src/test/setup.ts** 생성:

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// jest-dom matchers 추가
expect.extend(matchers);

// 각 테스트 후 정리
afterEach(() => {
  cleanup();
});
```

### 3. package.json 스크립트 추가

`package.json`의 `scripts` 섹션에 다음 스크립트들을 추가:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

**주의**: Vite 템플릿의 기본 스크립트(dev, build, preview)는 유지하되, 나머지를 추가한다.

### 4. 간단한 테스트 파일 생성 (검증용)

**src/App.test.tsx** 생성:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeDefined();
  });
});
```

**src/App.tsx** 수정 (테스트 통과를 위해):

기존 Vite 템플릿의 App.tsx를 간단하게 수정:

```typescript
function App() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-inha-blue">인하런</h1>
        <p className="mt-4 text-gray-600">고등학생을 위한 블록 코딩 학습 플랫폼</p>
      </div>
    </main>
  );
}

export default App;
```

### 5. @types/node 설정 확인

`tsconfig.node.json`이 올바르게 설정되어 있는지 확인 (path alias 사용을 위해).

## Acceptance Criteria

```bash
# 1. 린트 검사
npm run lint
# → 에러 0개 (경고는 허용)

# 2. 빌드 성공
npm run build
# → dist/ 폴더 생성

# 3. 테스트 실행
npm run test:unit
# → App.test.tsx 통과

# 4. 전체 검증
npm run lint && npm run build
# → 모두 성공
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `npm run lint` 실행 시 에러가 0개인지 확인 (경고는 허용)
3. `npm run build` 실행 시 dist/ 폴더가 생성되고, index.html과 assets/가 포함되어 있는지 확인
4. `npm run test:unit` 실행 시 1개 테스트가 통과하는지 확인
5. `npm run dev` 실행 후 브라우저에서 "인하런" 제목이 인하대 블루 색상으로 표시되는지 확인 (Tailwind 동작 확인)
6. 결과에 따라 `phases/0-setup/index.json`의 step 3을 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "Vitest 테스트 환경, package.json 스크립트, 빌드/린트 파이프라인 구축 완료"`
   - 실패 (3회 시도 후) → `"status": "error"`, `"error_message": "테스트 환경 구축 실패: [에러 메시지]"`
7. Phase 0 완료 시 `phases/index.json`의 "0-setup" status를 "completed"로 변경

## 금지사항

- vite.config.ts에서 `test` 섹션을 누락하지 마라. Vitest 설정이 필수이다.
- coverage provider를 'istanbul' 대신 'v8'로 설정해야 한다. v8이 더 빠르고 정확하다.
- src/test/setup.ts를 생략하지 마라. @testing-library/jest-dom matchers가 모든 테스트에서 필요하다.
- package.json에서 `"test": "vitest"`라고만 쓰지 마라. `test:unit`, `test:watch` 등 명확한 이름을 사용하라.
- `npm run build` 전에 `tsc` 타입 체크를 실행하지 않으면 런타임 에러가 발생할 수 있다. 반드시 `tsc && vite build` 순서를 지켜라.
- Phase 0에서 E2E 테스트(Playwright)를 설정하지 마라. Phase 6에서 추가한다.
