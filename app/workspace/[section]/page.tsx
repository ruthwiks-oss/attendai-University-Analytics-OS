"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, CalendarDays, ClipboardList, GraduationCap, LoaderCircle, Mail, Plus, Settings, Sparkles, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type Field = { name: string; label: string; type?: "text" | "email" | "number" | "date" };
type Config = { title: string; description: string; endpoint: string; icon: typeof Building2; fields: string[]; createFields?: Field[] };

const endpointMap: Record<string, Config> = {
  departments: { title: "Departments", description: "Academic units and ownership context.", endpoint: "/api/departments?limit=100", icon: Building2, fields: ["deptId", "deptName", "hodName", "office"], createFields: [{ name: "deptId", label: "Department ID" }, { name: "deptName", label: "Department name" }, { name: "hodName", label: "Head of department" }, { name: "office", label: "Office" }] },
  faculty: { title: "Faculty", description: "Teaching staff, contact details, and responsibilities.", endpoint: "/api/faculty?limit=100", icon: GraduationCap, fields: ["facultyId", "name", "email", "designation"], createFields: [{ name: "facultyId", label: "Faculty ID" }, { name: "name", label: "Full name" }, { name: "email", label: "Email", type: "email" }, { name: "designation", label: "Designation" }] },
  subjects: { title: "Subjects", description: "Curriculum records connected to teaching staff.", endpoint: "/api/subjects?limit=100", icon: ClipboardList, fields: ["subjectId", "subjectName", "facultyId", "credits"], createFields: [{ name: "subjectId", label: "Subject ID" }, { name: "subjectName", label: "Subject name" }, { name: "facultyId", label: "Faculty ID" }, { name: "credits", label: "Credits", type: "number" }] },
  classes: { title: "Classes", description: "Scheduled sessions available for attendance marking.", endpoint: "/api/classes?limit=100", icon: CalendarDays, fields: ["classId", "subjectId", "date", "time", "roomNo"], createFields: [{ name: "classId", label: "Class ID" }, { name: "subjectId", label: "Subject ID" }, { name: "date", label: "Date", type: "date" }, { name: "time", label: "Time" }, { name: "roomNo", label: "Room number" }] },
  assessments: { title: "Assessments", description: "Assignments, quizzes, and assessment records.", endpoint: "/api/assessments?limit=100", icon: ClipboardList, fields: ["assessmentId", "classId", "type", "marks", "date"], createFields: [{ name: "assessmentId", label: "Assessment ID" }, { name: "classId", label: "Class ID" }, { name: "type", label: "Assessment type" }, { name: "marks", label: "Marks", type: "number" }, { name: "date", label: "Date", type: "date" }] },
  alerts: { title: "Alerts", description: "Intervention signals that need review.", endpoint: "/api/alerts?limit=100", icon: Sparkles, fields: ["alertId", "predictionId", "alertType", "alertDate", "message"], createFields: [{ name: "alertId", label: "Alert ID" }, { name: "predictionId", label: "Prediction ID" }, { name: "alertType", label: "Alert type" }, { name: "alertDate", label: "Alert date", type: "date" }, { name: "message", label: "Message" }] },
};

function getCookie(name: string) { const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`)); return match ? decodeURIComponent(match[1]) : ""; }

function SettingsWorkspace({ router, canEdit }: { router: ReturnType<typeof useRouter>; canEdit: boolean }) {
  const [attendanceThreshold, setAttendanceThreshold] = useState("75");
  const [riskThreshold, setRiskThreshold] = useState("60");
  const [saved, setSaved] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { const value = localStorage.getItem("attendai_settings"); if (!value) return; const parsed = JSON.parse(value) as { attendanceThreshold?: string; riskThreshold?: string }; setAttendanceThreshold(parsed.attendanceThreshold ?? "75"); setRiskThreshold(parsed.riskThreshold ?? "60"); }, 0); return () => window.clearTimeout(timer); }, []);
  function save() { localStorage.setItem("attendai_settings", JSON.stringify({ attendanceThreshold, riskThreshold })); setSaved(true); window.setTimeout(() => setSaved(false), 2200); }
  return <main className="data-shell"><header className="data-header"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Settings size={18} /></div><div><strong>attend<span>ai</span></strong><small>WORKSPACE SETTINGS</small></div></div></header><section className="data-content"><div className="data-heading"><div><div className="eyebrow"><span className="live-dot" /> WORKSPACE CONTROL</div><h1>Settings.</h1><p>Configure the thresholds your academic team uses to prioritize support.</p></div></div><section className="settings-panel"><label>Attendance threshold <span>Students below this percentage are flagged for review.</span><div><input disabled={!canEdit} type="number" min="0" max="100" value={attendanceThreshold} onChange={(event) => setAttendanceThreshold(event.target.value)} /><b>%</b></div></label><label>High-risk threshold <span>Predictions below this percentage are marked high risk.</span><div><input disabled={!canEdit} type="number" min="0" max="100" value={riskThreshold} onChange={(event) => setRiskThreshold(event.target.value)} /><b>%</b></div></label>{canEdit ? <button className="primary-button" onClick={save}><Settings size={15} /> {saved ? "Settings saved" : "Save settings"}</button> : <p className="data-empty">Settings are managed by Faculty or Administrators.</p>}</section></section></main>;
}

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
  const canEdit = role === "ADMIN" || role === "FACULTY";

  useEffect(() => { const timer = window.setTimeout(() => setRole(getCookie("attendai_role")), 0); return () => window.clearTimeout(timer); }, []);
  const loadRecords = useCallback(async () => { if (!config) return; setLoading(true); const response = await fetch(config.endpoint); const result = await response.json(); if (result.success) setRecords(result.data); else setNotice(result.error); setLoading(false); }, [config]);
  useEffect(() => { const timer = window.setTimeout(() => { loadRecords().catch(() => { setNotice("Live data is unavailable. Check MongoDB and Atlas Network Access."); setLoading(false); }); }, 0); return () => window.clearTimeout(timer); }, [loadRecords]);

  const summary = useMemo(() => records.length ? `${records.length} live records` : "No records loaded", [records.length]);
  if (section === "settings") return <SettingsWorkspace router={router} canEdit={canEdit} />;
  if (!config) return <main className="data-shell"><section className="data-content"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><h1>Workspace section not found.</h1></section></main>;
  const Icon = config.icon;

  async function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config.createFields) return;
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(config.createFields.map((field) => [field.name, field.type === "number" ? Number(form.get(field.name)) : form.get(field.name)]));
    const response = await fetch(config.endpoint.split("?")[0], { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) { setNotice(result.error || "The record could not be created."); return; }
    setFormOpen(false); setNotice(`${config.title.slice(0, -1)} created successfully.`); await loadRecords();
  }

  async function deleteRecord(record: Record<string, unknown>) {
    const id = String(record._id ?? record[config.fields[0]] ?? "");
    if (!id || !window.confirm(`Delete this ${config.title.slice(0, -1).toLowerCase()} record? This cannot be undone.`)) return;
    const response = await fetch(`${config.endpoint.split("?")[0]}/${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setNotice(result.error || "The record could not be deleted."); return; }
    setNotice("Record deleted."); await loadRecords();
  }

  return <main className="data-shell"><header className="data-header"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Icon size={18} /></div><div><strong>attend<span>ai</span></strong><small>LIVE WORKSPACE</small></div></div><span className="attendance-role">{summary}</span></header><section className="data-content"><div className="data-heading"><div><div className="eyebrow"><span className="live-dot" /> CONNECTED DATA</div><h1>{config.title}.</h1><p>{config.description}</p></div>{canEdit && <button className="primary-button workspace-create-button" onClick={() => setFormOpen(!formOpen)}><Plus size={15} /> Create record</button>}</div>{canEdit && formOpen && <form className="workspace-create-form" onSubmit={createRecord}>{config.createFields?.map((field) => <label key={field.name}>{field.label}<input required name={field.name} type={field.type ?? "text"} min={field.type === "number" ? "0" : undefined} /></label>)}<button className="primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={15} /> : <Plus size={15} />} {saving ? "Creating..." : "Create record"}</button></form>}{loading ? <div className="data-empty data-loading"><LoaderCircle className="spin" size={22} /> Loading live records...</div> : records.length === 0 ? <div className={`data-empty ${notice ? "data-error" : ""}`}><span>{notice || "No records found. Faculty and Administrators can create the first record."}</span>{notice && <button className="outline-button" onClick={() => void loadRecords()}>Try again</button>}</div> : <div className="workspace-records">{records.map((record, index) => { const email = typeof record.email === "string" ? record.email : ""; const recordId = String(record._id ?? record[config.fields[0]] ?? index); return <article className="workspace-record" key={recordId}>{config.fields.map((field) => <div key={field}><span>{field}</span><strong>{String(record[field] ?? "-")}</strong></div>)}<div className="workspace-record-actions">{email && <a href={`mailto:${email}`} aria-label={`Email ${String(record.name ?? "record")}`}><Mail size={15} /></a>}{canEdit && <button className="record-delete" onClick={() => void deleteRecord(record)} aria-label="Delete record" title="Delete record"><Trash2 size={15} /></button>}</div></article>; })}</div>}{notice && records.length > 0 && <div className="toast" role="status">{notice}</div>}</section></main>;
}
