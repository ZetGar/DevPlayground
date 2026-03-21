import { User } from "@/lib/activity/types";
import styles from "./UserCard.module.css";
import { formatTimeAgo } from "@/lib/utils/time";

export default function UserCard({ userId, status, lastActive, recommendation }: User) {
  
  return (
    <div className={styles.card}>
      <div className={styles.cardUser}>
        <b>{userId}</b>

        <div className={styles.right}>
          <span className={styles.time}> {formatTimeAgo(lastActive)}</span>
          <span className={`${styles.status} ${styles[status]}`}>
          {status}
        </span>
        </div>
      </div>


      <p className={styles.recommend}>
        ✨ 추천: {recommendation.message}
      </p>
      
      <p className={styles.recommend}>
        {recommendation.reason}
      </p>

      
    </div>
  );
}