"use client";

import { useState } from "react";

type User = {
  userId: string;
  status: string;
  lastActive: number;
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/activity/users");
      const data = await res.json();

      setUsers(data);
    } catch {
      setError("데이터 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, fetchUsers };
}