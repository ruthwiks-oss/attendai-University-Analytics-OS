"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardCheck, LoaderCircle, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type Student = { studentId: string; name: string; email: string; section?: string; deptId?: string; semester?: number };
export default function StudentDashboard() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`/api/students/${params.id}`).then((response) => response.json()).then((result) => setStudent(result.data ?? null)).finally(() => setLoading(false)); }, [params.id]);
  return <main className="data-shell"><header className="data-header"><button className="back-link" onClick={() => router.push("/students")}><ArrowLeft size={15} /> Student directory</button><div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>STUDENT PROFILE</small></div></div></header><section className="data-content">{loading ? <div className="data-empty"><LoaderCircle className="spin" size={22} /> Loading profile...</div> : student ? <><div className="profile-hero"><div className="profile-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><div className="eyebrow"><span className="live-dot" /> STUDENT PROFILE</div><h1>{student.name}</h1><p>{student.studentId} · {student.email}</p></div></div><div className="profile-grid"><div><span>DEPARTMENT</span><strong>{student.deptId ?? "Not assigned"}</strong></div><div><span>SECTION</span><strong>{student.section ?? "Not assigned"}</strong></div><div><span>SEMESTER</span><strong>{student.semester ?? "Not assigned"}</strong></div><div><span>ATTENDANCE</span><strong>Connect attendance records</strong></div></div><button className="primary-button" onClick={() => router.push("/attendance")}><ClipboardCheck size={15} /> Open attendance workspace</button></> : <div className="data-empty">Student record not found.</div>}</section></main>;
}