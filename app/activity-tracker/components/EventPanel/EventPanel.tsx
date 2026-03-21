"use client";

import styles from "./../../styles/activityTraker.module.css"

import { useState } from "react";
import Button from "../ui/Button/Button";
import Select from "../ui/Select/Select";

export default function EventPanel() {
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
    <div className={styles.eventpanel}>
      <h1>이벤트 생성</h1>

      <div className={styles.container}>
      {/* 유저 선택 */}
      <Select
        value={userId}
        onChange={setUserId}
        options={[
          { label: "User A", value: "userA" },
          { label: "User B", value: "userB" },
          { label: "User C", value: "userC" },
          { label: "User D", value: "userD" },
          { label: "User E", value: "userE" },
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