"use client";

import styles from "./styles/home.module.css";
import SegmentBuilder from "./components/SegmentBuilder/SegmentBuilder";
import CampaignBuilder from "./components/CampaignBuilder/CampaignBuilder";
import ExecutionLog from "./components/ExecutionLog/ExecutionLog";

export default function page() {
  return (
    <div className={styles.container}>
      {/* 프로젝트 설명 */}
      <div className={styles.intro}>
        <h1 className={styles.introTitle}>Behavior CRM</h1>
        <p className={styles.introDesc}>
          Part 1의 유저 상태 데이터를 기반으로 세그먼트를 생성하고,
          조건에 맞는 유저에게 자동화 액션을 실행하는 CRM 시스템입니다.
        </p>
        <div className={styles.introBadges}>
          <span className={styles.badge}>👥 세그먼트 생성</span>
          <span className={styles.badge}>⚡ 자동화 트리거</span>
          <span className={styles.badge}>📢 액션 실행</span>
          <span className={styles.badge}>📋 실행 로그</span>
        </div>

        <div className={styles.introSteps}>
          <span>1️⃣ 왼쪽에서 조건을 설정하고 세그먼트 생성</span>
          <span className={styles.arrow}>→</span>
          <span>2️⃣ 오른쪽에서 세그먼트 선택 후 캠페인 생성 & 실행</span>
          <span className={styles.arrow}>→</span>
          <span>3️⃣ 아래 실행 로그에서 결과 확인</span>
        </div>
      </div>

      {/* 세그먼트 + 캠페인 빌더 */}
      <div className={styles.layout}>
        <SegmentBuilder onCreated={() => {}} />
        <CampaignBuilder onExecuted={() => {}} />
      </div>

      {/* 실행 로그 */}
      <ExecutionLog />
    </div>
  );
}
