"use client";

import styles from "./styles/activityTraker.module.css"

import { useEffect } from "react";
import { useUsers } from "./hooks/useUsers";
import Link from "next/link";
import Button from "./components/ui/Button/Button";
import UserCard from "./components/ui/UserCard/UserCard";

export default function Home() {
  const { users, loading, error, fetchUsers } = useUsers();
  

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className={styles.dashboard}>

      <h1>유저 상태 대시보드</h1>

      <div className={styles.buttonGroup}>
        <Link href="/activity-tracker/event">
          <Button>이벤트 생성하러 가기</Button>
        </Link>
        <Button variant="secondary" onClick={fetchUsers}>🔄 새로고침</Button>
      </div>

      <div>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {users.map((u) => (
          <UserCard key={u.userId} {...u} />
        ))}
      </div>
    </div>
  );
}