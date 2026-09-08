"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: form.get("identifier"), password: form.get("password") }) });
    const result = await response.json();
    if (!response.ok) { setLoading(false); setStatus(result.error); return; }
    document.cookie = `attendai_session=demo; path=/; max-age=86400; samesite=lax`;
    document.cookie = `attendai_role=${result.data.role}; path=/; max-age=86400; samesite=lax`;
    document.cookie = `attendai_name=${encodeURIComponent(result.data.name)}; path=/; max-age=86400; samesite=lax`;
    router.push("/");
  }

  return <main className="auth-shell">
    <div className="auth-aside"><Link className="back-link" href="/"><ArrowLeft size={15} /> Back to attendai</Link><div className="auth-aside-copy"><div className="brand landing-brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>UNIVERSITY OS</small></div></div><h1>The calm inside<br /><em>the complexity.</em></h1><p>One intelligent workspace for every attendance signal, academic pattern, and timely intervention.</p><div className="auth-quote"><span>“</span><p>We stopped chasing spreadsheets and started seeing students.</p><small>Jordan Davis · Administrator</small></div></div><span className="auth-footer">NORTHBRIDGE UNIVERSITY / 2025</span></div>
    <section className="auth-panel"><div className="auth-form-wrap"><div className="auth-mobile-brand"><div className="brand-mark"><Sparkles size={18} /></div><strong>attend<span>ai</span></strong></div><div className="eyebrow">SECURE WORKSPACE ACCESS</div><h2>Welcome back.</h2><p className="auth-subtitle">Sign in to your university command center.</p><form onSubmit={submit}><label>Username or email<input required name="identifier" type="text" defaultValue="123456" placeholder="Username or email" /></label><label>Password<div className="password-field"><input required name="password" minLength={6} type={showPassword ? "text" : "password"} defaultValue="dsmaer" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label><div className="form-meta"><label className="remember"><input type="checkbox" defaultChecked /> <span>Remember me</span></label><a href="mailto:support@attendai.demo">Forgot password?</a></div>{status && <p className="form-error" role="alert">{status}</p>}<button className="primary-button auth-submit" disabled={loading}>{loading ? "Opening workspace..." : "Sign in to workspace"} {!loading && <ArrowUpRight size={16} />}</button></form><p className="auth-switch">Need access? <Link href="/register">Create an account</Link></p></div></section>
  </main>;
}
