"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, ClipboardCheck, LoaderCircle, Save, Sparkles, UserPlus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";

type ClassSession = { classId: string; subjectId: string; date: string; time: string; roomNo: string };
type Student = { studentId: string; name: string; email: string; section: string; deptId: string };
type Mark = "PRESENT" | "ABSENT";

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export default function AttendancePage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [role, setRole] = useState("FACULTY");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [notice, setNotice] = useState("");

  function applyStudents(nextStudents: Student[]) {
    setStudents(nextStudents);
    setMarks(Object.fromEntries(nextStudents.map((student) => [student.studentId, "PRESENT"] as const)));
  }

  useEffect(() => {
    window.setTimeout(() => setRole(getCookie("attendai_role") || "FACULTY"), 0);
    Promise.all([fetch("/api/classes?limit=100").then((response) => response.json()), fetch("/api/students?limit=100").then((response) => response.json())]).then(([classResult, studentResult]) => {
      const nextClasses = classResult.data ?? [];
      setClasses(nextClasses);
      setSelectedClass(nextClasses[0]?.classId ?? "");
      applyStudents(studentResult.data ?? []);
    }).catch(() => setNotice("Connect MongoDB to load live class data.")).finally(() => setLoading(false));
  }, []);

  function setAll(status: Mark) { setMarks(Object.fromEntries(students.map((student) => [student.studentId, status]))); }

  async function saveAttendance() {
    if (!selectedClass || students.length === 0) return;
    setSaving(true);
    const response = await fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ records: students.map((student) => ({ attendanceId: `ATT-${selectedClass}-${student.studentId}`, studentId: student.studentId, classId: selectedClass, status: marks[student.studentId] ?? "ABSENT", date: new Date().toISOString() })) }) });
    const result = await response.json();
    setSaving(false);
    setNotice(response.ok ? `${result.data.saved} attendance records saved.` : result.error);
  }

  async function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdding(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: form.get("studentId"), name: form.get("name"), email: form.get("email"), section: form.get("section"), deptId: form.get("deptId"), semester: Number(form.get("semester")) }) });
    const result = await response.json();
    setAdding(false);
    if (!response.ok) { setNotice(result.error || "Student could not be added."); return; }
    applyStudents([...students, result.data]);
    setShowAddStudent(false);
    setNotice("Student added to the roster.");
    event.currentTarget.reset();
  }

  async function removeStudent(student: Student) {
    if (!window.confirm(`Remove ${student.name} from the student directory?`)) return;
    const response = await fetch(`/api/students/${student.studentId}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setNotice(result.error || "Student could not be removed."); return; }
    applyStudents(students.filter((item) => item.studentId !== student.studentId));
    setNotice("Student removed from the directory.");
  }

  const present = students.filter((student) => marks[student.studentId] === "PRESENT").length;
  return <main className="attendance-shell"><header className="attendance-header"><button className="back-link attendance-back" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>ATTENDANCE COMMAND CENTER</small></div></div><div className="attendance-role">{role === "ADMIN" ? "ADMIN WORKSPACE" : role === "STUDENT" ? "STUDENT VIEW" : "TEACHER WORKSPACE"}</div></header><section className="attendance-content"><div className="attendance-intro"><div><div className="eyebrow"><span className="live-dot" /> LIVE REGISTER</div><h1>{role === "STUDENT" ? "Your attendance." : "Take attendance."}</h1><p>{role === "STUDENT" ? "Review attendance activity for your academic record." : "Add students, remove records, confirm each class register, and save an auditable record."}</p></div><div className="attendance-summary"><strong>{present}<span>/{students.length}</span></strong><small>present in this register</small></div></div>{role !== "STUDENT" && <section className="attendance-toolbar"><label>Class session<select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}><option value="">Select a class</option>{classes.map((item) => <option key={item.classId} value={item.classId}>{item.classId} · {item.subjectId} · {item.roomNo}</option>)}</select></label><div className="attendance-actions"><button className="outline-button" onClick={() => setShowAddStudent(!showAddStudent)}><UserPlus size={15} /> Add student</button><button className="outline-button" onClick={() => setAll("PRESENT")}><Check size={15} /> Mark all present</button><button className="outline-button" onClick={() => setAll("ABSENT")}><X size={15} /> Mark all absent</button></div></section>}{showAddStudent && role !== "STUDENT" && <form className="add-student-panel" onSubmit={addStudent}><div><strong>Add student</strong><span>New students appear in this live roster.</span></div><input required name="studentId" placeholder="Student ID" /><input required name="name" placeholder="Full name" /><input required name="email" type="email" placeholder="University email" /><input required name="deptId" placeholder="Department ID" defaultValue="CSE" /><input required name="section" placeholder="Section" defaultValue="A" /><input required name="semester" type="number" min="1" max="12" placeholder="Semester" defaultValue="1" /><button className="primary-button" disabled={adding}>{adding ? <LoaderCircle className="spin" size={15} /> : <UserPlus size={15} />} Add</button></form>}{loading ? <div className="attendance-empty"><LoaderCircle className="spin" size={22} /> Loading live roster...</div> : students.length === 0 ? <div className="attendance-empty"><Users size={22} /> No students found. Add the first student above.</div> : <section className="register-panel"><div className="register-heading"><div><h2>Student register</h2><p>{students.length} students ready to mark</p></div><ClipboardCheck size={20} /></div><div className="register-list">{students.map((student) => <div className="register-row" key={student.studentId}><div className="register-student"><span className="register-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.studentId} · {student.deptId} · Section {student.section}</small></div></div>{role !== "STUDENT" && <div className="status-toggle"><button className={marks[student.studentId] === "PRESENT" ? "selected present" : ""} onClick={() => setMarks({ ...marks, [student.studentId]: "PRESENT" })}><Check size={14} /> Present</button><button className={marks[student.studentId] === "ABSENT" ? "selected absent" : ""} onClick={() => setMarks({ ...marks, [student.studentId]: "ABSENT" })}><X size={14} /> Absent</button><button className="remove-student" onClick={() => removeStudent(student)} title="Remove student"><X size={13} /></button></div>}</div>)}</div>{role !== "STUDENT" && <div className="register-footer"><span>{notice || "Changes are saved when you submit the register."}</span><button className="primary-button" disabled={saving || !selectedClass} onClick={saveAttendance}>{saving ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />} {saving ? "Saving..." : "Save attendance"}</button></div>}</section>}{notice && <div className="toast" role="status">{notice}</div>}</section></main>;
}
