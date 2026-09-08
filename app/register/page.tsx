"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, LoaderCircle, Sparkles } from "lucide-react";

const roleOptions = [{ value: "ADMIN", label: "Administrator" }, { value: "FACULTY", label: "Faculty" }, { value: "STUDENT", label: "Student" }] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<(typeof roleOptions)[number]["value"]>("ADMIN");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password"), role }) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) { setStatus(result.error || "Account creation could not be completed."); return; }
    document.cookie = "attendai_session=demo; path=/; max-age=86400; samesite=lax";
    document.cookie = `attendai_role=${role}; path=/; max-age=86400; samesite=lax`;
    document.cookie = `attendai_name=${encodeURIComponent(String(form.get("name")))}` + "; path=/; max-age=86400; samesite=lax";
    router.push("/");
  }

  return <main className="auth-shell"><div className="auth-aside"><Link className="back-link" href="/login"><ArrowLeft size={15} /> Back to sign in</Link><div className="auth-aside-copy"><div className="brand landing-brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>CHRIST UNIVERSITY OS</small></div></div><h1>Build the right<br /><em>academic picture.</em></h1><p>Create a workspace identity for your university team. MongoDB will securely persist the account when connected.</p></div><span className="auth-footer">CHRIST UNIVERSITY / 2025</span></div><section className="auth-panel"><div className="auth-form-wrap"><div className="auth-mobile-brand"><div className="brand-mark"><Sparkles size={18} /></div><strong>attend<span>ai</span></strong></div><div className="eyebrow">CREATE UNIVERSITY USER</div><h2>Join the workspace.</h2><p className="auth-subtitle">Create an account for CHRIST UNIVERSITY.</p><form onSubmit={submit}><label>Full name<input required name="name" minLength={2} placeholder="Your full name" /></label><label>University email<input required name="email" type="email" placeholder="you@christuniversity.edu" /></label><label>Password<input required name="password" minLength={8} type="password" placeholder="At least 8 characters" /></label><div className="role-picker register-role"><span>ACCESS ROLE</span><div>{roleOptions.map((item) => <button type="button" key={item.value} className={role === item.value ? "selected" : ""} onClick={() => setRole(item.value)}>{role === item.value && <Check size={13} />}{item.label}</button>)}</div></div>{status && <p className="form-error" role="alert">{status}</p>}<button className="primary-button auth-submit" disabled={loading}>{loading ? <><LoaderCircle size={15} className="spin" /> Creating user...</> : <>Create user <ArrowUpRight size={16} /></>}</button></form><p className="auth-switch">Already have access? <Link href="/login">Sign in</Link></p></div></section></main>;
}
