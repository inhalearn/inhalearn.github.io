# Step 3: routing-ui

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 아키텍처와 설계 의도를 파악하라:

- `/docs/ARCHITECTURE.md` (페이지 흐름, 디렉토리 구조)
- `/docs/ADR.md` (ADR-001: React + Vite, ADR-007: Tailwind CSS, ADR-008: Framer Motion)
- `/docs/UI_GUIDE.md` (색상, 크기, 애니메이션 규칙)
- `/docs/IMPLEMENTATION_GUIDE.md` (Phase 2 > 라우팅 구조, 공통 UI)
- `src/store/codeStore.ts` (Step 0에서 생성됨)
- `src/store/progressStore.ts` (Step 1에서 생성됨)
- `src/store/levelStore.ts` (Step 2에서 생성됨)

Step 0-2에서 만든 store들을 활용하여 라우팅과 기본 UI를 구축하라. 이번 step은 **시각적 확인이 목표**이다.

## 작업

React Router로 라우팅 구조를 만들고, 기본 UI 컴포넌트를 구현한다. 아직 전체 화면은 구현하지 않고, **스켈레톤만** 만든다.

### 1. `src/App.tsx` 라우팅 구조

다음 라우트를 구현하라:

```typescript
/              → Landing (랜딩 페이지, 임시 화면)
/demo          → InteractiveDemo (임시 화면)
/levels        → LevelSelect (임시 화면)
/level/:id     → Level (임시 화면)
/completion    → Completion (임시 화면)
```

**핵심 규칙:**
- React Router v6 사용 (`react-router-dom`)
- `BrowserRouter`, `Routes`, `Route` 사용
- 각 화면은 임시 placeholder 컴포넌트 (간단한 div + 텍스트)
- Tailwind CSS 적용 (기본 스타일링)

**파일 위치**: `src/App.tsx` (기존 파일 수정)

**임시 화면 예시**:
```tsx
function Landing() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-inha-blue">인하런</h1>
        <p className="mt-4 text-gray-600">Coming soon...</p>
        <a href="/levels" className="mt-8 inline-block bg-inha-blue text-white px-6 py-3 rounded-lg">
          시작하기
        </a>
      </div>
    </div>
  );
}
```

### 2. `src/components/ui/Button.tsx` 구현

Framer Motion을 사용한 버튼 컴포넌트를 구현하라.

**인터페이스**:
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}
```

**핵심 규칙:**
- Framer Motion의 `motion.button` 사용
- `whileTap={{ scale: 0.95 }}` 애니메이션
- Tailwind CSS 클래스명으로 스타일링
- variant: primary (인하 블루), secondary (회색)
- size: sm (32px), md (44px), lg (56px) 높이
- 터치 타겟 최소 44px (CLAUDE.md 규칙)

**파일 위치**: `src/components/ui/Button.tsx`

**Tailwind 클래스 예시**:
```typescript
const baseClasses = "rounded-lg font-semibold transition-colors";
const variantClasses = {
  primary: "bg-inha-blue text-white hover:bg-inha-blue-dark",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
};
const sizeClasses = {
  sm: "h-8 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg"
};
```

### 3. `src/components/ui/Modal.tsx` 구현

Framer Motion을 사용한 모달 컴포넌트를 구현하라.

**인터페이스**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

**핵심 규칙:**
- Framer Motion의 `AnimatePresence` + `motion.div` 사용
- 배경 오버레이 (반투명 검은색)
- 중앙 정렬 컨텐츠 박스
- 페이드 인/아웃 애니메이션 (0.2초)
- ESC 키로 닫기 (선택 사항)
- 배경 클릭 시 닫기

**파일 위치**: `src/components/ui/Modal.tsx`

**애니메이션 예시**:
```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
      >
        {children}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### 4. Tailwind CSS 글로벌 스타일 추가

`src/index.css`에 다음 추가:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}

@layer components {
  .button {
    @apply rounded-lg font-semibold transition-colors;
  }

  .button-primary {
    @apply bg-inha-blue text-white hover:bg-inha-blue-dark;
  }

  .button-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }
}
```

**주의**: 인하 블루 색상이 `tailwind.config.js`에 정의되어 있는지 확인 (Phase 0에서 설정됨).

### 5. `src/main.tsx` 수정

React Router를 위한 기본 설정 확인. 필요 시 `StrictMode` 추가.

**파일 위치**: `src/main.tsx`

### 6. react-router-dom 설치 확인

```bash
npm install react-router-dom
```

이미 설치되어 있는지 확인. 없으면 설치.

## Acceptance Criteria

```bash
npm run lint
# 에러 없음

npm run build
# 빌드 성공

npm run dev
# 개발 서버 실행

# 브라우저에서 확인:
# http://localhost:5173/         → Landing 화면 표시
# http://localhost:5173/levels   → LevelSelect 화면 표시
# http://localhost:5173/level/0  → Level 화면 표시

# Button 컴포넌트 테스트 (Landing 화면에서):
# - 클릭 시 scale 애니메이션 확인
# - primary/secondary variant 스타일 확인
# - 크기 (최소 44px 높이) 확인

# Modal 컴포넌트 테스트 (임시로 Landing에 추가):
# - 모달 열기/닫기 확인
# - 배경 클릭 시 닫힘 확인
# - 애니메이션 확인
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 아키텍처 체크리스트를 확인한다:
   - ARCHITECTURE.md의 페이지 흐름(Landing → LevelSelect → Level)을 따르는가?
   - UI_GUIDE.md의 색상(인하 블루), 크기(터치 타겟 44px), 애니메이션(0.3초 이내) 규칙을 준수하는가?
   - ADR-007(Tailwind CSS)과 ADR-008(Framer Motion)을 올바르게 사용하는가?
3. 시각적 확인:
   - 브라우저에서 모든 라우트 접근 가능
   - Button과 Modal이 정상 동작
   - Tailwind CSS 스타일 적용 확인
4. 결과에 따라 `phases/2-ui-structure/index.json`의 step 3을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "라우팅 구조 및 기본 UI 완료 (5개 라우트, Button/Modal 컴포넌트, Tailwind/Framer Motion 적용)"`
   - 수정 3회 시도 후에도 실패 → `"status": "error"`, `"error_message": "구체적 에러 내용"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason": "구체적 사유"` 후 즉시 중단

## 금지사항

- **any 타입 사용 금지**. 이유: TypeScript strict mode 위반.
- **인라인 스타일 사용 금지** (style={{}}). 이유: Tailwind CSS 사용. 일관성 유지.
- **글래스모피즘 금지** (backdrop-filter: blur). 이유: CLAUDE.md 금지사항.
- **과도한 애니메이션 금지** (0.5초 초과). 이유: 배터리 소모, 사용자 경험 저하.
- **44px 미만 버튼 금지**. 이유: 터치 타겟 최소 크기 (CLAUDE.md).
- **다크모드 구현 금지**. 이유: CLAUDE.md 금지사항 (라이트 모드만).
- **전체 화면 구현하지 마라**. 이유: 이번 step은 스켈레톤만. Phase 3-5에서 구현.
- 기존 테스트를 깨뜨리지 마라.
