"use client";

import styles from "./styles/activityTraker.module.css"

import { useEffect, useMemo, useState } from "react";
import { useUsers } from "./hooks/useUsers";
import Link from "next/link";
import Button from "./components/ui/Button/Button";
import UserCard from "./components/ui/UserCard/UserCard";
import { UserStatus } from "./domain/user";

export default function Home() {
  const { users, loading, error, fetchUsers } = useUsers();
  const [filter, setFilter] = useState<"All" | UserStatus>("All");  

useEffect(() => {
  fetchUsers();

  const interval = setInterval(() => {
    fetchUsers();
  }, 3000);

  return () => clearInterval(interval);
}, [fetchUsers]);

useEffect(() => {
  console.log(users);
}, [users]);

const filteredUsers = useMemo(() => {
  if (filter === "All") return users;
  return users.filter((u) => u.status === filter);
}, [users, filter]);

  return (
    <div className={styles.dashboard}>

      <h1>유저 상태 대시보드</h1>

      <div className={styles.buttonGroup}>
        <Link href="/activity-tracker/event">
          <Button>이벤트 생성하러 가기</Button>
        </Link>
        <Button variant="secondary" onClick={fetchUsers}>🔄 새로고침</Button>
      </div>

      <div className={styles.filterGroup}>
        {["All", "Active", "Idle", "Churn"].map((f) => (
          <button
            key={f}
            className={`${styles.filterButton} ${
              filter === f ? styles.active : ""
            }`}
            onClick={() => setFilter(f as "All" | UserStatus)}
          >
            {f}
          </button>
        ))}
      </div>

      <div>
        {loading && filteredUsers.length === 0 && <p>로딩 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {filteredUsers.map((u) => (
          <UserCard key={u.userId} {...u} />
        ))}
      </div>
    </div>
  );
}