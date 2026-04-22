"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

type Step = "form" | "check-email";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          setError("이미 가입된 이메일이에요. 로그인해주세요.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }
      setStep("check-email");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push("/job-log");
      router.refresh();
    }

    setLoading(false);
  };

  if (step === "check-email") {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.logo}>JobLog</span>
            <h1 className={styles.title}>메일을 확인해주세요</h1>
            <p className={styles.desc}>
              <strong>{email}</strong>로 인증 메일을 보냈어요.
              <br />
              메일에서 링크를 클릭하면 가입이 완료됩니다.
              <br /><br />
              이미 가입한 계정이라면 메일이 오지 않을 수 있어요.
              <br />
              아래 로그인 버튼을 눌러주세요.
            </p>
          </div>
          <div className={styles.form}>
            <p className={styles.hint}>
              메일이 오지 않았나요? 스팸함을 확인하거나 잠시 후 다시 시도해봐요.
            </p>
            <button
              className={styles.toggle}
              onClick={() => {
                setStep("form");
                setIsSignUp(false);
              }}
            >
              인증 완료했어요 → 로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>JobLog</span>
          <h1 className={styles.title}>
            {isSignUp ? "회원가입" : "로그인"}
          </h1>
          <p className={styles.desc}>
            {isSignUp
              ? "계정을 만들고 지원 현황을 관리하세요"
              : "나만의 AI 커리어 트래커"}
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              className={styles.input}
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              className={styles.input}
              placeholder="8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "처리 중..." : isSignUp ? "회원가입" : "로그인"}
          </button>

          <button
            className={styles.toggle}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp ? "이미 계정이 있어요 → 로그인" : "계정이 없어요 → 회원가입"}
          </button>
        </div>
      </div>
    </div>
  );
}
