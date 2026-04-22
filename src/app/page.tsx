import Link from "next/link";
import styles from "@/styles/home.module.css";
import { projects } from "../lib/data/projects";

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
            행동 분석, 마케팅 자동화, AI 커리어 트래킹, 생산성 툴까지 — <br/>
            실제로 쓸 수 있는 것들을 직접 만드는 공간입니다.
          </p>
        </div>
      </header>

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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
