"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplication } from "@/lib/supabase/applications";

type Job = {
  id: string;
  company_name: string;
  job_title: string;
  domain: string;
  job_url: string;
  company_size: string;
  stage: string;
  applied_at: string;
};

const STAGES = ["서류 전형", "코딩 테스트", "1차 면접", "2차 면접", "최종 면접", "합격", "불합격"];
const SIZES = ["스타트업", "중소기업", "중견기업", "대기업", "외국계"];

export default function EditableJobInfo({ job }: { job: Job }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Job>(job);

  const handleSave = async () => {
    if (!form.company_name.trim() || !form.job_title.trim()) {
      return alert("회사명과 포지션은 필수입니다.");
    }
    setSaving(true);
    try {
      await updateApplication(job.id, {
        company_name: form.company_name,
        job_title: form.job_title,
        domain: form.domain,
        job_url: form.job_url,
        company_size: form.company_size,
        stage: form.stage,
        applied_at: form.applied_at,
      });
      setIsEditing(false);
      router.refresh(); // 서버 컴포넌트 데이터 다시 가져오기
    } catch (e) {
      alert("저장 실패: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(job); // 원래 값으로 복원
    setIsEditing(false);
  };

  // ===== 편집 모드 =====
  if (isEditing) {
    return (
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: "bold" }}>공고 정보 수정</h2>
        </div>

        <Field label="공고 URL">
          <input
            type="url"
            value={form.job_url ?? ""}
            onChange={(e) => setForm({ ...form, job_url: e.target.value })}
            placeholder="https://..."
            style={input}
          />
        </Field>

        <div style={row}>
          <Field label="회사명 *">
            <input
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              style={input}
            />
          </Field>
          <Field label="포지션 *">
            <input
              value={form.job_title}
              onChange={(e) => setForm({ ...form, job_title: e.target.value })}
              style={input}
            />
          </Field>
        </div>

        <div style={row}>
          <Field label="도메인">
            <input
              value={form.domain ?? ""}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              style={input}
            />
          </Field>
          <Field label="지원 단계">
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
              style={input}
            >
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <div style={row}>
          <Field label="기업 규모">
            <select
              value={form.company_size}
              onChange={(e) => setForm({ ...form, company_size: e.target.value })}
              style={input}
            >
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="지원 날짜">
            <input
              type="date"
              value={form.applied_at?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, applied_at: e.target.value })}
              style={input}
            />
          </Field>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={handleSave} disabled={saving} style={btnPrimary}>
            {saving ? "저장중..." : "저장"}
          </button>
          <button onClick={handleCancel} disabled={saving} style={btnSecondary}>
            취소
          </button>
        </div>
      </div>
    );
  }

  // ===== 뷰 모드 =====
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: "bold" }}>{job.company_name}</h2>
          <p style={{ color: "#666", marginTop: 4 }}>{job.job_title}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={badge}>{job.stage}</span>
          <button onClick={() => setIsEditing(true)} style={btnSecondary}>수정</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, fontSize: 14, color: "#555", flexWrap: "wrap" }}>
        {job.domain && <span>도메인: {job.domain}</span>}
        {job.company_size && <span>규모: {job.company_size}</span>}
        <span>지원일: {job.applied_at?.slice(0, 10)}</span>
      </div>

      {job.job_url && (
        <a
          href={job.job_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: 12, color: "#2563eb", fontSize: 14, textDecoration: "underline" }}
        >
          🔗 공고 링크 열기
        </a>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 20, marginBottom: 16 };
const row: React.CSSProperties = { display: "flex", gap: 12 };
const input: React.CSSProperties = { width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, boxSizing: "border-box" };
const badge: React.CSSProperties = { padding: "4px 10px", background: "#dbeafe", color: "#1e40af", borderRadius: 4, fontSize: 13 };
const btnPrimary: React.CSSProperties = { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 4, cursor: "pointer" };
const btnSecondary: React.CSSProperties = { padding: "6px 12px", background: "#f3f4f6", color: "#333", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer", fontSize: 13 };