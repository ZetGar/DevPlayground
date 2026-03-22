"use client";

import { useState, useEffect } from "react";
import styles from "./CampaignBuilder.module.css";
import { Segment, TriggerType, ActionType } from "@/lib/crm/types";

type Props = {
  onExecuted: () => void;
};

const TRIGGER_OPTIONS: { label: string; value: TriggerType }[] = [
  { label: "상태가 Churn으로 변경될 때", value: "status_change" },
  { label: "3일 이상 비활동", value: "inactive_3days" },
  { label: "score가 기준 이하로 떨어질 때", value: "score_below" },
];

const ACTION_OPTIONS: { label: string; value: ActionType }[] = [
  { label: "📩 메시지 생성", value: "send_message" },
  { label: "🔔 알림 전송 (mock)", value: "send_notification" },
  { label: "📧 이메일 전송 (mock)", value: "send_email" },
];

export default function CampaignBuilder({ onExecuted }: Props) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [name, setName] = useState("");
  const [segmentId, setSegmentId] = useState("");
  const [triggerType, setTriggerType] = useState<TriggerType>("status_change");
  const [actionType, setActionType] = useState<ActionType>("send_message");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSegments = async () => {
    const res = await fetch("/api/crm/segments");
    const data = await res.json();
    setSegments(data);
    if (data.length > 0 && !segmentId) setSegmentId(data[0].id);
  };

  useEffect(() => {
    fetchSegments();
    const interval = setInterval(fetchSegments, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
  if (!name.trim() || !segmentId || !message.trim()) return;
  setLoading(true);
  try {
    const res = await fetch("/api/crm/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        segmentId,
        triggerType,
        actionType,
        actionPayload: { message },
        isActive: true,
      }),
    });
    const data = await res.json();
    console.log("캠페인 응답:", data); // ← 추가
    setName("");
    setMessage("");
    onExecuted();
  } catch (e) {
    console.error("캠페인 에러:", e); // ← 추가
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.panel}>
      <div className={styles.content}> 
        <h2 className={styles.title}>캠페인 빌더</h2>

        <div className={styles.field}>
          <label className={styles.label}>캠페인 이름</label>
          <input
            className={styles.input}
            placeholder="예: 이탈 유저 복귀 캠페인"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>세그먼트 선택</label>
          {segments.length === 0 ? (
            <p className={styles.empty}>세그먼트를 먼저 생성해주세요</p>
          ) : (
            <select
              className={styles.select}
              value={segmentId}
              onChange={(e) => setSegmentId(e.target.value)}
            >
              {segments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>트리거</label>
          <select
            className={styles.select}
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value as TriggerType)}
          >
            {TRIGGER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>액션</label>
          <select
            className={styles.select}
            value={actionType}
            onChange={(e) => setActionType(e.target.value as ActionType)}
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>메시지</label>
          <textarea
            className={styles.textarea}
            placeholder="예: 우리가 그리워요 👀 돌아오시면 혜택을 드려요!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* 미리보기 */}
        {segmentId && message && (
          <div className={styles.preview}>
            <p className={styles.previewLabel}>실행 조건 미리보기</p>
            <p className={styles.previewText}>
              IF 유저가{" "}
              <strong>
                {segments.find((s) => s.id === segmentId)?.name ?? "선택된 세그먼트"}
              </strong>{" "}
              조건에 해당하면
              <br />
              THEN <strong>{message}</strong>
            </p>
          </div>
        )}
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={loading || !name.trim() || !segmentId || !message.trim()}
      >
        {loading ? "실행 중..." : "캠페인 생성 & 실행"}
      </button>
    </div>
  );
}
