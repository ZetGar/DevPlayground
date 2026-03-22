"use client";

import { useState, useEffect } from "react";
import styles from "./ExecutionLog.module.css";
import { ExecutionLog as Log, Campaign } from "@/lib/crm/types";
import { UserStatus } from "@/lib/activity/types";

export default function ExecutionLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const fetchData = async () => {
    const [logsRes, campaignsRes] = await Promise.all([
      fetch("/api/crm/logs"),
      fetch("/api/crm/campaigns"),
    ]);
    setLogs(await logsRes.json());
    setCampaigns(await campaignsRes.json());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleCampaign = (campaign: Campaign) => {
    setSelectedCampaign((prev) => (prev?.id === campaign.id ? null : campaign));
  };

  const successLogs = logs.filter((l) => l.result === "success");
  const skippedCount = logs.filter((l) => l.result === "skipped").length;
  const failedCount = logs.filter((l) => l.result === "failed").length;

  // 캠페인별 success 유저 그룹핑
  const successByCampaign = successLogs.reduce<Record<string, Log[]>>(
    (acc, log) => {
      if (!acc[log.campaignId]) acc[log.campaignId] = [];
      acc[log.campaignId].push(log);
      return acc;
    },
    {}
  );

  const selectedLogs = selectedCampaign
    ? successByCampaign[selectedCampaign.id] ?? []
    : [];

  // 전환된 유저 수 (beforeStatus !== afterStatus)
  const convertedCount = selectedLogs.filter(
    (l) => l.afterStatus && l.afterStatus !== l.beforeStatus
  ).length;

  const actionLabel: Record<string, string> = {
    send_message: "📩 메시지",
    send_notification: "🔔 알림",
    send_email: "📧 이메일",
  };

  const statusColor: Record<UserStatus, string> = {
    Active: styles.statusActive,
    Idle: styles.statusIdle,
    Churn: styles.statusChurn,
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>실행 로그</h2>

      {/* 요약 카드 */}
      {logs.length > 0 && (
        <div className={styles.summary}>
          <div className={`${styles.summaryCard} ${styles.success}`}>
            <span className={styles.summaryCount}>{successLogs.length}</span>
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
        <>
          {/* 전체 로그 테이블 */}
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
                <span className={`${styles.badge} ${styles[log.result]}`}>
                  {log.result}
                </span>
              </div>
            ))}
          </div>

          {/* 📬 메시지함 */}
          {Object.keys(successByCampaign).length > 0 && (
            <div className={styles.inbox}>
              <div className={styles.inboxTitleRow}>
                <h3 className={styles.inboxTitle}>📬 메시지함</h3>
                <span className={styles.inboxHint}>
                  캠페인을 클릭하면 상세를 볼 수 있어요
                </span>
              </div>

              <div className={styles.inboxLayout}>
                {/* 캠페인 카드 목록 */}
                <div className={styles.campaignList}>
                  {campaigns
                    .filter((c) => successByCampaign[c.id])
                    .map((campaign) => {
                      const count = successByCampaign[campaign.id]?.length ?? 0;
                      const isSelected = selectedCampaign?.id === campaign.id;
                      const converted = (successByCampaign[campaign.id] ?? []).filter(
                        (l) => l.afterStatus && l.afterStatus !== l.beforeStatus
                      ).length;

                      return (
                        <div
                          key={campaign.id}
                          className={`${styles.campaignCard} ${isSelected ? styles.campaignCardActive : ""}`}
                          onClick={() => toggleCampaign(campaign)}
                        >
                          <div className={styles.campaignCardTop}>
                            <span className={styles.campaignName}>{campaign.name}</span>
                            <span className={styles.campaignUserCount}>{count}명</span>
                          </div>
                          <div className={styles.campaignCardBottom}>
                            <span className={styles.campaignAction}>
                              {actionLabel[campaign.actionType]}
                            </span>
                            <span className={styles.campaignMessage}>
                              "{campaign.actionPayload.message}"
                            </span>
                            {/* 전환율 뱃지 */}
                            {converted > 0 && (
                              <span className={styles.convertedBadge}>
                                ✅ {converted}명 전환
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* 사이드 드로어 패널 */}
                {selectedCampaign && (
                  <div className={styles.drawerPanel}>
                    <div className={styles.drawerHeader}>
                      <div>
                        <h4 className={styles.drawerTitle}>{selectedCampaign.name}</h4>
                        <span className={styles.drawerAction}>
                          {actionLabel[selectedCampaign.actionType]}
                        </span>
                      </div>
                      <button
                        className={styles.drawerClose}
                        onClick={() => setSelectedCampaign(null)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className={styles.drawerMessage}>
                      <p className={styles.drawerMessageLabel}>발송 메시지</p>
                      <p className={styles.drawerMessageText}>
                        "{selectedCampaign.actionPayload.message}"
                      </p>
                    </div>

                    {/* 전환 요약 */}
                    <div className={styles.drawerConversion}>
                      <div className={styles.drawerConversionStat}>
                        <span className={styles.drawerConversionNum}>
                          {selectedLogs.length}
                        </span>
                        <span className={styles.drawerConversionLabel}>발송</span>
                      </div>
                      <span className={styles.drawerConversionArrow}>→</span>
                      <div className={styles.drawerConversionStat}>
                        <span className={`${styles.drawerConversionNum} ${styles.converted}`}>
                          {convertedCount}
                        </span>
                        <span className={styles.drawerConversionLabel}>전환</span>
                      </div>
                      <div className={styles.drawerConversionRate}>
                        {selectedLogs.length > 0
                          ? Math.round((convertedCount / selectedLogs.length) * 100)
                          : 0}
                        % 전환율
                      </div>
                    </div>

                    {/* 유저별 상태 변화 */}
                    <div className={styles.drawerUsers}>
                      <p className={styles.drawerUsersLabel}>
                        발송 대상 <strong>{selectedLogs.length}명</strong>
                      </p>
                      {selectedLogs.map((log) => {
                        const isConverted =
                          log.afterStatus && log.afterStatus !== log.beforeStatus;
                        return (
                          <div key={log.id} className={styles.drawerUserRow}>
                            <span className={styles.drawerUserId}>{log.userId}</span>
                            <div className={styles.drawerStatusChange}>
                              <span className={`${styles.statusBadge} ${statusColor[log.beforeStatus]}`}>
                                {log.beforeStatus}
                              </span>
                              <span className={styles.statusArrow}>→</span>
                              {log.afterStatus ? (
                                <span className={`${styles.statusBadge} ${statusColor[log.afterStatus]}`}>
                                  {log.afterStatus}
                                </span>
                              ) : (
                                <span className={styles.statusPending}>대기중</span>
                              )}
                              {isConverted && (
                                <span className={styles.convertedIcon}>✅</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
