# Step 2: config-files

## 읽어야 할 파일

먼저 아래 파일들을 읽고 설정 요구사항을 파악하라:

- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 0 - 3, 4, 5, 6번 섹션)
- `/docs/ADR.md` (ADR-002: TypeScript strict mode, ADR-007: Tailwind CSS)
- `/CLAUDE.md` (아키텍처 규칙, 기본 검증 체크리스트)
- 이전 step에서 생성된 `tsconfig.json`, `package.json`

## 작업

TypeScript, ESLint, Prettier, Tailwind CSS 설정 파일을 생성한다.

### 1. Tailwind CSS 초기화 및 설정

```bash
npx tailwindcss init -p
```

위 명령으로 `tailwind.config.js`와 `postcss.config.js`가 생성된다.

**tailwind.config.js** 내용을 다음과 같이 수정:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'inha-blue': '#0099CC',
        'inha-blue-light': '#33B5E5',
        'inha-blue-dark': '#007299',
      },
    },
  },
  plugins: [],
}
```

**src/styles/globals.css** 생성 (Tailwind directives 포함):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. TypeScript 설정 업데이트

**tsconfig.json**을 IMPLEMENTATION_GUIDE.md의 설정으로 교체:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. ESLint 설정

**.eslintrc.json** 생성:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### 4. Prettier 설정

**.prettierrc** 생성:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

### 5. src/main.tsx 수정

Tailwind CSS를 import하도록 수정:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Acceptance Criteria

```bash
# 1. Tailwind 설정 확인
ls -la tailwind.config.js postcss.config.js src/styles/globals.css
# → 모든 파일 존재

# 2. TypeScript 컴파일 확인
npx tsc --noEmit
# → 에러 없음

# 3. ESLint 실행
npx eslint . --ext ts,tsx
# → 기본 파일들에 대해 에러 없음 (경고는 허용)

# 4. Prettier 포맷팅 확인
npx prettier --check "src/**/*.{ts,tsx}"
# → 포맷 문제 없음 또는 자동 수정 가능
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. `npx tsc --noEmit` 실행 시 TypeScript 에러가 없는지 확인
3. ESLint 규칙이 올바르게 적용되는지 확인:
   - `any` 타입 사용 시 에러 발생하는지 테스트
   - `console.log` 사용 시 경고 발생하는지 테스트
4. Tailwind CSS 클래스가 작동하는지 간단히 확인 (src/App.tsx에 임시로 className 추가)
5. 결과에 따라 `phases/0-setup/index.json`의 step 2를 업데이트:
   - 성공 → `"status": "completed"`, `"summary": "TypeScript strict 모드, ESLint no-any 규칙, Tailwind CSS 인하대 컬러 설정 완료"`
   - 실패 (3회 시도 후) → `"status": "error"`, `"error_message": "설정 파일 생성 실패: [에러 메시지]"`

## 금지사항

- TypeScript `strict: false`로 설정하지 마라. CLAUDE.md에 명시된 대로 strict mode 필수이다.
- ESLint에서 `@typescript-eslint/no-explicit-any: "off"`로 설정하지 마라. `any` 타입 사용 금지가 핵심 규칙이다.
- Tailwind 설정에서 인하대 브랜드 컬러(inha-blue 계열)를 누락하지 마라.
- `.eslintignore` 또는 `.prettierignore`로 중요한 파일(src/, types/ 등)을 제외하지 마라. node_modules, dist만 제외한다.
