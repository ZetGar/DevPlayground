"use client";

import { useState } from "react";
import { updateUserQuestions, type UserQuestion } from "@/lib/supabase/applications";

type Props = {
  applicationId: string;
  initialQuestions: UserQuestion[];
};

export default function UserQASection({ applicationId, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<UserQuestion[]>(initialQuestions ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "", memo: "" });
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm({ question: "", answer: "", memo: "" });
    setEditingId(null);
    setIsAdding(false);
  };

  const persist = async (next: UserQuestion[]) => {
    setSaving(true);
    try {
      await updateUserQuestions(applicationId, next);
      setQuestions(next);
      resetForm();
    } catch (e) {
      alert("저장 실패: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!form.question.trim()) return alert("질문을 입력해주세요.");
    const now = new Date().toISOString();
    const newItem: UserQuestion = {
      id: crypto.randomUUID(),
      question: form.question,
      answer: form.answer,
      memo: form.memo,
      created_at: now,
      updated_at: now,
    };
    await persist([...questions, newItem]);
  };

  const handleUpdate = async (id: string) => {
    if (!form.question.trim()) return alert("질문을 입력해주세요.");
    const next = questions.map((q) =>
      q.id === id
        ? { ...q, ...form, updated_at: new Date().toISOString() }
        : q
    );
    await persist(next);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 질문을 삭제할까요?")) return;
    await persist(questions.filter((q) => q.id !== id));
  };

  const startEdit = (q: UserQuestion) => {
    setEditingId(q.id);
    setIsAdding(false);
    setForm({ question: q.question, answer: q.answer, memo: q.memo ?? "" });
  };

  return (
    <section style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: "bold" }}>예상 질문 & 답변</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setForm({ question: "", answer: "", memo: "" }); }}
            style={btnPrimary}
          >
            + 질문 추가
          </button>
        )}
      </div>

      {/* 추가 폼 */}
      {isAdding && (
        <FormBlock
          form={form}
          setForm={setForm}
          onSubmit={handleAdd}
          onCancel={resetForm}
          submitLabel="등록"
          saving={saving}
        />
      )}

      {/* 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {questions.length === 0 && !isAdding && (
          <p style={{ color: "#888", textAlign: "center", padding: 24 }}>
            아직 등록된 질문이 없습니다. 위에서 추가해보세요.
          </p>
        )}
        {questions.map((q) =>
          editingId === q.id ? (
            <FormBlock
              key={q.id}
              form={form}
              setForm={setForm}
              onSubmit={() => handleUpdate(q.id)}
              onCancel={resetForm}
              submitLabel="저장"
              saving={saving}
            />
          ) : (
            <article key={q.id} style={card}>
              <p style={{ fontWeight: "bold", marginBottom: 8 }}>Q. {q.question}</p>
              {q.answer && <p style={{ marginBottom: 8, whiteSpace: "pre-wrap" }}>A. {q.answer}</p>}
              {q.memo && (
                <p style={{ fontSize: 13, color: "#666", background: "#f6f6f6", padding: 8, borderRadius: 4 }}>
                  📝 {q.memo}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => startEdit(q)} style={btnSecondary}>수정</button>
                <button onClick={() => handleDelete(q.id)} style={btnDanger}>삭제</button>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

function FormBlock({ form, setForm, onSubmit, onCancel, submitLabel, saving }: any) {
  return (
    <div style={{ ...card, marginBottom: 12 }}>
      <label style={label}>질문 *</label>
      <input
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
        placeholder="예: 본인의 강점은 무엇인가요?"
        style={input}
      />
      <label style={label}>답변</label>
      <textarea
        value={form.answer}
        onChange={(e) => setForm({ ...form, answer: e.target.value })}
        placeholder="답변을 작성하세요"
        rows={4}
        style={{ ...input, resize: "vertical" }}
      />
      <label style={label}>메모</label>
      <textarea
        value={form.memo}
        onChange={(e) => setForm({ ...form, memo: e.target.value })}
        placeholder="추가로 기억할 점이나 면접관 반응 예측 등"
        rows={2}
        style={{ ...input, resize: "vertical" }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onSubmit} disabled={saving} style={btnPrimary}>
          {saving ? "저장중..." : submitLabel}
        </button>
        <button onClick={onCancel} disabled={saving} style={btnSecondary}>취소</button>
      </div>
    </div>
  );
}

// 인라인 스타일 (기존 코드 스타일에 맞게 조정하세요)
const card: React.CSSProperties = { border: "1px solid #ddd", borderRadius: 8, padding: 16, background: "#fff" };
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginTop: 8, marginBottom: 4 };
const input: React.CSSProperties = { width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, marginBottom: 4 };
const btnPrimary: React.CSSProperties = { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 4, cursor: "pointer" };
const btnSecondary: React.CSSProperties = { padding: "8px 16px", background: "#f3f4f6", color: "#333", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" };
const btnDanger: React.CSSProperties = { padding: "8px 16px", background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: 4, cursor: "pointer" };