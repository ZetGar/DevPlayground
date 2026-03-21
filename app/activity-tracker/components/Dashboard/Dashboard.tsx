"use client";

import styles from "./../../styles/activityTraker.module.css";

import { useEffect, useMemo, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { UserStatus } from "@/lib/activity/types";
import Button from "../ui/Button/Button";
import UserCard from "../ui/UserCard/UserCard";
import Select from "../ui/Select/Select";

export default function Dashboard() {
  const { users, loading, error, fetchUsers } = useUsers();
  const [filter, setFilter] = useState<"All" | UserStatus>("All");
  const [sort, setSort] = useState<"recent" | "status">("recent");

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchUsers();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchUsers]);

  // 3. 시각화용 상태별 카운트
  const statusCount = useMemo(() => {
    return {
      Active: users.filter((u) => u.status === "Active").length,
      Idle: users.filter((u) => u.status === "Idle").length,
      Churn: users.filter((u) => u.status === "Churn").length,
    };
  }, [users]);

  const total = users.length;

  const filteredUsers = useMemo(() => {
    if (filter === "All") return users;
    return users.filter((u) => u.status === filter);
  }, [users, filter]);

  const sortedUsers = useMemo(() => {
    const result = [...filteredUsers];

    if (sort === "recent") {
      return result.sort((a, b) => b.lastActive - a.lastActive);
    }

    if (sort === "status") {
      const order = { Active: 0, Idle: 1, Churn: 2 };
      return result.sort((a, b) => order[a.status] - order[b.status]);
    }

    return result;
  }, [filteredUsers, sort]);

  return (
    <div className={styles.dashboard}>
      <h1>유저 상태 대시보드</h1>

      {total > 0 && (
        <div className={styles.statsSection}>
          <div className={styles.statsCards}>
            {(["Active", "Idle", "Churn"] as UserStatus[]).map((status) => (
              <div
                key={status}
                className={`${styles.statCard} ${styles[`stat${status}`]}`}
                onClick={() => setFilter(status)}
                role="button"
              >
                <span className={styles.statCount}>{statusCount[status]}</span>
                <span className={styles.statLabel}>{status}</span>
                <span className={styles.statPercent}>
                  {total > 0
                    ? Math.round((statusCount[status] / total) * 100)
                    : 0}
                  %
                </span>
              </div>
            ))}
          </div>

          <div className={styles.distributionBar}>
            {(["Active", "Idle", "Churn"] as UserStatus[]).map((status) => {
              const pct =
                total > 0
                  ? Math.round((statusCount[status] / total) * 100)
                  : 0;
              return pct > 0 ? (
                <div
                  key={status}
                  className={`${styles.barSegment} ${styles[`bar${status}`]}`}
                  style={{ width: `${pct}%` }}
                  title={`${status}: ${pct}%`}
                />
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <div className={styles.controls}>
          <Button variant="secondary" onClick={fetchUsers}>
            <span className={loading ? styles.loadingIcon : ""}>🔄</span>
          </Button>
          <Select
            value={sort}
            onChange={(v) => setSort(v as "recent" | "status")}
            options={[
              { label: "최근 활동 순", value: "recent" },
              { label: "상태 순", value: "status" },
            ]}
          />
        </div>
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
        {loading && users.length === 0 && <p>로딩 중...</p>}
        {loading && users.length > 0 && (
          <p className={styles.updating}>업데이트 중...</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && users.length === 0 && (
          <p className={styles.empty}>유저 데이터가 없습니다</p>
        )}
        {sortedUsers.map((u) => (
          <UserCard key={u.userId} {...u} />
        ))}
      </div>
    </div>
  );
}
