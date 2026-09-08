"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BrainCircuit, LoaderCircle, RefreshCw, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

type Prediction = { studentId: string; predictedAttendance: number; riskLevel: "LOW" | "MEDIUM" | "HIGH"; generatedDate: string };

export default function PredictionsPage() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    const response = await fetch("/api/predictions?limit=100");
    const result = await response.json();
    setPredictions(result.data ?? []);
    setLoading(false);
  }

  useEffect(() => { window.setTimeout(() => { load().catch(() => { setNotice("Connect MongoDB to load prediction signals."); setLoading(false); }); }, 0); }, []);

  async function generate() {
    setGenerating(true);
    const response = await fetch("/api/predictions", { method: "POST" });
    const result = await response.json();
    setGenerating(false);
    setNotice(response.ok ? `${result.data.generated} student signals refreshed.` : result.error);
    if (response.ok) setPredictions(result.data.predictions);
  }

  const high = predictions.filter((item) => item.riskLevel === "HIGH").length;
  const medium = predictions.filter((item) => item.riskLevel === "MEDIUM").length;
  return <main className="insight-shell"><header className="insight-header"><button className="back-link attendance-back" onClick={() => router.push("/")}><ArrowLeft size={15} /> Back to overview</button><div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>attend<span>ai</span></strong><small>AI PREDICTION STUDIO</small></div></div><button className="primary-button" onClick={generate} disabled={generating}>{generating ? <LoaderCircle className="spin" size={15} /> : <RefreshCw size={15} />} {generating ? "Generating..." : "Generate predictions"}</button></header><section className="insight-content"><div className="eyebrow"><span className="live-dot" /> EXPLAINABLE RISK SIGNALS</div><h1>See what needs attention<br /><em>before it becomes absence.</em></h1><p className="insight-lede">The baseline model turns attendance history into transparent, timestamped intervention signals.</p><div className="prediction-metrics"><div><strong>{predictions.length}</strong><span>signals generated</span></div><div className="metric-high"><strong>{high}</strong><span>high risk</span></div><div className="metric-medium"><strong>{medium}</strong><span>medium risk</span></div></div>{loading ? <div className="prediction-empty"><LoaderCircle className="spin" size={22} /> Loading prediction signals...</div> : predictions.length === 0 ? <div className="prediction-empty"><BrainCircuit size={22} /> No signals yet. Generate predictions after attendance is recorded.</div> : <div className="prediction-grid">{predictions.map((prediction) => <article className="prediction-card" key={prediction.studentId}><div className="prediction-card-top"><span className={`risk risk-${prediction.riskLevel.toLowerCase()}`}>{prediction.riskLevel} RISK</span><span>{prediction.studentId}</span></div><strong>{prediction.predictedAttendance}%</strong><p>Predicted attendance</p><div className="prediction-bar"><i style={{ width: `${prediction.predictedAttendance}%` }} /></div><div className="prediction-foot">{prediction.riskLevel === "HIGH" ? <TrendingDown size={14} /> : <TrendingUp size={14} />}<span>{prediction.riskLevel === "HIGH" ? "Immediate intervention recommended" : "Monitor attendance trajectory"}</span></div></article>)}</div>}{notice && <div className="toast" role="status">{notice}</div>}</section></main>;
}
