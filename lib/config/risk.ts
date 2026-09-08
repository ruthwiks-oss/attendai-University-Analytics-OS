export const riskConfig = {
  attendanceThreshold: 75,
  mediumMinimum: 60,
  highRiskAlertThreshold: 60,
} as const;

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export function getRiskLevel(attendance: number): RiskLevel {
  if (attendance >= riskConfig.attendanceThreshold) return "LOW";
  if (attendance >= riskConfig.mediumMinimum) return "MEDIUM";
  return "HIGH";
}
