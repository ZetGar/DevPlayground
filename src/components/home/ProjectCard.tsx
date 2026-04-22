import Link from "next/link";
import styles from "./ProjectCard.module.css";
import { Project } from "../../types/project";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={project.path} className={styles.card}>
      <div className={styles.header}>
        <h2>{project.title}</h2>
        <span className={styles.status}>{project.status}</span>
      </div>

      <p className={styles.desc}>{project.description}</p>
    </Link>
  );
}