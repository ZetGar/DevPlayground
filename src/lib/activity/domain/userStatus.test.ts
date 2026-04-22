import { getUserStatus } from "@/lib/activity/domain/userStatus";
import { toUser } from "@/lib/activity/domain/userMapper";
import { UserEvent, ApiUser } from "@/lib/activity/types";

const now = Date.now();
const min = 60 * 1000;

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

// ── getUserStatus ──────────────────────────────────
describe("getUserStatus", () => {
  test("이벤트가 없으면 Churn을 반환한다", () => {
    expect(getUserStatus([])).toBe("Churn");
  });

  test("최근 purchase 이벤트가 있으면 Active를 반환한다", () => {
    const events = [makeEvent("purchase", 1), makeEvent("login", 2)];
    expect(getUserStatus(events)).toBe("Active");
  });

  test("오래된 이벤트만 있으면 Churn을 반환한다", () => {
    const events = [makeEvent("click", 500), makeEvent("scroll", 600)];
    expect(getUserStatus(events)).toBe("Churn");
  });

  test("score 기준 — Active > Idle > Churn 순서로 분류된다", () => {
    const active = getUserStatus([makeEvent("purchase", 1), makeEvent("login", 1)]);
    const idle = getUserStatus([makeEvent("click", 30)]);
    const churn = getUserStatus([makeEvent("scroll", 500)]);

    expect(active).toBe("Active");
    expect(idle).toBe("Idle");
    expect(churn).toBe("Churn");
  });
});

// ── toUser (userMapper) ────────────────────────────
describe("toUser", () => {
  test("userId가 올바르게 매핑된다", () => {
    const apiUser: ApiUser = {
      userId: "user-test",
      events: [makeEvent("login", 1)],
    };
    const user = toUser(apiUser);
    expect(user.userId).toBe("user-test");
  });

  test("마지막 이벤트의 timestamp가 lastActive로 매핑된다", () => {
    const events = [makeEvent("click", 10), makeEvent("login", 5)];
    const apiUser: ApiUser = { userId: "user-test", events };
    const user = toUser(apiUser);
    expect(user.lastActive).toBe(events[events.length - 1].timestamp);
  });

  test("이벤트가 없으면 lastActive가 0이다", () => {
    const apiUser: ApiUser = { userId: "user-test", events: [] };
    const user = toUser(apiUser);
    expect(user.lastActive).toBe(0);
  });

  test("status와 recommendation이 함께 생성된다", () => {
    const apiUser: ApiUser = {
      userId: "user-test",
      events: [makeEvent("purchase", 1), makeEvent("login", 1)],
    };
    const user = toUser(apiUser);
    expect(user.status).toBeDefined();
    expect(user.recommendation.message).toBeDefined();
    expect(user.recommendation.reason).toBeDefined();
  });
});