"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, CalendarDays, ClipboardList, GraduationCap, LoaderCircle, Mail, Settings, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const endpointMap: Record<string, { title: string; description: string; endpoint: string; icon: typeof Building2; fields: string[] }> = {
  departments: { title: "Departments", description: "Live academic units and ownership context.", endpoint: "/api/departments?limit=100", icon: Building2, fields: ["deptId", "deptName", "hodName", "office"] },
  faculty: { title: "Faculty", description: "Teaching staff, contact details, and responsibilities.", endpoint: "/api/faculty?limit=100", icon: GraduationCap, fields: ["facultyId", "name", "email", "designation"] },
  subjects: { title: "Subjects", description: "Curriculum records connected to teaching staff.", endpoint: "/api/subjects?limit=100", icon: ClipboardList, fields: ["subjectId", "subjectName", "facultyId", "credits"] },
  classes: { title: "Classes", description: "Scheduled sessions available for attendance marking.", endpoint: "/api/classes?limit=100", icon: CalendarDays, fields: ["classId", "subjectId", "date", "time", "roomNo"] },
  assessments: { title: "Assessments", description: "Assessment records and performance activity.", endpoint: "/api/assessments?limit=100", icon: ClipboardList, fields: ["assessmentId", "classId", "type", "marks", "date"] },
  alerts: { title: "Alerts", description: "Intervention signals that need review.", endpoint: "/api/alerts?limit=100", icon: Sparkles, fields: ["alertId", "studentId", "type", "message", "status"] },
};

export default function WorkspaceSectionPage() {
  const router = useRouter();
  const { section } = useParams<{ section: string }>();
  const config = endpointMap[section];
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(Boolean(config));
  const [notice, setNotice] = useState("");
  useEffect(() => { if (!config) return; fetch(config.endpoint).then((response) => response.json()).then((result) => { if (result.success) setRecords(result.data); else setNotice(result.error); }).catch(() => setNotice("Connect MongoDB to load live records.")).finally(() => setLoading(false)); }, [config]);
  const Icon = config?.icon ?? Settings;
  const summary = useMemo(() => records.length ? `${records.length} live records` : "No records loaded", [records.length]);
  if (!config) return <main className="data-shell"><section className="data-content"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><h1>Workspace section not found.</h1></section></main>;
  return <main className="data-shell"><header className="data-header"><button className="back-link" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Icon size={18} /></div><div><strong>attend<span>ai</span></strong><small>LIVE WORKSPACE</small></div></div><span className="attendance-role">{summary}</span></header><section className="data-content"><div className="data-heading"><div><div className="eyebrow"><span className="live-dot" /> CONNECTED DATA</div><h1>{config.title}.</h1><p>{config.description}</p></div></div>{loading ? <div className="data-empty"><LoaderCircle className="spin" size={22} /> Loading live records...</div> : records.length === 0 ? <div className="data-empty">{notice || "No records found. Seed MongoDB to populate this workspace."}</div> : <div className="workspace-records">{records.map((record, index) => { const email = typeof record.email === "string" ? record.email : ""; return <article className="workspace-record" key={String(record._id ?? record[config.fields[0]] ?? index)}>{config.fields.map((field) => <div key={field}><span>{field}</span><strong>{String(record[field] ?? "-")}</strong></div>)}{email && <a href={`mailto:${email}`} aria-label={`Email ${String(record.name ?? "record")}`}><Mail size={15} /></a>}</article>; })}</div>}{notice && records.length > 0 && <div className="toast" role="status">{notice}</div>}</section></main>;
}