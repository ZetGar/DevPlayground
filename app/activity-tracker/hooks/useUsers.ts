"use client";

import { useState, useCallback } from "react";
import { User } from "../domain/user";
import { ApiUser } from "@/lib/activity/types";
import { toUser } from "../domain/userMapper";
import { MOCK_USERS } from "../domain/mockUsers";

export function useUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/activity/users");
      const data: ApiUser[] = await res.json();

      const mapped = data.map(toUser);
      
      const mockIds = new Set(MOCK_USERS.map((u) => u.userId));
      const realUsers = mapped.filter((u) => !mockIds.has(u.userId));
      setUsers([...MOCK_USERS, ...realUsers]);
    } catch {
      setError("데이터 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, error, fetchUsers };
}