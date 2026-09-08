"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Students", icon: Users },
  { label: "Departments", icon: Building2 },
  { label: "Faculty", icon: GraduationCap },
  { label: "Subjects", icon: BookOpen },
  { label: "Classes", icon: CalendarDays },
  { label: "Attendance", icon: ClipboardCheck },
  { label: "Assessments", icon: BarChart3 },
  { label: "Alerts", icon: Bell },
];

const attendance = [72, 78, 75, 83, 86, 81, 88, 91, 89, 94, 92, 96];
const departments = [
  { name: "Computer Science", value: 88, color: "#d7f15a" },
  { name: "Electronics", value: 82, color: "#74d8c2" },
  { name: "Mechanical", value: 76, color: "#8b8cf6" },
  { name: "Civil Engineering", value: 71, color: "#f2a65a" },
];
const students = [
  { initials: "AS", name: "Aarav Sharma", id: "STU-1024", dept: "Computer Science", attendance: 68, risk: "High", tone: "high" },
  { initials: "NM", name: "Nisha Menon", id: "STU-1188", dept: "Electronics", attendance: 73, risk: "Medium", tone: "medium" },
  { initials: "RK", name: "Rohan Kapoor", id: "STU-0931", dept: "Mechanical", attendance: 91, risk: "Low", tone: "low" },
  { initials: "SI", name: "Sara Iqbal", id: "STU-1102", dept: "Computer Science", attendance: 66, risk: "High", tone: "high" },
];
type DashboardData = { students: number; departments: number; faculty: number; subjects: number; classes: number; assessments: number; atRisk: number };

function StatCard({ label, value, change, icon: Icon, accent }: { label: string; value: string; change: string; icon: typeof Users; accent: string }) {
  return <div className="stat-card">
    <div className="stat-top"><span className="stat-label">{label}</span><span className="stat-icon" style={{ color: accent }}><Icon size={17} /></span></div>
    <div className="stat-value">{value}</div>
    <div className="stat-change"><ArrowUpRight size={13} /> {change} <span>vs last month</span></div>
  </div>;
}

const sectionDetails: Record<string, { eyebrow: string; title: string; description: string; rows: string[]; action: string }> = {
  Students: { eyebrow: "PEOPLE / 2,480 RECORDS", title: "Student intelligence", description: "Search profiles, attendance trajectories, and academic risk in one view.", rows: ["Aarav Sharma · 68% · High risk", "Sara Iqbal · 66% · High risk", "Nisha Menon · 73% · Medium risk"], action: "Open student directory" },
  Departments: { eyebrow: "STRUCTURE / 4 DEPARTMENTS", title: "Department performance", description: "Compare attendance health and intervention load across academic units.", rows: ["Computer Science · 88% attendance", "Electronics · 82% attendance", "Mechanical · 76% attendance"], action: "View department report" },
  Faculty: { eyebrow: "PEOPLE / 10 FACULTY", title: "Faculty workspace", description: "Assigned subjects, classes, and marking activity at a glance.", rows: ["Elena Torres · 4 subjects assigned", "Marcus Chen · 3 subjects assigned", "Isha Patel · 3 subjects assigned"], action: "Open faculty directory" },
  Subjects: { eyebrow: "CURRICULUM / 16 SUBJECTS", title: "Subject performance", description: "Understand attendance and assessment patterns by subject.", rows: ["Data Structures · 91% attendance", "Signals & Systems · 84% attendance", "Thermodynamics · 79% attendance"], action: "Browse subjects" },
  Classes: { eyebrow: "SCHEDULE / 94 CLASSES", title: "Class operations", description: "Today’s rooms, sessions, and attendance completion status.", rows: ["CS-204 · Data Structures · Complete", "EC-108 · Signals & Systems · In progress", "ME-301 · Thermodynamics · Scheduled"], action: "Open class schedule" },
  Attendance: { eyebrow: "RECORDS / LIVE REGISTER", title: "Attendance command center", description: "Mark, review, and audit attendance without duplicate records.", rows: ["1,842 students present today", "94 classes completed", "8 attendance exceptions"], action: "Mark attendance" },
  Assessments: { eyebrow: "PERFORMANCE / 342 RECORDS", title: "Assessment intelligence", description: "Track marks, assessment types, and performance movement by cohort.", rows: ["CIA · 182 submissions · 78.4% average", "Assignment · 96 submissions · 82.1% average", "Quiz · 64 submissions · 86.7% average"], action: "View assessments" },
  Alerts: { eyebrow: "ATTENTION / 8 OPEN ALERTS", title: "Alert center", description: "Make the next best intervention visible before a student disappears from the picture.", rows: ["HIGH_RISK · STU-1024 · 68% projected", "ATTENDANCE_DROP · STU-1102 · -12% this week", "PERFORMANCE_DROP · 3 students flagged"], action: "Review alerts" },
  Reports: { eyebrow: "OUTPUT / PRINT-READY", title: "Report studio", description: "Turn the current academic picture into a concise, shareable report.", rows: ["Overall attendance report · ready", "At-risk student report · ready", "AI prediction report · ready"], action: "Export report" },
  Settings: { eyebrow: "CONTROL / CONFIGURATION", title: "Workspace settings", description: "Configure thresholds, notification preferences, and the academic operating context.", rows: ["Attendance threshold · 75%", "High-risk threshold · 60%", "Notification delivery · in-app"], action: "Open settings" },
};

function WorkspaceDrawer({ section, onClose, onRowSelect }: { section: string; onClose: () => void; onRowSelect: (row: string) => void }) {
  const detail = sectionDetails[section];
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  if (!detail) return null;
  function openDetail(title: string) { setSelectedRow(title); onRowSelect(title); }
  return <div className="drawer-backdrop" onClick={onClose}><aside className="workspace-drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close workspace panel"><X size={18} /></button><div className="eyebrow"><span className="live-dot" /> {detail.eyebrow}</div><h2>{selectedRow ?? detail.title}</h2><p className="drawer-description">{selectedRow ? `Detailed workspace view for ${selectedRow}. Review the latest record, ownership, and next recommended action here.` : detail.description}</p><div className="drawer-signal"><Sparkles size={16} /><span>{selectedRow ? "Record selected" : "Live workspace signal"}</span><strong>{selectedRow ? "Open" : "Healthy"}</strong></div>{selectedRow ? <div className="drawer-detail"><span>RECOMMENDED NEXT STEP</span><strong>Review the live record in the connected workspace.</strong><button className="text-button" onClick={() => setSelectedRow(null)}>Back to {detail.title} <ArrowLeft size={14} /></button></div> : <div className="drawer-list">{detail.rows.map((row, index) => <button className="drawer-row" key={row} onClick={() => openDetail(row)}><span>0{index + 1}</span><p>{row}</p><ArrowUpRight size={14} /></button>)}</div>}<button className="primary-button drawer-action" onClick={() => openDetail(detail.action)}>{selectedRow ? "Open selected workspace" : detail.action} <ArrowUpRight size={16} /></button></aside></div>;
}

function LandingPage({ onLogin }: { onLogin: () => void }) {
  return <main className="landing-shell">
    <nav className="landing-nav"><div className="brand landing-brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>UNIVERSITY OS</small></div></div><div className="landing-links"><a href="#platform">Platform</a><a href="#workflow">How it works</a><a href="/about">About</a></div><button className="landing-login" onClick={onLogin}>Sign in <ArrowUpRight size={15} /></button></nav>
    <section className="landing-hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> THE INTELLIGENCE LAYER FOR EDUCATION</div><h1>See the signal<br /><em>behind every student.</em></h1><p>Attendai turns attendance, assessment, and academic risk into one clear operating picture for modern universities.</p><div className="hero-actions"><button className="primary-button hero-button" onClick={onLogin}>Enter workspace <ArrowUpRight size={16} /></button><a className="hero-secondary" href="#platform">Explore platform <ArrowDown size={15} /></a></div><div className="hero-proof"><span><strong>2,480</strong> students tracked</span><span><strong>84.6%</strong> avg. attendance</span><span><strong>24/7</strong> early signals</span></div></div><div className="hero-visual"><div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="hero-card hero-card-main"><div className="hero-card-head"><span>ATTENDANCE SIGNAL</span><MoreHorizontal size={16} /></div><div className="hero-metric">84.6% <small>+4.2%</small></div><div className="hero-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="hero-card-foot"><span>University-wide average</span><span>SEP 2025</span></div></div><div className="hero-card hero-card-float"><div className="float-icon"><Sparkles size={15} /></div><div><span>AI RISK DETECTED</span><strong>126 students</strong><small>may need intervention</small></div><ArrowUpRight size={16} /></div></div></section>
    <section className="landing-strip" id="platform"><span>ONE SYSTEM. EVERY SIGNAL.</span><div><strong>Attendance</strong><strong>Performance</strong><strong>Prediction</strong><strong>Action</strong></div></section>
    <section className="landing-features" id="workflow"><div><div className="eyebrow">BUILT FOR THE FULL ACADEMIC PICTURE</div><h2>From raw records to<br /><em>better outcomes.</em></h2></div><div className="feature-grid"><article><span>01</span><ClipboardCheck size={20} /><h3>Attendance, without the blind spots.</h3><p>See department and subject-level patterns before they become a student success problem.</p></article><article><span>02</span><Sparkles size={20} /><h3>Transparent predictive analytics.</h3><p>Baseline risk signals are explainable, timestamped, and ready for a real model when you are.</p></article><article><span>03</span><Users size={20} /><h3>One calm command center.</h3><p>Give administrators, faculty, and student support teams one shared operational view.</p></article></div></section>
    <section className="landing-story" aria-label="Why Attendai"><div className="landing-story-copy"><div className="eyebrow"><span className="live-dot" /> BUILT FOR DECISIVE ACADEMIC TEAMS</div><h2>Less chasing.<br /><em>More clarity.</em></h2><p>Attendai brings the daily academic picture into one calm workspace—so teams can move from recording attendance to supporting students at the right moment.</p><button className="primary-button" onClick={onLogin}>See your workspace <ArrowUpRight size={16} /></button></div><div className="outcome-grid"><article><span className="outcome-number">01</span><strong>Capture</strong><p>Record class attendance without duplicate registers.</p></article><article><span className="outcome-number">02</span><strong>Understand</strong><p>See the patterns behind departments, subjects, and students.</p></article><article><span className="outcome-number">03</span><strong>Act</strong><p>Give every team a shared, timely intervention view.</p></article></div></section>
    <footer className="landing-footer"><span>attendai / CHRIST UNIVERSITY</span><a href="/about">Read the product brief <ArrowUpRight size={14} /></a></footer>
  </main>;
}

export default function Home() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [dataSource, setDataSource] = useState<"demo" | "live">("demo");
  const [notice, setNotice] = useState("");
  const [drawer, setDrawer] = useState<string | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [userRole, setUserRole] = useState("ADMIN");
  const [userName, setUserName] = useState("Super Admin");
  const filteredStudents = useMemo(() => students.filter((student) => `${student.name} ${student.id} ${student.dept}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    const hasSession = document.cookie.includes("attendai_session=demo");
    const roleCookie = document.cookie.match(/(?:^|; )attendai_role=([^;]*)/);
    const nameCookie = document.cookie.match(/(?:^|; )attendai_name=([^;]*)/);
    window.setTimeout(() => setAuthenticated(hasSession), 0);
    window.setTimeout(() => {
      if (roleCookie) setUserRole(decodeURIComponent(roleCookie[1]));
      if (nameCookie) setUserName(decodeURIComponent(nameCookie[1]));
    }, 0);
    if (hasSession) {
      fetch("/api/dashboard").then((response) => response.json()).then((result) => {
        if (result.success) { setDataSource("live"); setDashboardData(result.data); }
      }).catch(() => undefined);
    }
  }, []);

  if (!authenticated) return <LandingPage onLogin={() => router.push("/login")} />;

  function exportReport() {
    const csv = ["Student,ID,Department,Attendance,Risk", ...students.map((student) => `${student.name},${student.id},${student.dept},${student.attendance}%,${student.risk}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a"); link.href = url; link.download = "attendai-student-risk-report.csv"; link.click(); URL.revokeObjectURL(url);
    setNotice("Report exported"); setTimeout(() => setNotice(""), 2400);
  }

  function openSection(label: string) {
    setActive(label);
    setMobileOpen(false);
    if (label === "Attendance") { router.push("/attendance"); return; }
    if (label === "Students") { router.push("/students"); return; }
    if (label === "Overview") { setDrawer(null); return; }
    if (label === "Reports") { exportReport(); return; }
    if (label === "Settings") { router.push("/workspace/settings"); return; }
    router.push(`/workspace/${label.toLowerCase().replaceAll(" ", "-")}`);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    document.cookie = "attendai_session=; path=/; max-age=0";
    document.cookie = "attendai_role=; path=/; max-age=0";
    document.cookie = "attendai_name=; path=/; max-age=0";
    router.push("/login");
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>UNIVERSITY OS</small></div><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="workspace"><span className="workspace-dot" /> CHRIST UNIVERSITY <ChevronDown size={14} /></div>
      <nav className="nav-list" aria-label="Primary navigation">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => openSection(label)}><Icon size={17} /><span>{label}</span>{label === "Alerts" && <b>8</b>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => openSection("Reports")}><BarChart3 size={17} /><span>Reports</span></button><button className="nav-item" onClick={() => openSection("Settings")}><Settings size={17} /><span>Settings</span></button><div className="user-card"><div className="avatar avatar-pink">{userName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><strong>{userName}</strong><small>{userRole === "FACULTY" ? "Teacher" : userRole === "STUDENT" ? "Student" : "Administrator"}</small></div><button className="logout-button" onClick={logout} aria-label="Log out" title="Log out">Log out</button></div></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{active}</strong></div><div className="top-actions"><label className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students..." aria-label="Search students" /><kbd>⌘ K</kbd></label><button className="icon-button" aria-label="Help" onClick={() => setNotice("Search students, departments, and alerts") }><CircleHelp size={19} /></button><button className="icon-button notification" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={19} /><i /></button><div className="avatar avatar-pink">{userName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div></div>{notificationsOpen && <div className="notification-popover"><div><strong>Notifications</strong><button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={14} /></button></div><p><span className="notification-dot orange" /> 3 students entered high-risk range</p><p><span className="notification-dot lime" /> Weekly attendance report is ready</p><p><span className="notification-dot teal" /> 94 classes completed today</p></div>}</header>
      <div className="page-wrap">
        <section className="page-heading"><div><div className="eyebrow"><span className="live-dot" /> {dataSource === "live" ? "LIVE ACADEMIC OVERVIEW" : "DEMO PREVIEW · CONNECT MONGODB FOR LIVE DATA"}</div><h1>Good morning, {userName} <span>↗</span></h1><p>{userRole === "FACULTY" ? "Your teaching workspace is ready for today&apos;s classes." : userRole === "STUDENT" ? "Here&apos;s your academic picture today." : "Here&apos;s what&apos;s happening across your university today."}</p></div><div className="heading-actions"><div className="date-wrap"><button className="date-button" onClick={() => setDateOpen(!dateOpen)}><CalendarDays size={16} /> Sep 01 – Sep 30, 2025 <ChevronDown size={14} /></button>{dateOpen && <div className="date-popover"><strong>Reporting period</strong><button onClick={() => setDateOpen(false)}>September 2025 <Check size={14} /></button><button onClick={() => setDateOpen(false)}>August 2025</button><button onClick={() => setDateOpen(false)}>Last 30 days</button></div>}</div><button className="primary-button" onClick={exportReport}><ArrowUpRight size={16} /> Export report</button></div></section>
        <section className="stats-grid"><StatCard label="Total students" value={dashboardData ? dashboardData.students.toLocaleString() : "--"} change="12.8%" icon={Users} accent="#a5f39a" /><StatCard label="Avg. attendance" value="84.6%" change="4.2%" icon={ClipboardCheck} accent="#8fd8ed" /><StatCard label="At-risk students" value={dashboardData ? dashboardData.atRisk.toLocaleString() : "--"} change="8.4%" icon={AlertTriangle} accent="#ff866f" /><StatCard label="Assessments" value={dashboardData ? dashboardData.assessments.toLocaleString() : "--"} change="16.5%" icon={BarChart3} accent="#a99bff" /></section>
        <section className="dashboard-grid"><div className="panel attendance-panel"><div className="panel-heading"><div><h2>Attendance overview</h2><p>University-wide attendance trend</p></div><button className="select-button">Last 12 months <ChevronDown size={14} /></button></div><div className="chart-wrap"><div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="line-chart"><div className="grid-lines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 720 220" preserveAspectRatio="none" aria-label="Attendance trend chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d7f15a" stopOpacity=".22" /><stop offset="1" stopColor="#d7f15a" stopOpacity="0" /></linearGradient></defs><path d="M0 150 C45 138, 55 130, 95 137 S150 112, 190 124 S235 96, 275 112 S330 93, 365 102 S415 78, 455 91 S500 72, 535 81 S585 57, 625 68 S680 35, 720 45 L720 220 L0 220Z" fill="url(#chartFill)" /><path d="M0 150 C45 138, 55 130, 95 137 S150 112, 190 124 S235 96, 275 112 S330 93, 365 102 S415 78, 455 91 S500 72, 535 81 S585 57, 625 68 S680 35, 720 45" fill="none" stroke="#d7f15a" strokeWidth="3" strokeLinecap="round" /></svg><div className="chart-x"><span>Oct</span><span>Dec</span><span>Feb</span><span>Apr</span><span>Jun</span><span>Aug</span><span>Sep</span></div></div></div><div className="chart-footer"><span><i className="legend-line" /> Attendance rate</span><strong>84.6% <em>+4.2%</em></strong></div></div>
          <div className="panel department-panel"><div className="panel-heading"><div><h2>By department</h2><p>Attendance performance</p></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="department-list">{departments.map((item) => <div className="department-row" key={item.name}><div className="dept-meta"><span className="dept-dot" style={{ background: item.color }} /><span>{item.name}</span></div><div className="dept-bar"><i style={{ width: `${item.value}%`, background: item.color }} /></div><strong>{item.value}%</strong></div>)}</div><button className="text-button">View all departments <ArrowUpRight size={14} /></button></div></section>
        <section className="bottom-grid"><div className="panel students-panel"><div className="panel-heading"><div><h2>Students needing attention</h2><p>{query ? `${filteredStudents.length} matching students` : "Based on attendance and predictive risk"}</p></div><button className="text-button" onClick={() => setQuery("")}>View all <ArrowUpRight size={14} /></button></div><div className="student-table"><div className="table-head"><span>STUDENT</span><span>DEPARTMENT</span><span>ATTENDANCE</span><span>RISK</span><span /></div>{filteredStudents.map((student) => <div className="student-row" key={student.id}><div className="student-name"><div className={`avatar avatar-${student.tone}`}>{student.initials}</div><div><strong>{student.name}</strong><small>{student.id}</small></div></div><span className="muted-cell">{student.dept}</span><div className="attendance-cell"><span>{student.attendance}%</span><div><i style={{ width: `${student.attendance}%` }} /></div></div><span className={`risk risk-${student.tone}`}>{student.risk}</span><MoreHorizontal size={17} className="row-more" /></div>)}</div>{filteredStudents.length === 0 && <div className="empty-state">No students match that search.</div>}</div><div className="panel pulse-panel"><div className="panel-heading"><div><h2>Quick pulse</h2><p>Today&apos;s activity</p></div><span className="pulse-date">SEP 18</span></div><div className="pulse-stat"><div className="pulse-number">1,842</div><span>present today</span><div className="mini-bars">{attendance.map((value, i) => <i key={i} style={{ height: `${value - 58}%`, background: i > 8 ? "#d7f15a" : "#39403c" }} />)}</div></div><div className="pulse-events"><div><span className="event-icon event-green"><ClipboardCheck size={15} /></span><p><strong>94 classes</strong> completed<small>Across 18 departments</small></p></div><div><span className="event-icon event-orange"><AlertTriangle size={15} /></span><p><strong>8 alerts</strong> generated<small>3 require your attention</small></p></div></div></div></section>
      </div>
      {notice && <div className="toast" role="status">{notice}</div>}
      {drawer && sectionDetails[drawer] && <WorkspaceDrawer section={drawer} onClose={() => setDrawer(null)} onRowSelect={(row) => { setNotice(`${row} opened`); setTimeout(() => setNotice(""), 2500); }} />}
    </main>
  </div>;
}
