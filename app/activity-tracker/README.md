# 📊 Activity Tracker (Part 1)

## 🧠 프로젝트 소개

사용자 행동 이벤트를 수집하고,  
이를 기반으로 사용자 상태를 계산하여 시각화하는 대시보드 시스템입니다.

이벤트 데이터를 단순 저장하는 것이 아니라,  
**사용자의 현재 상태를 정의하고 해석하는 것**에 초점을 맞췄습니다.

---

## 🔄 아키텍처 흐름

```
[ 이벤트 발생 ]
     │
     ▼
[ 가중치 적용 ]         click: 1점 / login: 3점
     │
     ▼
[ 시간 감쇠 적용 ]      score × e^(-λ × timeDiff)
     │
     ▼
[ score 계산 ]          이벤트들의 누적 합산
     │
     ▼
[ 상태 분류 ]           Active / Idle / Churn
     │
     ▼
[ 추천 액션 생성 ]      score + 마지막 활동 시간 기반
     │
     ▼
[ Dashboard 시각화 ]
```

---

## 🧮 핵심 로직 — score 계산

```ts
score = Σ (weight × e^(-λ × timeDiff))
```

| 항목 | 설명 |
|------|------|
| `weight` | 이벤트 종류별 중요도 (login > click) |
| `λ (LAMBDA)` | 시간 감쇠 계수 — 오래된 이벤트일수록 score 감소 |
| `timeDiff` | 현재 시간 - 이벤트 발생 시간 (ms) |

→ **최근에 자주 활동한 사용자일수록 높은 score**를 가집니다.

---

## 📊 상태 분류 기준

| 상태 | 조건 |
|------|------|
| `Active` | score ≥ 1.5 이상 또는 최근 활동 있음 |
| `Idle` | 활동이 뜸하거나 score 낮음 |
| `Churn` | 장시간 비활동 |

---

## 🎯 추천 액션 생성

score와 마지막 활동 시간을 조합해 추천 메시지를 생성합니다.

| 조건 | 추천 |
|------|------|
| score > 1.5 + 5분 이내 활동 | 🔥 프리미엄 기능 추천 |
| score > 0.3 + 30분 이내 활동 | 🙂 추가 기능 사용 유도 |
| 30분 이상 비활동 | ⚠️ 리텐션 알림 필요 |

---

## 🎨 주요 기능

- 사용자 이벤트 생성 (click / login)
- 시간 감쇠 기반 score 자동 계산
- 상태 자동 분류 (Active / Idle / Churn)
- 상태별 분포 시각화 (카운트 + 퍼센트 + 분포 바)
- 실시간 데이터 갱신 (Polling 3초)
- 상태 필터 및 정렬 기능

---

## 🗂️ 프로젝트 구조

```
app/activity-tracker/
├── components/
│   ├── Dashboard/       # 유저 상태 대시보드
│   ├── EventPanel/      # 이벤트 발생 패널
│   └── ui/              # 공통 UI 컴포넌트
├── domain/
│   ├── user.ts          # User 타입 정의
│   ├── userScore.ts     # score 계산 로직
│   ├── userStatus.ts    # 상태 분류 로직
│   ├── userMapper.ts    # API → Domain 변환
│   ├── recommendation.ts# 추천 액션 생성
│   └── mockUsers.ts     # 초기 목업 데이터
├── hooks/
│   └── useUsers.ts      # 유저 데이터 훅
└── styles/
```

---

## 🛠️ 기술 스택

| 기술 | 선택 이유 |
|------|-----------|
| Next.js + TypeScript | 도메인 로직을 타입 안전하게 설계하기 위해 |
| Node.js REST API | 이벤트 저장 및 유저 상태 조회 |
| CSS Module | 컴포넌트 스코프 스타일 관리 |

---

## 🔗 연결

이 프로젝트는 **Part 2 — Behavior CRM**의 기반 데이터로 활용됩니다.

> Active / Idle / Churn 상태 데이터 → 세그먼트 생성 → 자동화 캠페인 실행