"use client";

import { useState, useEffect } from "react";
import styles from "./ExecutionLog.module.css";
import { ExecutionLog as Log } from "@/lib/crm/types";

export default function ExecutionLog() {
  const [logs, setLogs] = useState<Log[]>([]);

  const fetchLogs = async () => {
    const res = await fetch("/api/crm/logs");
    const data = await res.json();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const successCount = logs.filter((l) => l.result === "success").length;
  const skippedCount = logs.filter((l) => l.result === "skipped").length;
  const failedCount = logs.filter((l) => l.result === "failed").length;

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>실행 로그</h2>

      {logs.length > 0 && (
        <div className={styles.summary}>
          <div className={`${styles.summaryCard} ${styles.success}`}>
            <span className={styles.summaryCount}>{successCount}</span>
            <span className={styles.summaryLabel}>성공</span>
          </div>
          <div className={`${styles.summaryCard} ${styles.skipped}`}>
            <span className={styles.summaryCount}>{skippedCount}</span>
            <span className={styles.summaryLabel}>스킵</span>
          </div>
          <div className={`${styles.summaryCard} ${styles.failed}`}>
            <span className={styles.summaryCount}>{failedCount}</span>
            <span className={styles.summaryLabel}>실패</span>
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <p className={styles.empty}>캠페인을 실행하면 로그가 기록됩니다</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>유저 ID</span>
            <span>캠페인 ID</span>
            <span>실행 시각</span>
            <span>결과</span>
          </div>
          {logs.map((log) => (
            <div key={log.id} className={styles.tableRow}>
              <span className={styles.userId}>{log.userId}</span>
              <span className={styles.campaignId}>
                {log.campaignId.slice(0, 8)}...
              </span>
              <span className={styles.time}>
                {new Date(log.executedAt).toLocaleTimeString("ko-KR")}
              </span>
              <span
                className={`${styles.badge} ${styles[log.result]}`}
              >
                {log.result}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
