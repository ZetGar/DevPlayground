"use client";

import { useState } from "react";

export default function EventPage() {
  const [userId, setUserId] = useState("userA");

  const sendEvent = async (type: string) => {
    await fetch("/api/activity/event", {
      method: "POST",
      body: JSON.stringify({
        userId,
        type,
      }),
    });

    alert("이벤트 전송됨!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>이벤트 생성</h1>

      {/* 유저 선택 */}
      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      >
        <option value="userA">User A</option>
        <option value="userB">User B</option>
      </select>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => sendEvent("login")}>
          로그인
        </button>

        <button onClick={() => sendEvent("click")} style={{ marginLeft: 10 }}>
          클릭
        </button>
      </div>
    </div>
  );
}