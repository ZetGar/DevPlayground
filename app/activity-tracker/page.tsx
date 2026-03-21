import styles from "./styles/home.module.css"
import EventPanel from "./components/EventPanel/EventPanel";
import Dashboard from "./components/Dashboard/Dashboard";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* 2. 프로젝트 설명 */}
      <div className={styles.intro}>
        <h1 className={styles.introTitle}>Activity Tracker</h1>
        <p className={styles.introDesc}>
          유저의 이벤트 데이터를 기반으로 점수를 계산하고, 행동 패턴에 따라
          상태(Active / Idle / Churn)를 자동으로 분류하는 시스템입니다.
        </p>
        <div className={styles.introBadges}>
          <span className={styles.badge}>⚡ 이벤트 발생 → 점수 계산</span>
          <span className={styles.badge}>📊 상태 자동 분류</span>
          <span className={styles.badge}>🎯 추천 액션 생성</span>
        </div>
        <p className={styles.introGuide}>
          👈 왼쪽에서 이벤트를 발생시키면 유저 상태가 실시간으로 변합니다.
        </p>
      </div>

      {/* 기존 레이아웃 */}
      <div className={styles.layout}>
        <EventPanel />
        <Dashboard />
      </div>
    </div>
  );
}
