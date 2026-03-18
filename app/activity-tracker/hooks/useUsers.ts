"use client";

import { ApiUser } from "@/lib/activity/types";
import { useState } from "react";

type UserStatus = "Active" | "Idle" | "Churn";

type User = {
  userId: string;
  status: UserStatus;
  lastActive: number;
};

function normalizeStatus(status: string): UserStatus {
  if (status === "Active" || status === "Idle" || status === "Churn") {
    return status;
  }
  return "Idle";
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/activity/users");
      const data: ApiUser[] = await res.json();

      const normalized = data.map((u) => ({
        ...u,
        status: normalizeStatus(u.status),
      }));

      setUsers(normalized);
    } catch {
      setError("데이터 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, fetchUsers };
}