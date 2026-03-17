"use client";

import { useEffect } from "react";
import { useUsers } from "./hooks/useUsers";
import UserCard from "./components/UserCard";


export default function Home() {
  const { users, loading, error, fetchUsers } = useUsers();
  

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>대시보드</h1>

      <button onClick={fetchUsers}>새로고침</button>

      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.map((u) => (
        <UserCard key={u.userId} {...u} />
      ))}
    </div>
  );
}