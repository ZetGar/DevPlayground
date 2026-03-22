# 📬 Behavior CRM System (Part 2)

## 🧠 프로젝트 개요

Activity Tracker(Part 1)에서 계산된 사용자 상태 데이터를 기반으로  
세그먼트를 생성하고, 조건에 맞는 유저에게 자동화 액션을 실행하는 CRM 시스템입니다.

단순 메시지 발송에 그치지 않고,  
**캠페인 실행 전후의 상태 변화를 추적하여 전환율을 측정**하는 구조까지 구현했습니다.

---

## 🔄 전체 흐름

```
[ Part 1 ]                          [ Part 2 ]
이벤트 발생 → 상태 계산    →    세그먼트 생성 → 캠페인 실행 → 상태 변화 추적
(Active/Idle/Churn)              (조건 기반)     (자동화 액션)   (전환율 측정)
```

---

## 🧩 핵심 기능

### 1. 세그먼트 시스템
조건을 조합하여 유저 그룹을 정의합니다.

| 조건 필드 | 연산자 | 예시 |
|-----------|--------|------|
| status | == | status == "Churn" |
| score | < | score < 0.5 |
| lastActiveDaysAgo | > | lastActiveDaysAgo > 3 |

- 조건 여러 개를 AND로 조합 가능
- 세그먼트 생성 / 삭제

---

### 2. 캠페인 빌더
세그먼트 + 트리거 + 액션을 연결하는 자동화 시스템입니다.

```
IF   유저가 [세그먼트] 조건에 해당하면
THEN [액션] 실행
```

| 트리거 | 설명 |
|--------|------|
| status_change | 상태가 Churn으로 변경될 때 |
| inactive_3days | 3일 이상 비활동 |
| score_below | score가 기준 이하로 떨어질 때 |

| 액션 | 설명 |
|------|------|
| send_message | 메시지 생성 |
| send_notification | 알림 전송 (mock) |
| send_email | 이메일 전송 (mock) |

---

### 3. 실행 로그 & 메시지함
캠페인 실행 결과를 기록하고 분석합니다.

- 성공 / 스킵 / 실패 결과 집계
- 캠페인별 발송 유저 목록 사이드 패널
- 실행 조건 미리보기 (IF ~ THEN)

---

### 4. 캠페인 전후 상태 변화 추적 (핵심)
캠페인 실행 시점의 상태(`beforeStatus`)를 저장하고,  
이후 이벤트 발생 시 상태(`afterStatus`)를 갱신하여 전환 여부를 측정합니다.

```
캠페인 실행 → beforeStatus: "Churn" 저장
     ↓
유저가 이벤트 발생 (Part 1에서)
     ↓
afterStatus: "Active" 갱신
     ↓
전환율 계산 (전환 유저 수 / 발송 유저 수)
```

**드로어 패널에서 확인:**
```
user-c   Churn → Active  ✅
user-d   Churn → Churn   ⏳
user-e   Churn → Active  ✅

전환율: 67%
```

---

## 🗂️ 프로젝트 구조

```
app/crm-system/
├── components/
│   ├── SegmentBuilder/    # 세그먼트 생성 / 삭제
│   ├── CampaignBuilder/   # 캠페인 빌더 UI
│   └── ExecutionLog/      # 로그 + 메시지함 + 상태 변화 추적
├── styles/
└── page.tsx

app/api/crm/
├── segments/route.ts      # GET / POST / DELETE
├── campaigns/route.ts     # GET / POST (실행 포함)
└── logs/route.ts          # GET

lib/crm/
├── types.ts               # 타입 정의
├── store.ts               # in-memory store
└── logic.ts               # evaluateSegment 로직
```

---

## 🛠️ 기술 스택

| 기술 | 선택 이유 |
|------|-----------|
| Next.js App Router | API Route로 백엔드 통합 관리 |
| TypeScript | 도메인 타입 안전성 확보 |
| in-memory store | 빠른 프로토타이핑, 구조 집중 |
| CSS Module | Part 1과 일관된 스타일 관리 |

---

## 🔗 Part 1과의 연결

| | Part 1 | Part 2 |
|-|--------|--------|
| 역할 | 이벤트 수집 + 상태 계산 | 상태 기반 자동화 |
| 핵심 | score 계산 + decay | evaluateSegment |
| 출력 | Active/Idle/Churn | 캠페인 실행 결과 |

> Part 1의 `getUserStatus`, `calculateScore`를 Part 2에서 직접 재사용합니다.

---

## 🎯 한 줄 요약

👉 유저 상태 기반으로 자동 액션을 실행하고, 캠페인 전후 상태 변화로 전환율을 측정하는 CRM 시스템