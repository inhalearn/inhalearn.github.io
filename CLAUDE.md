# 프로젝트: 인하런 (InhaLearn)

## 기술 스택
- React 18 + TypeScript (strict mode)
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- Zustand (상태 관리)
- Framer Motion (애니메이션)
- GitHub Pages (배포)

## 아키텍처 규칙
- CRITICAL: 모든 게임 로직은 `engine/` 폴더에 순수 함수로 구현. React 의존성 금지.
- CRITICAL: 상태 관리는 3개 Zustand store로 분리 (codeStore, levelStore, progressStore). 컴포넌트에서 직접 localStorage 접근 금지.
- CRITICAL: 블록 타입은 `types/block.ts`에 정의된 타입만 사용. 임의로 새 블록 추가 금지.
- 컴포넌트는 Presenter/Container 패턴으로 분리. UI 로직과 비즈니스 로직 분리.
- **렌더링 전략**:
  - 격자/배경: Canvas API 또는 CSS Grid (정적 요소)
  - 인덕이 애니메이션: Framer Motion의 motion.div (이동, 스케일, 회전)
  - 이동 경로 그리기: Canvas drawLine 또는 SVG path
  - UI 애니메이션: Framer Motion (모달, 버튼, 별)
- 모든 애니메이션은 0.3초 이내. 60fps 유지.

## 개발 프로세스
- CRITICAL: 새 기능 구현 시 `/docs/` 문서 (PRD, ARCHITECTURE, ADR, UI_GUIDE)를 먼저 읽고 설계 의도 파악.
- CRITICAL: 블록 추가/수정 시 반드시 `data/levels.ts`에서 해당 레벨의 `availableBlocks`도 업데이트.
- CRITICAL: UI 변경 시 UI_GUIDE.md의 색상, 크기, 애니메이션 규칙 준수.
- 커밋 메시지는 conventional commits 형식 (feat:, fix:, docs:, style:, refactor:)
- Phase 분할: MVP (레벨 0-2) → 완성 (레벨 3-7) → 다듬기 (사운드, 최적화)

## 명령어
```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 미리보기
npm run lint     # ESLint
```

## 핵심 개념

### 블록 시스템
- 이동 블록: `move-up`, `move-down`, `move-left`, `move-right`
- 제어 블록: `repeat` (children 포함, 중첩 가능)
- 스타일 블록: `color`, `pen-up`, `pen-down`

### 실행 플로우
1. 사용자가 블록 추가 → `codeStore.addBlock()`
2. "실행" 버튼 클릭 → `BlockInterpreter.execute(blocks)` (속도 조절 가능)
3. Turtle이 순차 이동 → Animator가 애니메이션
4. 에러 발생 시 → 구체적 블록 위치 표시 (Phase 1 개선)
5. Validator가 정답 체크 → 별점 계산
6. `progressStore.completeLevel(stars)` → localStorage 저장

### 스테이지 구성 (Phase 1 개선)
- 총 6개 핵심 스테이지 (0-5)
- 예상 소요 시간: 약 8분 (여유 있음)
- Phase 2에서 보너스 스테이지 추가

### 스테이지 2 "능동적 발견 전략" (핵심! Phase 1 개선)
- 블록 5개 수동 추가 (10개 → 5개로 감소, 이탈 방지)
- 완료 후 "💡 발견! 더 쉬운 방법이 있을까요?" 메시지
- [힌트 보기] vs [계속하기] 선택권 부여 (능동성)
- 반복 블록 소개 → 5줄을 2줄로 압축
- 프로그래밍의 본질(귀찮은 일을 줄이는 것) + 발견의 기쁨

### Phase 1 개선 사항
- 랜딩 페이지 + 20초 인터랙티브 데모
- 실행 속도 조절 (보통/빠르게/건너뛰기)
- 에러 피드백 개선 (N번째 블록에서 오류)
- 학생 화면 진행 표시 (선생님이 멀리서 확인)

### Phase 2 (추후 구현)
- Firebase 교사 대시보드 (실시간 진행도)
- PWA 오프라인 지원
- 뱃지 시스템
- 보너스 스테이지

## 디자인 규칙
- 인하대 스카이블루 (#0099CC) 메인 컬러
- 모바일 우선 (세로 모드 최적화)
- 터치 타겟 최소 44px
- 애니메이션 최대 0.5초, 60fps
- 인덕이(오리) 캐릭터 필수

## 금지 사항
- ❌ 인하대 공식 사이트 느낌 (우리는 학생 프로젝트)
- ❌ 다크모드 (라이트 모드만)
- ❌ 작은 버튼 (44px 미만)
- ❌ 서버 사용 (GitHub Pages 정적 호스팅만)
- ❌ 조건문(if) 블록 (MVP에서 제외, 시간 부족)
- ❌ 회전/각도 (상하좌우만 사용)
- ❌ 글래스모피즘 (backdrop-filter: blur)
- ❌ 과도한 애니메이션 (배터리 소모)

## 기본 검증 체크리스트

### 코드 작성 전
```bash
# 1. engine/ 폴더는 React import 금지
grep -r "from 'react'" src/engine/
# → 결과 없어야 함

# 2. any 타입 사용 금지
npm run lint
# → @typescript-eslint/no-explicit-any 에러 없어야 함

# 3. 빌드 성공 확인
npm run build
# → dist/ 생성되어야 함
```

### 필수 제한값
```typescript
// 무한 루프 방지
MAX_ITERATIONS = 1000      // 최대 이동 횟수
MAX_BLOCKS = 50            // 최대 블록 개수
MAX_REPEAT_COUNT = 10      // 반복 횟수 (1-10)
MAX_REPEAT_DEPTH = 3       // 중첩 깊이

// 격자 크기
MIN_GRID_SIZE = 3
MAX_GRID_SIZE = 10
```

### 필수 에러 처리
```typescript
// 1. localStorage 실패 시 → console.warn + 계속 진행
// 2. 블록 실행 실패 시 → errorBlockIndex 반환
// 3. 무한 루프 감지 시 → 중단 + 경고
// 4. 타입 검증 → 타입 가드 사용
```

### PR 전 체크리스트
- [ ] `npm run lint` 통과
- [ ] `npm run build` 성공
- [ ] engine/ 폴더 React import 없음
- [ ] any 타입 사용 없음
- [ ] console.log 제거 (warn/error만 남김)
