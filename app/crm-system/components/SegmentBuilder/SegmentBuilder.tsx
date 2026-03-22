"use client";

import { useEffect, useState } from "react";
import styles from "./SegmentBuilder.module.css";
import { SegmentCondition, ConditionField, ConditionOperator, Segment } from "@/lib/crm/types";
import { UserStatus } from "@/lib/activity/types";

type Props = {
  onCreated: () => void;
};

const FIELD_OPTIONS: { label: string; value: ConditionField }[] = [
  { label: "상태 (status)", value: "status" },
  { label: "점수 (score)", value: "score" },
  { label: "비활동 일수", value: "lastActiveDaysAgo" },
];

const STATUS_OPTIONS: UserStatus[] = ["Active", "Idle", "Churn"];

export default function SegmentBuilder({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [conditions, setConditions] = useState<SegmentCondition[]>([
    { field: "status", operator: "==", value: "Churn" },
  ]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Segment[]>([]);
  
  const updateCondition = (
    index: number,
    key: keyof SegmentCondition,
    value: string | number
  ) => {
    setConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [key]: value } : c))
    );
  };

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { field: "score", operator: "<", value: 30 },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/crm/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, conditions }),
      });
      setName("");
      setConditions([{ field: "status", operator: "==", value: "Churn" }]);
      fetchList();
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  const fetchList = async () => {
  const res = await fetch("/api/crm/segments");
  setList(await res.json());
};

const handleDelete = async (id: string) => {
  await fetch("/api/crm/segments", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  fetchList();
};

useEffect(() => {
  fetchList();
  const interval = setInterval(fetchList, 3000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className={styles.panel}>
      <div className={styles.content}> 
        <h2 className={styles.title}>세그먼트 생성</h2>

        <div className={styles.field}>
          <label className={styles.label}>세그먼트 이름</label>
          <input
            className={styles.input}
            placeholder="예: 이탈 위험 유저"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>조건</label>
          <div className={styles.conditions}>
            {conditions.map((cond, i) => (
              <div key={i} className={styles.conditionRow}>
                {/* field */}
                <select
                  className={styles.select}
                  value={cond.field}
                  onChange={(e) =>
                    updateCondition(i, "field", e.target.value as ConditionField)
                  }
                >
                  {FIELD_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                {/* operator */}
                <select
                  className={styles.selectSm}
                  value={cond.operator}
                  onChange={(e) =>
                    updateCondition(i, "operator", e.target.value as ConditionOperator)
                  }
                >
                  {["==", ">", "<", ">=", "<="].map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>

                {/* value */}
                {cond.field === "status" ? (
                  <select
                    className={styles.select}
                    value={cond.value as string}
                    onChange={(e) => updateCondition(i, "value", e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={styles.inputSm}
                    type="number"
                    value={cond.value as number}
                    onChange={(e) =>
                      updateCondition(i, "value", Number(e.target.value))
                    }
                  />
                )}

                {conditions.length > 1 && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeCondition(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className={styles.addBtn} onClick={addCondition}>
            + 조건 추가
          </button>
        </div>

        {list.length > 0 && (
  <div className={styles.segmentList}>
    {list.map((s) => (
      <div key={s.id} className={styles.segmentItem}>
        <span>{s.name}</span>
        <button
          className={styles.deleteBtn}
          onClick={() => handleDelete(s.id)}
        >
          삭제
        </button>
      </div>
    ))}
  </div>
)}
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
      >
        {loading ? "생성 중..." : "세그먼트 생성"}
      </button>
    </div>
  );
}
