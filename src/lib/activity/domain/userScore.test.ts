import { calculateScore } from "@/lib/activity/domain/userScore";import { getRecommendation } from "@/lib/activity/domain/recommendation";
import { UserEvent } from "@/lib/activity/types";

const now = Date.now();
const min = 60 * 1000;

// ── 헬퍼 ──────────────────────────────────────────
function makeEvent(
  type: UserEvent["type"],
  minutesAgo: number
): UserEvent {
  return {
    userId: "test-user",
    type,
    timestamp: now - minutesAgo * min,
  };
}

// ── calculateScore ─────────────────────────────────
describe("calculateScore", () => {
  test("이벤트가 없으면 0을 반환한다", () => {
    expect(calculateScore([])).toBe(0);
  });

  test("purchase 이벤트는 click보다 높은 score를 가진다", () => {
    const purchaseScore = calculateScore([makeEvent("purchase", 1)]);
    const clickScore = calculateScore([makeEvent("click", 1)]);
    expect(purchaseScore).toBeGreaterThan(clickScore);
  });

  test("이벤트 가중치 순서: purchase > login > search > click > scroll", () => {
    const scores = (["purchase", "login", "search", "click", "scroll"] as const).map(
      (type) => calculateScore([makeEvent(type, 1)])
    );
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThan(scores[i + 1]);
    }
  });

  test("오래된 이벤트일수록 score가 낮다 (decay 적용)", () => {
    const recentScore = calculateScore([makeEvent("login", 1)]);
    const oldScore = calculateScore([makeEvent("login", 60)]);
    expect(recentScore).toBeGreaterThan(oldScore);
  });

  test("이벤트가 많을수록 score가 높다", () => {
    const oneEvent = calculateScore([makeEvent("click", 1)]);
    const threeEvents = calculateScore([
      makeEvent("click", 1),
      makeEvent("click", 2),
      makeEvent("click", 3),
    ]);
    expect(threeEvents).toBeGreaterThan(oneEvent);
  });
});

// ── getRecommendation ──────────────────────────────
describe("getRecommendation", () => {
  test("매우 활발한 유저 — 프리미엄 기능 추천", () => {
    // purchase 여러 개 + 방금 활동
    const events = [
      makeEvent("purchase", 0.5),
      makeEvent("login", 1),
      makeEvent("click", 1),
      makeEvent("search", 2),
    ];
    const result = getRecommendation(events);
    expect(result.message).toBe("🔥 프리미엄 기능 추천");
  });

  test("간헐적 활동 유저 — 추가 기능 사용 유도", () => {
    // 적당한 score + 10분 전 활동
    const events = [
      makeEvent("login", 10),
      makeEvent("click", 10),
    ];
    const result = getRecommendation(events);
    expect(result.message).toBe("🙂 추가 기능 사용 유도");
  });

  test("장시간 비활동 유저 — 리텐션 알림 필요", () => {
    // 마지막 활동이 1시간 전
    const events = [makeEvent("click", 60)];
    const result = getRecommendation(events);
    expect(result.message).toBe("⚠️ 리텐션 알림 필요");
  });

  test("이벤트가 없으면 리텐션 알림을 반환한다", () => {
    const result = getRecommendation([]);
    expect(result.message).toBe("⚠️ 리텐션 알림 필요");
  });
});