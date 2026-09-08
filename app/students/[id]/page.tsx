"use client";
/* This profile includes display copy with an apostrophe inside a single JSX line. */
/* eslint-disable react/no-unescaped-entities */

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, ClipboardCheck, LoaderCircle, Save, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type Student = { studentId: string; name: string; email: string; section?: string; deptId?: string; semester?: number };
export default function StudentDashboard() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [section, setSection] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { const match = document.cookie.match(/(?:^|; )attendai_role=([^;]*)/); if (match) setRole(decodeURIComponent(match[1])); }, 0); fetch(`/api/students/${params.id}`).then((response) => response.json()).then((result) => { const data = result.data ?? null; setStudent(data); setSection(data?.section ?? ""); }).finally(() => setLoading(false)); return () => window.clearTimeout(timer); }, [params.id]);
  async function saveSection(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!student) return; setSaving(true); const response = await fetch(`/api/students/${student.studentId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section }) }); const result = await response.json(); setSaving(false); if (!response.ok) { setNotice(result.error || "Section could not be updated."); return; } setStudent(result.data); setNotice("Section updated successfully."); }
  return <main className="data-shell"><header className="data-header"><button className="back-link" onClick={() => router.push("/students")}><ArrowLeft size={15} /> Student directory</button><div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>STUDENT PROFILE</small></div></div></header><section className="data-content">{loading ? <div className="data-empty data-loading"><LoaderCircle className="spin" size={22} /> Loading profile...</div> : student ? <><div className="profile-hero"><div className="profile-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><div className="eyebrow"><span className="live-dot" /> STUDENT PROFILE</div><h1>{student.name}</h1><p>{student.studentId} · {student.email}</p></div></div><div className="profile-grid"><div><span>DEPARTMENT</span><strong>{student.deptId ?? "Not assigned"}</strong></div><div><span>SECTION</span><strong>{student.section ?? "Not assigned"}</strong></div><div><span>SEMESTER</span><strong>{student.semester ?? "Not assigned"}</strong></div><div><span>ATTENDANCE</span><strong>Open attendance records</strong></div></div>{(role === "ADMIN" || role === "FACULTY") && <form className="section-editor" onSubmit={saveSection}><div><strong>Edit section</strong><span>Update this student's academic section.</span></div><input required value={section} onChange={(event) => setSection(event.target.value)} placeholder="e.g. A" /><button className="primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />} {saving ? "Saving..." : "Save section"}</button></form>}{notice && <div className="toast" role="status"><Check size={14} /> {notice}</div>}<button className="primary-button" onClick={() => router.push("/attendance")}><ClipboardCheck size={15} /> Open attendance workspace</button></> : <div className="data-empty">Student record not found.</div>}</section></main>;
}
