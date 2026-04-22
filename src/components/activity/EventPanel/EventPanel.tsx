"use client";

import styles from "@/app/(projects)/activity-tracker/styles/activityTraker.module.css"

import { useState } from "react";
import Button from "../ui/Button/Button";
import Select from "../ui/Select/Select";

export default function EventPanel() {
  const [userId, setUserId] = useState("user-a");

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
    <div className={styles.eventpanel}>
      <h1>이벤트 생성</h1>

      <div className={styles.container}>
      {/* 유저 선택 */}
      <Select
        value={userId}
        onChange={setUserId}
        options={[
          { label: "User A", value: "user-a" },
          { label: "User B", value: "user-b" },
          { label: "User C", value: "user-c" },
          { label: "User D", value: "user-d" },
          { label: "User E", value: "user-e" },
        ]}
      />

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