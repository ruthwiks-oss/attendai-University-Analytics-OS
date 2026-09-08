import { getRiskLevel, type RiskLevel } from "@/lib/config/risk";

export type PredictionInput = { currentAttendance: number; recentTrend: number; attendedClasses: number; missedClasses: number };
export type PredictionOutput = { predictedAttendance: number; riskLevel: RiskLevel; method: "baseline-predictive-analytics" };

/** Transparent baseline; replace this service with a trained model adapter when available. */
export function predictAttendance(input: PredictionInput): PredictionOutput {
  const trendWeight = Math.max(-8, Math.min(8, input.recentTrend * 0.35));
  const volume = input.attendedClasses + input.missedClasses;
  const stability = volume > 0 ? Math.min(3, volume / 30) : 0;
  const predictedAttendance = Math.round(Math.max(0, Math.min(100, input.currentAttendance + trendWeight + stability)) * 10) / 10;
  return { predictedAttendance, riskLevel: getRiskLevel(predictedAttendance), method: "baseline-predictive-analytics" };
}
