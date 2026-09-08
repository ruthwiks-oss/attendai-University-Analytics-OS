"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardCheck, LoaderCircle, Sparkles, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

type Student = { studentId: string; name: string; email: string; section: string; deptId: string; semester: number };
type Attendance = { status: "PRESENT" | "ABSENT"; date: string; classId: string };

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/students?limit=100").then((response) => response.json()).then((result) => { const data = result.data ?? []; setStudents(data); setSelected(data[0] ?? null); }).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (selected) fetch(`/api/students/${selected.studentId}/attendance`).then((response) => response.json()).then((result) => setAttendance(result.data ?? [])); }, [selected]);

  const present = attendance.filter((item) => item.status === "PRESENT").length;
  return <main className="student-shell"><header className="student-header"><button className="back-link attendance-back" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>STUDENT INTELLIGENCE</small></div></div><span className="attendance-role">STUDENT DIRECTORY</span></header><section className="student-content"><div className="eyebrow"><span className="live-dot" /> PEOPLE / LIVE RECORDS</div><h1>Student dashboard.</h1><p className="student-lede">Open any student to see their academic identity and attendance trail.</p>{loading ? <div className="attendance-empty"><LoaderCircle className="spin" size={22} /> Loading students...</div> : <div className="student-layout"><aside className="student-directory">{students.map((student) => <button className={selected?.studentId === student.studentId ? "student-directory-row selected" : "student-directory-row"} key={student.studentId} onClick={() => setSelected(student)}><span className="register-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span><strong>{student.name}</strong><small>{student.studentId} · {student.deptId}</small></span></button>)}</aside>{selected && <section className="student-profile"><div className="student-profile-head"><div className="profile-avatar"><UserRound size={30} /></div><div><span className="eyebrow">{selected.studentId}</span><h2>{selected.name}</h2><p>{selected.email} · Semester {selected.semester} · Section {selected.section}</p></div></div><div className="student-stats"><div><strong>{attendance.length ? `${Math.round((present / attendance.length) * 100)}%` : "--"}</strong><span>attendance rate</span></div><div><strong>{present}</strong><span>classes present</span></div><div><strong>{attendance.length - present}</strong><span>classes missed</span></div></div><div className="student-history"><div className="panel-heading"><div><h2>Attendance trail</h2><p>Most recent class activity</p></div><ClipboardCheck size={18} /></div>{attendance.length === 0 ? <div className="attendance-empty">No attendance has been recorded yet.</div> : attendance.map((record) => <div className="student-history-row" key={`${record.classId}-${record.date}`}><span>{record.classId}</span><span>{new Date(record.date).toLocaleDateString()}</span><strong className={record.status === "PRESENT" ? "history-present" : "history-absent"}>{record.status}</strong></div>)}</div></section>}</div>}</section></main>;
}
