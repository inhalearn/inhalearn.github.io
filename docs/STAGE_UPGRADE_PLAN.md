# 인하런 스테이지 업그레이드 기획안

> INHA University KDD Lab CS101 강의 슬라이드 분석 기반  
> 대상: 고교 1·2학년 (10~11학년)  
> 작성일: 2026-05-06

---

## 분석 대상 자료

| 파일 | 내용 |
|------|------|
| `4. [Python]Python_Programming_with_Robots.pdf` | cs1robots 라이브러리 기초, Hubo 로봇 세계, 5가지 실습 과제 |
| `5. [Python]Conditionals and If Statements.pdf` | if/elif/else 기초, 비교·논리·멤버십 연산자, 조건부 로봇 제어 |
| `6. [Python]While_Loops_vs_For_Loops.pdf` | while/for 루프 비교, break/continue, range(), 로봇과 while 루프 통합 |

---

## PDF 4 분석: Python Programming with Robots

### 핵심 개념

| 개념 | 인하런 적용 가능성 | 비고 |
|------|-------------------|------|
| `move()` — 한 칸 전진 | ✅ 이미 구현 | `move-up/down/left/right` |
| `turn_left()` — 왼쪽으로 90° 회전 | ✅ 방향 변경 내재 | 블록이 방향을 포함 |
| `drop_beeper()` / `pick_beeper()` | 🆕 아이템 블록 신규 | Phase 2 후보 |
| `set_trace()` — 이동 경로 그리기 | ✅ 이미 구현 | `pen-up/pen-down` 유사 |
| 함수 재사용 (`turn_right = 3× turn_left`) | ✅ repeat 블록으로 표현 | "Do NOT repeat yourself!" |
| for 루프 (`for i in range(n)`) | ✅ 이미 구현 | `repeat` 블록 |
| 중첩 for 루프 | ✅ 이미 구현 | `repeat` 안에 `repeat` |
| ZigZag 패턴 (행 단위 이동 후 방향 전환) | ✅ 스테이지 설계 가능 | |
| 계단형 패턴 (Newspaper delivery) | ✅ 스테이지 설계 가능 | |
| 전체 격자 수집 (Harvest) | 🆕 아이템 블록 필요 | |

### PDF 4 기반 스테이지 아이디어

#### A. 허들 점프 (Hurdle Jump)
- **모티프**: PDF4 Task 2 — Hurdle (장애물 위 점프)
- **핵심 학습**: repeat 블록의 필요성 체감
- **시나리오**: 인덕이가 운동장에서 허들 경기를 준비한다. 5개의 허들(장애물)을 모두 넘어야 한다.
- **격자 구성**: 8×3, 장애물이 2칸 간격으로 배치
- **블록 구성**:
  ```
  repeat(5) {
    move-right × 1
    move-up × 1
    move-right × 1
    move-down × 1
  }
  ```
- **"아하!" 순간**: 5번 반복되는 패턴을 repeat로 압축할 때
- **별점 기준**: ⭐ 완주, ⭐⭐ repeat 사용, ⭐⭐⭐ 최소 블록 수

---

#### B. 지그재그 청소부 (ZigZag Cleaner)
- **모티프**: PDF4 Task 1 — ZigZag (전체 격자 순회)
- **핵심 학습**: 중첩 repeat (repeat 안에 repeat)
- **시나리오**: 인덕이가 운동장을 청소한다. 한 줄씩 가로로 이동하며 전체를 순회해야 한다.
- **격자 구성**: 5×4
- **블록 구성**:
  ```
  repeat(4) {
    repeat(4) { move-right }
    move-down × 1
    repeat(4) { move-left }
    move-down × 1
  }
  ```
- **"아하!" 순간**: 행마다 반복되는 패턴 → 중첩 repeat로 전체 격자를 2줄로 표현
- **연결 개념**: 수학 이중합(∑∑) — 고1 수학과 연계 가능

---

#### C. 계단 배달부 (Staircase Delivery)
- **모티프**: PDF4 Task 3 — Newspaper delivery (계단형 이동)
- **핵심 학습**: repeat + 패턴 인식
- **시나리오**: 인덕이가 계단식 아파트에 신문을 배달한다. 계단을 따라 올라가며 각 층에 신문을 놓는다.
- **격자 구성**: 6×6 계단형
- **블록 구성**:
  ```
  repeat(5) {
    move-right × 1
    move-up × 1
    pen-down (아이템 놓기)
    pen-up
  }
  ```
- **"아하!" 순간**: 5층 계단 패턴이 완전히 동일함을 발견
- **스토리텔링 포인트**: "매일 아침 배달하는 루틴 = 반복문"

---

#### D. 도형 그리기 강화 (Shape Drawing — "Do NOT repeat yourself!")
- **모티프**: PDF4의 핵심 철학 "Do NOT repeat yourself!"
- **핵심 학습**: 정사각형 → 정오각형 → 정육각형을 반복 횟수만 바꿔 해결
- **시나리오**: 인덕이가 운동장에 도형을 그린다. 코드를 최대한 짧게 만들어야 한다.
- **블록 구성**:
  ```
  repeat(4) { move-right + pen-draw }  // 정사각형
  repeat(5) { ... }                     // 정오각형
  repeat(6) { ... }                     // 정육각형
  ```
- **도전 과제**: 정삼각형은 어떻게 그릴까? (turn 방향 응용)
- **연결 개념**: 수학 정다각형 내각의 합 — 고1 기하 연계

---

## PDF 5 분석: Conditionals and If Statements

### 핵심 개념

| 개념 | 인하런 적용 가능성 | 비고 |
|------|-------------------|------|
| `if` 조건문 기초 | 🔮 Phase 2 신규 블록 | MVP 제외, 이후 추가 |
| `elif` (else if 간소화) | 🔮 Phase 2 신규 블록 | |
| `else` | 🔮 Phase 2 신규 블록 | |
| `==`, `!=`, `<`, `>` 비교 연산자 | 🔮 Phase 2 (값 비교 조건) | |
| `and`, `or`, `not` 논리 연산자 | 🔮 Phase 2 | |
| `in` 멤버십 연산자 | ❌ 블록 시스템과 무관 | |
| `on_beeper()` — 아이템 위에 있는지 감지 | 🆕 센서 블록 신규 | Phase 2 핵심 |
| `front_is_clear()` — 앞이 막혔는지 감지 | 🆕 센서 블록 신규 | Phase 2 핵심 |
| `left_is_clear()`, `right_is_clear()` | 🆕 센서 블록 신규 | Phase 2 |
| 비대칭 격자에서 조건부 수집 (Harvest More) | 🆕 if + 아이템 블록 필요 | Phase 2 |
| 빈 칸 채우기 (Plant) | 🆕 if + 아이템 블록 필요 | Phase 2 |

### PDF 5 기반 스테이지 아이디어

#### E. 아이템 수집가 (Item Collector) — `if` 첫 만남
- **모티프**: PDF5 Harvest More Task — 불규칙 격자에서 조건부 수집
- **핵심 학습**: `if` 조건문 첫 소개 — "인덕이가 판단할 수 있다!"
- **시나리오**: 인덕이가 들판에서 별을 모은다. 별이 있는 칸에서만 줍는다.
- **격자 구성**: 5×3, 별이 랜덤 배치
- **블록 구성**:
  ```
  repeat(5) {
    if (on_item) { pick }
    move-right
  }
  ```
- **"아하!" 순간**: 모든 칸에서 줍는 게 아니라 "있을 때만" 줍는 조건부 동작
- **교육 포인트**: if = 로봇이 스스로 판단함 → 더 똑똑해짐

---

#### F. 미로 탈출 (Maze Escape) — `if-elif-else` 체인
- **모티프**: PDF5 전체 탐색 패턴 (`front_is_clear()` → `left_is_clear()` → `right_is_clear()`)
- **핵심 학습**: 우선순위 조건 체인 (elif)
- **시나리오**: 인덕이가 미로 속에서 출구를 찾는다. 앞이 막히면 오른쪽, 오른쪽도 막히면 왼쪽으로.
- **블록 구성**:
  ```
  repeat(10) {
    if (front_clear) { move-forward }
    elif (right_clear) { turn-right + move }
    elif (left_clear) { turn-left + move }
    else { turn-around }
  }
  ```
- **"아하!" 순간**: elif의 순서가 결과를 바꾼다 → 알고리즘 순서의 중요성
- **연결 개념**: 그래프 탐색 알고리즘 (BFS/DFS) 맛보기

---

#### G. 가위바위보 심판 — Python 텍스트 코딩 브릿지
- **모티프**: PDF5 Rock-Paper-Scissors Task
- **핵심 학습**: 블록 → Python 텍스트 코드로의 전환 경험
- **시나리오**: 지금까지 배운 블록 코딩을 Python 텍스트로 바꿔보는 챌린지
- **특이점**: 이 스테이지는 "블록 코딩 → 텍스트 코딩" 전환 스테이지
- **블록 구성**:
  ```
  if (player1 == "rock" and player2 == "scissors") { player1_win }
  elif (player1 == "scissors" and player2 == "paper") { player1_win }
  ...
  ```
- **교육 포인트**: 인하대 CS101에서 배울 Python이 바로 이것! → 대학 연계 동기부여

---

#### H. 농장 정리 (Farm Sorting) — `not` 논리 연산자
- **모티프**: PDF5 Plant Task — 빈 칸에 씨앗 심기
- **핵심 학습**: `not` 연산자 (없을 때 심기)
- **시나리오**: 인덕이가 텃밭을 정리한다. 아직 씨앗이 없는 칸에만 씨앗을 심는다.
- **블록 구성**:
  ```
  repeat(grid) {
    if (not on_item) { drop }
    move-right
  }
  ```
- **"아하!" 순간**: `if not` = 부정 조건 → 논리의 반전
- **연결 개념**: 수학 집합의 여집합 (고1 집합 단원 연계)

---

## 전체 스테이지 로드맵

### Phase 1: 현재 MVP 개선 (스테이지 0–5)

| 스테이지 | 제목 | 핵심 개념 | 예상 소요 |
|---------|------|----------|---------|
| 0 | 인덕이 첫 걸음 | move 블록 1개 | 1분 |
| 1 | 목적지까지 | move 조합 | 2분 |
| 2 | 더 쉬운 방법? | repeat 소개 ("발견의 기쁨") | 3분 |
| 3 | **허들 점프** (신규 A) | repeat 필요성 체감 | 3분 |
| 4 | **지그재그 청소부** (신규 B) | 중첩 repeat | 4분 |
| 5 | **계단 배달부** (신규 C) | 패턴 인식 + repeat | 3분 |

**Phase 1 총 예상 소요: 약 16분**

---

### Phase 2: 조건문 확장 (스테이지 6–9)

| 스테이지 | 제목 | 핵심 개념 | 신규 블록 |
|---------|------|----------|---------|
| 6 | **아이템 수집가** (신규 E) | `if` 첫 만남 | `if`, `on_item` 센서 |
| 7 | **미로 탈출** (신규 F) | `if-elif-else` 체인 | `elif`, `front_clear` 센서 |
| 8 | **농장 정리** (신규 H) | `not` 논리 연산자 | `not` 연산자 |
| 9 | **Python 브릿지** (신규 G) | 블록 → 텍스트 전환 | (텍스트 편집기 패널) |

---

## 고교 1·2학년 학생 연결 포인트

### 교과 연계

| 인하런 개념 | 연계 교과목 | 구체적 단원 |
|-----------|-----------|-----------|
| repeat (반복문) | 수학 | 수열, 점화식 (수학 I) |
| 중첩 repeat | 수학 | 이중합 ∑∑ (수학 II) |
| if 조건문 | 수학 | 명제와 조건 (고1 집합과 명제) |
| `not` 연산자 | 수학 | 여집합, 부정명제 |
| 도형 그리기 | 수학 | 정다각형 내각의 합 (기하) |
| 미로 탐색 알고리즘 | 정보·컴퓨터 | 알고리즘 기초 |

### 진로 연계 멘트 (스테이지 완료 시 표시)

- **스테이지 3 완료**: "게임 개발자들은 이 패턴으로 캐릭터 점프를 만들어요 🎮"
- **스테이지 4 완료**: "로봇 청소기(룸바)가 바로 이 지그재그 알고리즘을 사용해요 🤖"
- **스테이지 6 완료**: "AI가 데이터를 분류하는 것도 수많은 if 문의 조합이에요 🧠"
- **스테이지 9 완료**: "인하대 CS101에서 이 코드를 직접 Python으로 작성하게 될 거예요 🎓"

---

## Phase 2 신규 블록 명세 (예비)

### `if` 블록
```typescript
interface IfBlock extends Block {
  type: 'if';
  condition: ConditionType;  // 'on_item' | 'front_clear' | 'left_clear' | 'right_clear'
  children: Block[];         // then 분기
  elseChildren?: Block[];    // else 분기 (선택)
}
```

### 센서 조건 타입
```typescript
type ConditionType =
  | 'on_item'        // 현재 칸에 아이템 있음
  | 'front_clear'    // 앞이 비어있음
  | 'left_clear'     // 왼쪽이 비어있음
  | 'right_clear'    // 오른쪽이 비어있음
  | 'not_on_item'    // 현재 칸에 아이템 없음 (not 연산자)
```

### 아이템 블록
```typescript
interface ItemBlock extends Block {
  type: 'pick' | 'drop';  // 줍기 / 놓기
}
```

---

## 구현 우선순위

### 즉시 구현 가능 (Phase 1 — 신규 블록 불필요)
1. **스테이지 A: 허들 점프** — 기존 move + repeat 블록만으로 구현 가능
2. **스테이지 B: 지그재그 청소부** — 기존 중첩 repeat로 구현 가능
3. **스테이지 C: 계단 배달부** — 기존 move + repeat로 구현 가능
4. **스테이지 D: 도형 그리기 강화** — 기존 pen-down + repeat로 구현 가능

### Phase 2 구현 필요 (신규 블록 추가)
5. **스테이지 E: 아이템 수집가** — `if` 블록 + `pick` 블록 신규 필요
6. **스테이지 F: 미로 탈출** — `elif` + 센서 조건 블록 신규 필요
7. **스테이지 H: 농장 정리** — `not_on_item` 조건 신규 필요
8. **스테이지 G: Python 브릿지** — 텍스트 편집기 패널 신규 필요 (가장 복잡)

---

## PDF 6 분석: While Loops vs For Loops

### 핵심 개념

| 개념 | 인하런 적용 가능성 | 비고 |
|------|-------------------|------|
| `for i in range(n)` — 고정 횟수 반복 | ✅ 이미 구현 | 기존 `repeat` 블록 |
| `while condition` — 조건부 반복 | 🔮 Phase 2 신규 블록 | **핵심 신규 개념** |
| `while not condition` — 조건 충족 전까지 반복 | 🔮 Phase 2 | `while not on_beeper` 패턴 |
| `while True` — 무한 루프 | ❌ 인하런 미지원 (무한 루프 방지 규칙) | MAX_ITERATIONS 존재 |
| `break` — 루프 즉시 탈출 | 🔮 Phase 2 고급 | while과 함께 사용 |
| `continue` — 현재 반복 건너뜀 | 🔮 Phase 2 고급 | |
| `range(start, stop, step)` — 세 파라미터 | ✅ repeat 횟수로 표현 | |
| 중첩 for+while | 🔮 Phase 2 | for 안에 while 조합 |
| `hubo.carries_beepers()` — 아이템 소유 여부 | 🆕 아이템 상태 센서 신규 | Phase 2 |
| `hubo.facing_north()` — 방향 감지 | ❌ 인하런 방향 고정 (상하좌우) | 해당 없음 |
| "Write code for humans" | ✅ 교육 철학으로 활용 | 블록 이름, 주석 설계 |
| "Stepwise refinement" | ✅ 단계별 힌트 설계 원칙 | |

---

### for vs while 핵심 차이 (고교생 설명용)

| 구분 | for 루프 (= 인하런 `repeat`) | while 루프 |
|------|---------------------------|-----------|
| 핵심 질문 | "몇 번 반복할까?" | "언제까지 반복할까?" |
| 종료 조건 | 횟수가 차면 자동 종료 | 조건이 False가 되면 종료 |
| 대표 예시 | "5번 앞으로 이동" | "벽에 부딪힐 때까지 이동" |
| 로봇 코드 | `for i in range(5): hubo.move()` | `while hubo.front_is_clear(): hubo.move()` |
| 인하런 블록 | `repeat(5) { ... }` | `while(front_clear) { ... }` (신규) |

> **핵심 통찰**: for = "횟수 계획형", while = "상황 반응형". 실제 로봇/AI는 while을 훨씬 많이 사용함.

---

### PDF 6 기반 스테이지 아이디어

#### I. 스마트 허들 (Smart Hurdles) — `while` 첫 만남
- **모티프**: PDF6 Task 5 — Smart Hurdles (while 루프로 모든 허들 지도에서 동작)
- **핵심 학습**: `while` 루프의 필요성 — "허들이 몇 개인지 몰라도 된다!"
- **기존 스테이지 A와 차이**: 스테이지 A는 repeat(5)로 허들 5개 고정. 스마트 허들은 허들 수를 모름
- **시나리오**: 인덕이가 달리기를 한다. 결승선(아이템)에 도착할 때까지 허들을 계속 넘는다.
- **블록 구성**:
  ```
  while (not on_item) {
    if (front_clear) { move-right }
    else {
      move-up + move-right + move-down  // 허들 넘기
    }
  }
  ```
- **"아하!" 순간**: "허들이 3개든 10개든 같은 코드로 동작!" → while의 힘
- **별점 기준**: ⭐ 완주, ⭐⭐ while 사용, ⭐⭐⭐ 임의 허들 수 대응

---

#### J. 벽 따라가기 (Wall Follower) — `while + if` 조합
- **모티프**: PDF6 "Around the World" — 경계를 따라 순회
- **핵심 학습**: while + if 조합의 강력함 ("결합하면 더 강해진다")
- **시나리오**: 인덕이가 운동장 경계를 한 바퀴 돌아 출발점으로 돌아온다.
- **격자 구성**: 6×6, 벽으로 둘러싸인 직사각형
- **블록 구성**:
  ```
  drop(marker)      // 출발점 표시
  move
  while (not on_marker) {
    if (right_clear) { turn-right + move }
    elif (front_clear) { move }
    else { turn-left }
  }
  ```
- **"아하!" 순간**: 복잡한 경로를 단 몇 줄로 → "알고리즘"이라는 단어 처음 소개
- **진로 연결**: "로봇 청소기의 벽 따라가기 알고리즘이 바로 이것!"
- **연결 개념**: 그래프 탐색, 오른손 법칙(미로 탈출 알고리즘)

---

#### K. 쓰레기 수거 (Trash Collector) — `while carries_beepers`
- **모티프**: PDF6 Task 8 — Trash (아이템을 모아 한 곳에 버리기)
- **핵심 학습**: 루프 조건으로 "인덕이 자신의 상태" 사용
- **시나리오**: 인덕이가 길을 돌아다니며 쓰레기를 줍고, 쓰레기통에 모두 버린다.
- **블록 구성**:
  ```
  // 1단계: 쓰레기 수집 (앞으로 이동하며)
  while (front_clear) {
    if (on_item) { pick }
    move-right
  }
  // 2단계: 쓰레기통에 버리기
  while (carrying_item) {
    drop
  }
  ```
- **"아하!" 순간**: 조건이 "외부 환경"이 아닌 "내 상태" — 자기 인식 개념
- **연결 개념**: 변수(아이템 개수 카운팅) — 다음 PDF 7 주제 예고

---

#### L. 임의 크기 격자 청소 (Smart ZigZag) — while의 범용성
- **모티프**: PDF6 Task 6 — Smart ZigZag (임의 크기 격자 순회)
- **핵심 학습**: while로 "격자 크기에 상관없이 동작하는" 코드 작성
- **시나리오**: 격자 크기를 모르는 상태에서도 인덕이가 모든 칸을 청소한다.
- **블록 구성**:
  ```
  while (not at_corner) {
    while (front_clear) { move-right }   // 한 행 끝까지
    if (can_go_down) { turn + move-down + turn }
    while (front_clear) { move-left }    // 반대 방향
    if (can_go_down) { turn + move-down + turn }
  }
  ```
- **"아하!" 순간**: "10×10도, 5×3도, 어떤 크기든 같은 코드!" → 일반화(Generalization) 개념
- **교육 포인트**: AI가 데이터를 처리할 때도 이 패턴 사용

---

### 전체 스테이지 로드맵 업데이트 (PDF 6 반영)

#### Phase 2 확장: while 루프 스테이지 추가

| 스테이지 | 제목 | 핵심 개념 | 신규 블록 |
|---------|------|----------|---------|
| 6 | **아이템 수집가** (E) | `if` 첫 만남 | `if`, `on_item` 센서 |
| 7 | **미로 탈출** (F) | `if-elif-else` 체인 | `elif`, `front_clear` |
| 8 | **스마트 허들** (I) | **`while` 첫 만남** | `while` 블록 (신규) |
| 9 | **벽 따라가기** (J) | `while + if` 조합 | `while` + 마커 블록 |
| 10 | **쓰레기 수거** (K) | `while carries_item` | `carries_item` 센서 |
| 11 | **임의 격자 청소** (L) | while의 범용성 | (기존 블록 조합) |

---

### Phase 2 신규 블록 명세 추가 (PDF 6)

#### `while` 블록
```typescript
interface WhileBlock extends Block {
  type: 'while';
  condition: ConditionType;  // 기존 ConditionType + 새 조건
  children: Block[];
}

// 확장된 ConditionType
type ConditionType =
  | 'on_item'           // 현재 칸에 아이템 있음
  | 'not_on_item'       // 현재 칸에 아이템 없음
  | 'front_clear'       // 앞이 비어있음
  | 'left_clear'        // 왼쪽이 비어있음
  | 'right_clear'       // 오른쪽이 비어있음
  | 'carrying_item'     // 아이템을 소지 중 (신규, PDF 6)
  | 'not_carrying_item' // 아이템을 소지하지 않음 (신규)
  | 'on_marker'         // 마커 위에 있음 (신규, PDF 6 "Around the world")
```

#### `마커(marker)` 블록
```typescript
interface MarkerBlock extends Block {
  type: 'drop_marker' | 'pick_marker';  // 위치 기억용 특수 아이템
}
```

---

### 고교생 수업 설계 포인트 (PDF 6 특화)

#### "for vs while, 언제 뭘 쓸까?" 직관 교육

| 상황 | 쓸 루프 | 이유 |
|------|---------|------|
| "10번 점프" | for | 횟수가 정해져 있음 |
| "배가 부를 때까지 먹기" | while | 언제 끝날지 모름 |
| "시험 5문제 풀기" | for | 문제 수가 고정 |
| "시험 시간이 남을 때까지" | while | 종료 조건이 상황 의존 |
| "5칸 앞으로" | for/repeat | 거리가 고정 |
| "벽에 닿을 때까지" | while | 벽 거리를 모름 |

> 이 표를 스테이지 8 인트로 화면에 표시하면 직관적 이해 가능.

#### "Write code for humans" 철학 → 인하런 블록 네이밍 원칙
PDF 6의 핵심 메시지: **"One of the secrets of writing good, correct, elegant programs is to write them as if you wrote them for a human reader, not a computer"**

인하런 적용:
- 블록 이름: `move-right` (O) vs `action_1` (X)
- 스테이지 완료 시: "이 코드를 사람이 읽으면 이해할 수 있나요?" 질문 추가
- 별점 3개 조건: 정답 + 최소 블록 수 + **가독성** (블록 순서가 논리적)

#### Stepwise Refinement → 인하런 힌트 시스템 설계 원칙
PDF 6의 방법론: **"Start simple → Introduce small changes, one at a time"**

인하런 힌트 시스템:
1. 힌트 1: "어떤 종류의 루프를 쓸까?" (for vs while)
2. 힌트 2: "조건은 무엇인가?" (언제 멈출까)
3. 힌트 3: "조건이 맞을 때 할 일은?" (루프 본문)
4. 힌트 4: 부분 코드 제공 (`while (?) { ... }`)

---

## 참고: 원본 PDF 핵심 인용구

> **PDF 4**: "Do NOT repeat yourself!"  
> → 반복문 교육의 핵심 동기. 스테이지 D 완료 시 이 메시지를 보여줄 것.

> **PDF 5**: "elif combines else and if without complicated indentation"  
> → elif 소개 시 이 설명을 UI 툴팁으로 활용.

> **PDF 5**: Hubo 로봇 센서 철학 — "로봇은 스스로 판단할 수 있다"  
> → 스테이지 6(아이템 수집가) 인트로 나레이션으로 활용.

> **PDF 6**: "A for-loop repeats some instructions a fixed number of times. A while-loop repeats instructions as long as some condition is true"  
> → 스테이지 8(스마트 허들) 인트로에서 for vs while 대조 설명으로 활용.

> **PDF 6**: "Write code for humans, not computers"  
> → 인하런 블록 설계 철학. 블록 이름, 툴팁, 에러 메시지 모두 이 원칙 적용.

> **PDF 6**: "Start simple. Introduce small changes, one at a time." (Stepwise refinement)  
> → 스테이지 힌트 시스템 설계 원칙. 한 번에 한 가지씩만 가르친다.
