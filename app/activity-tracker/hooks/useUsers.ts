"use client";

import { useState, useCallback } from "react";
import { User } from "../domain/user";
import { ApiUser } from "@/lib/activity/types";
import { toUser } from "../domain/userMapper";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true); // ⭐ 항상

      setError(null);

      const res = await fetch("/api/activity/users");
      const data: ApiUser[] = await res.json();

      const mapped = data.map(toUser);

      setUsers(mapped);
    } catch {
      setError("데이터 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, error, fetchUsers };
}