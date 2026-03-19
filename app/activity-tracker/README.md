# 📊 Activity Tracker (Part 1)

## 🧠 프로젝트 개요

사용자 행동 이벤트를 수집하고,
이를 기반으로 사용자 상태를 계산하여 시각화하는 시스템입니다.

단순 로그 저장을 넘어, 이벤트 데이터를 기반으로
사용자의 현재 상태를 정의하는 것을 목표로 합니다.

---

## 🎯 핵심 기능

* 사용자 이벤트 생성 (click, login)
* 이벤트 기반 사용자 상태 계산
* 시간 감쇠(decay)를 적용한 score 시스템
* 사용자 상태 대시보드 (Active / Idle / Churn)

---

## 🧱 데이터 흐름

Event → Score Calculation → Status → UI

---

## ⚙️ 핵심 로직

### 1. 이벤트 가중치

```ts
click: 1
login: 3
```

### 2. 시간 감쇠 (decay)

```ts
decay = e^(-λt)
```

### 3. 점수 계산

```ts
score = Σ(weight × decay)
```

### 4. 상태 분류

```ts
score > 50 → Active
score > 20 → Idle
else → Churn
```

---

## 💡 설계 포인트

* 이벤트 기반 상태 계산 (server 의존 제거)
* domain 레이어를 통한 비즈니스 로직 분리
* 데이터 흐름 중심 설계

---

## 🛠️ 기술 스택

* Next.js (App Router)
* TypeScript
* CSS Modules

---

## 🚀 향후 확장

* 사용자 행동 패턴 분석
* 개인화 추천 시스템
* CRM 자동화 시스템 (Part 2)

---

## 🎯 한 줄 요약

👉 이벤트 데이터를 기반으로 사용자 상태를 계산하는 시스템
