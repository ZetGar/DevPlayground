"use client";

import { useState } from "react";
import styles from "@/styles/home.module.css";
import tabStyles from "@/app/(projects)/activity-tracker/styles/activityTraker.module.css";

import EventPanel from "@/components/activity/EventPanel/EventPanel";
import Dashboard from "@/components/activity/Dashboard/Dashboard";
import SegmentBuilder from "@/components/crm/SegmentBuilder/SegmentBuilder";
import CampaignBuilder from "@/components/crm/CampaignBuilder/CampaignBuilder";
import ExecutionLog from "@/components/crm/ExecutionLog/ExecutionLog";

type Tab = "activity" | "crm";

export default function MarketingAutomationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("activity");

  return (
    <div className={styles.container}>
      {/* 프로젝트 공통 소개 */}
      <div className={tabStyles.projectHeader}>
        <div className={tabStyles.projectHeaderInner}>
          <span className={tabStyles.projectLabel}>Project 1</span>
          <h1 className={tabStyles.projectTitle}>Behavior-Based Marketing Automation | 유저 행동 분석부터 캠페인 자동화까지</h1>
          <p className={tabStyles.projectDesc}>
            유저의 행동 데이터를 수집하고 시간 감쇠(decay) 알고리즘으로 상태를 자동 분류한 뒤,
            세그먼트별 캠페인을 자동 실행하는 마케팅 자동화 시스템입니다.
          </p>
          {/* 데이터 흐름 */}
          <div className={tabStyles.flow}>
            {["이벤트 수집", "Score 계산", "상태 분류", "세그먼트", "캠페인 실행", "전환율 추적"].map((step, i, arr) => (
              <span key={step} className={tabStyles.flowWrap}>
                <span className={tabStyles.flowStep}>{step}</span>
                {i < arr.length - 1 && <span className={tabStyles.flowArrow}>→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className={tabStyles.tabNav}>
        <button
          className={`${tabStyles.tabButton} ${activeTab === "activity" ? tabStyles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Part 1 — Activity Tracker
        </button>
        <button
          className={`${tabStyles.tabButton} ${activeTab === "crm" ? tabStyles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("crm")}
        >
          Part 2 — Behavior CRM
        </button>
      </div>

      {/* Activity Tracker */}
      {activeTab === "activity" && (
        <div className={tabStyles.tabContent}>
          <div className={tabStyles.introSection}>
            <div className={tabStyles.introLeft}>
              <h2 className={tabStyles.introTitle}>Activity Tracker</h2>
              <p className={tabStyles.introDesc}>
                유저가 발생시키는 이벤트(로그인, 클릭 등)에 가중치를 부여하고,
                시간이 지날수록 score가 자연 감소하는 decay 알고리즘을 적용해
                유저 상태를 <strong>Active / Idle / Churn</strong>으로 자동 분류합니다.
              </p>
              <div className={tabStyles.logicBox}>
                <p className={tabStyles.logicTitle}>핵심 로직</p>
                <code className={tabStyles.logicCode}>
                  score = Σ(이벤트 weight × e^(-λ × 경과시간))
                </code>
                <p className={tabStyles.logicNote}>
                  score ≥ 70 → Active · 30~70 → Idle · 30 미만 → Churn
                </p>
              </div>
            </div>
            <div className={tabStyles.introRight}>
              <p className={tabStyles.guideTitle}>사용 방법</p>
              <ol className={tabStyles.guideList}>
                <li>왼쪽에서 유저를 선택합니다</li>
                <li>로그인 또는 클릭 버튼으로 이벤트를 발생시킵니다</li>
                <li>오른쪽 대시보드에서 score와 상태 변화를 확인합니다</li>
                <li>이벤트가 없으면 시간 경과에 따라 score가 감소합니다</li>
              </ol>
            </div>
          </div>

          <div className={styles.layout}>
            <EventPanel />
            <Dashboard />
          </div>
        </div>
      )}

      {/* Behavior CRM */}
      {activeTab === "crm" && (
        <div className={tabStyles.tabContent}>
          <div className={tabStyles.introSection}>
            <div className={tabStyles.introLeft}>
              <h2 className={tabStyles.introTitle}>Behavior CRM</h2>
              <p className={tabStyles.introDesc}>
                Activity Tracker에서 분류된 유저 상태 데이터를 기반으로
                세그먼트를 생성하고, 조건에 맞는 유저에게 자동화 액션을 실행합니다.
                실행 결과는 로그로 기록되어 전환율을 추적할 수 있습니다.
              </p>
              <div className={tabStyles.logicBox}>
                <p className={tabStyles.logicTitle}>데이터 연결</p>
                <code className={tabStyles.logicCode}>
                  Activity Tracker → 유저 상태 → 세그먼트 필터링 → 캠페인 실행
                </code>
                <p className={tabStyles.logicNote}>
                  Part 1의 score/status 데이터가 세그먼트 조건의 기반이 됩니다
                </p>
              </div>
            </div>
            <div className={tabStyles.introRight}>
              <p className={tabStyles.guideTitle}>사용 방법</p>
              <ol className={tabStyles.guideList}>
                <li>왼쪽에서 조건(상태, score 등)을 설정해 세그먼트를 생성합니다</li>
                <li>오른쪽에서 세그먼트를 선택하고 캠페인을 만들어 실행합니다</li>
                <li>아래 실행 로그에서 발송 결과와 전환율을 확인합니다</li>
              </ol>
            </div>
          </div>

          <div className={styles.layout}>
            <SegmentBuilder onCreated={() => {}} />
            <CampaignBuilder onExecuted={() => {}} />
          </div>
          <ExecutionLog />
        </div>
      )}
    </div>
  );
}
