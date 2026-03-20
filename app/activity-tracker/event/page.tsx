"use client";

import Link from "next/link";
import Button from "../components/ui/Button/Button";
import styles from "./../styles/activityTraker.module.css"

import { useState } from "react";

export default function EventPage() {
  const [userId, setUserId] = useState("userA");

  const sendEvent = async (type: string) => {
  const res = await fetch("/api/activity/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 🔥 필수
    },
    body: JSON.stringify({
      userId,
      type,
    }),
  });

  const data = await res.json();
  console.log("response:", data);

  alert("이벤트 전송됨!");
};

  return (
    <div className={styles.dashboard}>
      <h1>이벤트 생성</h1>

      <Link href="/activity-tracker">
        <Button>대시보드 바로가기</Button>
      </Link>

      <div className={styles.container}>
      {/* 유저 선택 */}
      <select
        className={styles.select}
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      >
        <option value="userA">User A</option>
        <option value="userB">User B</option>
        <option value="userC">User C</option>
        <option value="userD">User D</option>
        <option value="userE">User E</option>
      </select>

      <div className={styles.eventButtons}>
        <Button variant="yellow" onClick={() => sendEvent("login")}>
          로그인
        </Button>

        <Button variant="yellow" onClick={() => sendEvent("click")}>
          클릭
        </Button>
      </div>
      </div>
    </div>
  );
}