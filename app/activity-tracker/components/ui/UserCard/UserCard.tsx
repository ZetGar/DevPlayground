import { User } from "@/lib/activity/types";
import styles from "./UserCard.module.css";

export default function UserCard({ userId, status, lastActive }: User) {
  return (
    <div className={styles.card}>
      <b>{userId}</b>

      <div className={styles.right}>
        <span className={styles.time}> {lastActive}분 전</span>
        <span className={`${styles.status} ${styles[status]}`}>
        {status}
      </span>
      </div>

      
    </div>
  );
}