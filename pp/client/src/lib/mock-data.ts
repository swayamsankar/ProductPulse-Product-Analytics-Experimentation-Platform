// Mock analytics data — deterministic so charts look stable
export const kpis = {
  dau: { value: 0, delta: 0 },
  wau: { value: 0, delta: 0 },
  mau: { value: 0, delta: 0 },
  conversion: { value: 0, delta: 0 },
  retention: { value: 0, delta: 0 },
  revenue: { value: 0, delta: 0 },
};

export const trend = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date(2025, 10, 1);
  d.setDate(d.getDate() + i);
  const base = 9000 + Math.sin(i / 3) * 1200 + i * 90;
  const jitter = Math.sin(i * 1.7) * 320;
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    dau: Math.round(base + jitter),
    sessions: Math.round(base * 1.8 + Math.cos(i * 1.3) * 600),
    revenue: Math.round(2200 + Math.sin(i / 4) * 500 + i * 35),
  };
});

export const funnel = [];

export const cohorts = [];

export const features = [];

export const experiments = [];

export const uploads = [
  { id: 1, file: "events_october_2025.csv", date: "2025-11-02", rows: 184320, status: "Processed" },
  { id: 2, file: "user_signups_q3.csv", date: "2025-10-14", rows: 42180, status: "Processed" },
  { id: 3, file: "experiment_pricing.csv", date: "2025-10-08", rows: 24820, status: "Processed" },
  { id: 4, file: "feature_clicks_sept.csv", date: "2025-09-30", rows: 98410, status: "Processed" },
];

export const insights = [
  {
    title: "Activation drop on mobile signup",
    body: "Mobile users drop off 38% more than desktop between Signup Started and Account Created. Investigate the OTP step.",
    severity: "high" as const,
  },
  {
    title: "Variant A is the projected winner",
    body: "Onboarding Checklist v2 — Variant A shows a +19.4% lift in trial activation with 97.8% statistical significance.",
    severity: "info" as const,
  },
  {
    title: "Cohort retention improving",
    body: "Cohorts since May 2025 retain 8 points higher at week 4 vs Q1 cohorts — likely driven by the new onboarding flow.",
    severity: "success" as const,
  },
  {
    title: "API Access feature is underused",
    body: "Only 9% of accounts have invoked the API. Consider in-app prompts for technical personas.",
    severity: "warn" as const,
  },
];
