"use client";

import { useState, useCallback } from "react";
import { User } from "../domain/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/activity/users");
    const data: User[] = await res.json();

    setUsers(data);
  } catch {
    setError("데이터 불러오기 실패");
  } finally {
    setLoading(false);
  }
}, []);

  return { users, loading, error, fetchUsers };
}