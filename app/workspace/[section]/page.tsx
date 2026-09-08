"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, CalendarDays, ClipboardList, GraduationCap, LoaderCircle, Mail, Plus, Settings, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const endpointMap: Record<string, { title: string; description: string; endpoint: string; icon: typeof Building2; fields: string[]; createFields?: string[] }> = {
  departments: { title: "Departments", description: "Live academic units and ownership context.", endpoint: "/api/departments?limit=100", icon: Building2, fields: ["deptId", "deptName", "hodName", "office"] },
  faculty: { title: "Faculty", description: "Teaching staff, contact details, and responsibilities.", endpoint: "/api/faculty?limit=100", icon: GraduationCap, fields: ["facultyId", "name", "email", "designation"] },
  subjects: { title: "Subjects", description: "Curriculum records connected to teaching staff.", endpoint: "/api/subjects?limit=100", icon: ClipboardList, fields: ["subjectId", "subjectName", "facultyId", "credits"] },
  classes: { title: "Classes", description: "Scheduled sessions available for attendance marking.", endpoint: "/api/classes?limit=100", icon: CalendarDays, fields: ["classId", "subjectId", "date", "time", "roomNo"], createFields: ["classId", "subjectId", "date", "time", "roomNo"] },
  assessments: { title: "Assessments", description: "Create assignments, quizzes, and assessment records.", endpoint: "/api/assessments?limit=100", icon: ClipboardList, fields: ["assessmentId", "classId", "type", "marks", "date"], createFields: ["assessmentId", "classId", "type", "marks", "date"] },
  alerts: { title: "Alerts", description: "Intervention signals that need review.", endpoint: "/api/alerts?limit=100", icon: Sparkles, fields: ["alertId", "studentId", "type", "message", "status"] },
};

function getCookie(name: string) { const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`)); return match ? decodeURIComponent(match[1]) : ""; }

export default function WorkspaceSectionPage() {
  const router = useRouter();
  const { section } = useParams<{ section: string }>();
  const config = endpointMap[section];
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(Boolean(config));
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => setRole(getCookie("attendai_role")), 0); return () => window.clearTimeout(timer); }, []);
  const loadRecords = useCallback(async () => { if (!config) return; setLoading(true); const response = await fetch(config.endpoint); const result = await response.json(); if (result.success) setRecords(result.data); else setNotice(result.error); setLoading(false); }, [config]);
  useEffect(() => { const timer = window.setTimeout(() => { loadRecords().catch(() => { setNotice("Live data is unavailable. Check MongoDB and Atlas Network Access."); setLoading(false); }); }, 0); return () => window.clearTimeout(timer); }, [loadRecords]);
  const Icon = config?.icon ?? Settings;
  const summary = useMemo(() => records.length ? `${records.length} live records` : "No records loaded", [records.length]);
  if (section === "settings") return <SettingsWorkspace router={router} />;
  if (!config) return <main className="data-shell"><section className="data-content"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><h1>Workspace section not found.</h1></section></main>;
  const canCreate = Boolean(config.createFields && (role === "ADMIN" || role === "FACULTY"));
  async function createRecord(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!config.createFields) return; setSaving(true); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(config.createFields.map((field) => [field, field === "marks" ? Number(form.get(field)) : form.get(field)])); const response = await fetch(config.endpoint.split("?")[0], { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json(); setSaving(false); if (!response.ok) { setNotice(result.error || "The record could not be created."); return; } setFormOpen(false); setNotice(`${config.title === "Assessments" ? "Assignment" : "Class"} created successfully.`); await loadRecords(); }
  const label = config.title === "Assessments" ? "assignment" : "class";
  return <main className="data-shell"><header className="data-header"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Icon size={18} /></div><div><strong>attend<span>ai</span></strong><small>LIVE WORKSPACE</small></div></div><span className="attendance-role">{summary}</span></header><section className="data-content"><div className="data-heading"><div><div className="eyebrow"><span className="live-dot" /> CONNECTED DATA</div><h1>{config.title}.</h1><p>{config.description}</p></div>{canCreate && <button className="primary-button workspace-create-button" onClick={() => setFormOpen(!formOpen)}><Plus size={15} /> Create {label}</button>}</div>{formOpen && canCreate && <form className="workspace-create-form" onSubmit={createRecord}>{config.createFields?.map((field) => <label key={field}>{field === "type" ? "Assessment type" : field}<input required name={field} type={field === "date" ? "date" : field === "marks" ? "number" : "text"} placeholder={field === "type" ? "Assignment, Quiz, CIA" : field} /></label>)}<button className="primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={15} /> : <Plus size={15} />} {saving ? "Creating..." : `Create ${label}`}</button></form>}{loading ? <div className="data-empty data-loading"><LoaderCircle className="spin" size={22} /> Loading live records...</div> : records.length === 0 ? <div className={`data-empty ${notice ? "data-error" : ""}`}><span>{notice || "No records found. Create one above or seed MongoDB to populate this workspace."}</span>{notice && <button className="outline-button" onClick={() => window.location.reload()}>Try again</button>}</div> : <div className="workspace-records">{records.map((record, index) => { const email = typeof record.email === "string" ? record.email : ""; return <article className="workspace-record" key={String(record._id ?? record[config.fields[0]] ?? index)}>{config.fields.map((field) => <div key={field}><span>{field}</span><strong>{String(record[field] ?? "-")}</strong></div>)}{email && <a href={`mailto:${email}`} aria-label={`Email ${String(record.name ?? "record")}`}><Mail size={15} /></a>}</article>; })}</div>}{notice && records.length > 0 && <div className="toast" role="status">{notice}</div>}</section></main>;
}

function SettingsWorkspace({ router }: { router: ReturnType<typeof useRouter> }) {
  const [attendanceThreshold, setAttendanceThreshold] = useState("75");
  const [riskThreshold, setRiskThreshold] = useState("60");
  const [saved, setSaved] = useState(false);
  function save() { localStorage.setItem("attendai_settings", JSON.stringify({ attendanceThreshold, riskThreshold })); setSaved(true); window.setTimeout(() => setSaved(false), 2200); }
  useEffect(() => { window.setTimeout(() => { const value = localStorage.getItem("attendai_settings"); if (value) { const parsed = JSON.parse(value) as { attendanceThreshold?: string; riskThreshold?: string }; if (parsed.attendanceThreshold) setAttendanceThreshold(parsed.attendanceThreshold); if (parsed.riskThreshold) setRiskThreshold(parsed.riskThreshold); } }, 0); }, []);
  return <main className="data-shell"><header className="data-header"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Settings size={18} /></div><div><strong>attend<span>ai</span></strong><small>WORKSPACE SETTINGS</small></div></div></header><section className="data-content"><div className="data-heading"><div><div className="eyebrow"><span className="live-dot" /> WORKSPACE CONTROL</div><h1>Settings.</h1><p>Configure the thresholds your academic team uses to prioritize support.</p></div></div><section className="settings-panel"><label>Attendance threshold <span>Students below this percentage are flagged for review.</span><div><input type="number" min="0" max="100" value={attendanceThreshold} onChange={(event) => setAttendanceThreshold(event.target.value)} /><b>%</b></div></label><label>High-risk threshold <span>Predictions below this percentage are marked high risk.</span><div><input type="number" min="0" max="100" value={riskThreshold} onChange={(event) => setRiskThreshold(event.target.value)} /><b>%</b></div></label><button className="primary-button" onClick={save}><Settings size={15} /> {saved ? "Settings saved" : "Save settings"}</button></section></section></main>;
}
