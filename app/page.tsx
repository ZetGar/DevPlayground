import Link from "next/link";
import styles from "./styles/home.module.css";
import { projects } from "./data/projects";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.label}>Dev Playground</p>
          <h1 className={styles.title}>
            데이터 기반 의사결정
          </h1>
          <p className={styles.subtitle}>
            이벤트 수집부터 상태 분석, 자동화 액션, AI 추천까지 —
            <br />
            하나의 철학으로 연결된 세 개의 프로젝트
          </p>
        </div>
      </header>

      {/* 흐름 다이어그램 */}
      <section className={styles.flow}>
        <div className={styles.flowInner}>
          <div className={styles.flowStep}>
            <span className={styles.flowIcon}>📊</span>
            <span className={styles.flowText}>이벤트 수집</span>
          </div>
          <span className={styles.flowArrow}>→</span>
          <div className={styles.flowStep}>
            <span className={styles.flowIcon}>🧮</span>
            <span className={styles.flowText}>상태 계산</span>
          </div>
          <span className={styles.flowArrow}>→</span>
          <div className={styles.flowStep}>
            <span className={styles.flowIcon}>🎯</span>
            <span className={styles.flowText}>세그먼트</span>
          </div>
          <span className={styles.flowArrow}>→</span>
          <div className={styles.flowStep}>
            <span className={styles.flowIcon}>⚡</span>
            <span className={styles.flowText}>자동화 액션</span>
          </div>
          <span className={styles.flowArrow}>→</span>
          <div className={styles.flowStep}>
            <span className={styles.flowIcon}>🤖</span>
            <span className={styles.flowText}>AI 분석</span>
          </div>
        </div>
      </section>

      {/* 프로젝트 카드 */}
      <main className={styles.main}>
        <div className={styles.projects}>
          {projects.map((project, i) => (
            <div key={project.title} className={styles.projectWrapper}>

              <Link href={project.path} className={`${styles.card} ${styles[`card_${project.color}`]}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardMeta}>
                    <span className={styles.partNumber}>{project.number}</span>
                    <span className={`${styles.status} ${project.status === "완료" ? styles.statusDone : styles.statusWip}`}>
                      {project.status}
                    </span>
                  </div>
                  <span className={styles.cardArrow}>→</span>
                </div>

                <h2 className={styles.cardTitle}>{project.title}</h2>
                <p className={styles.cardDesc}>{project.description}</p>

                <div className={styles.outputs}>
                  {project.outputs.map((output) => (
                    <span key={output} className={styles.output}>
                      ✓ {output}
                    </span>
                  ))}
                </div>

                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </Link>

              {/* 연결선 */}
              {i === 0 && (
                <div className={styles.connector}>
                  <div className={styles.connectorLine} />
                  <span className={styles.connectorLabel}>데이터 연결</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
