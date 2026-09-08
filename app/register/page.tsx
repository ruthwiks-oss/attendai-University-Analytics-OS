"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, LoaderCircle, Sparkles } from "lucide-react";

const roleOptions = [
  { value: "ADMIN", label: "Administrator", description: "Manage the university workspace" },
  { value: "FACULTY", label: "Faculty", description: "Take attendance and support students" },
  { value: "STUDENT", label: "Student", description: "Review your academic record" },
] as const;

type Role = (typeof roleOptions)[number]["value"];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("FACULTY");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password"), role }) });
      const result = await response.json();
      if (!response.ok) { setStatus(result.error || "Account creation could not be completed."); return; }
      document.cookie = "attendai_session=demo; path=/; max-age=86400; samesite=lax";
      document.cookie = `attendai_role=${role}; path=/; max-age=86400; samesite=lax`;
      document.cookie = `attendai_name=${encodeURIComponent(String(form.get("name")))}; path=/; max-age=86400; samesite=lax`;
      router.push("/");
    } catch { setStatus("The server could not be reached. Check your connection and try again."); }
    finally { setLoading(false); }
  }

  return <main className="auth-shell register-shell">
    <aside className="auth-aside"><Link className="back-link" href="/login"><ArrowLeft size={15} /> Back to sign in</Link><div className="auth-aside-copy"><div className="brand landing-brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>CHRIST UNIVERSITY OS</small></div></div><div className="register-aside-kicker">A CLEARER ACADEMIC PICTURE</div><h1>Build the right<br /><em>academic picture.</em></h1><p>Create a secure workspace identity for your university team and give every role the right view of the work.</p><div className="register-aside-list"><span><i>01</i> Choose a role that matches your work</span><span><i>02</i> Save the account securely in MongoDB</span><span><i>03</i> Enter the live university workspace</span></div></div><span className="auth-footer">CHRIST UNIVERSITY / 2025</span></aside>
    <section className="auth-panel"><div className="auth-form-wrap register-form-wrap"><div className="auth-mobile-brand"><div className="brand-mark"><Sparkles size={18} /></div><strong>attend<span>ai</span></strong></div><div className="eyebrow">CREATE UNIVERSITY USER</div><h2>Join the workspace.</h2><p className="auth-subtitle">Create an account for CHRIST UNIVERSITY.</p><form onSubmit={submit}><div className="register-field-grid"><label>Full name<input required name="name" minLength={2} autoComplete="name" placeholder="e.g. Ananya Sharma" /></label><label>University email<input required name="email" type="email" autoComplete="email" placeholder="you@christuniversity.edu" /></label></div><label>Password<input required name="password" minLength={8} type="password" autoComplete="new-password" placeholder="At least 8 characters" /></label><div className="role-picker register-role"><div className="role-picker-heading"><span>ACCESS ROLE</span><small>Choose what this account can do</small></div><div className="role-options">{roleOptions.map((item) => <button type="button" key={item.value} className={role === item.value ? "selected" : ""} aria-pressed={role === item.value} onClick={() => setRole(item.value)}>{role === item.value ? <Check size={15} /> : <span className="role-option-dot" />}<span><strong>{item.label}</strong><small>{item.description}</small></span></button>)}</div></div>{status && <p className="form-error" role="alert">{status}</p>}<button className="primary-button auth-submit" disabled={loading}>{loading ? <><LoaderCircle size={15} className="spin" /> Creating account...</> : <>Create account <ArrowUpRight size={16} /></>}</button></form><p className="auth-switch">Already have access? <Link href="/login">Sign in</Link></p></div></section>
  </main>;
}
