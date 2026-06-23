import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useTitle } from "@/lib/use-title";
import { api } from "@/lib/api";
import { cohorts as mockCohorts } from "@/lib/mock-data"; // fallback for demo

function colorFor(value: number | undefined) {
  if (value === undefined) return "transparent";
  const pct = Math.max(0, Math.min(100, value));
  return `color-mix(in oklab, var(--color-primary) ${pct}%, white)`;
}

export default function RetentionPage() {
  useTitle("Retention — ProductPulse");
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [maxWeeks, setMaxWeeks] = useState<number>(0);

  useEffect(() => {
    // Use the API endpoint to get real retention/cohort data
    api("/analytics/retention")
      .then(res => {
        // Accept shape: { cohorts: [...] } or just an array
        if (res && Array.isArray(res.cohorts)) {
          setCohorts(res.cohorts);
          setMaxWeeks(Math.max(...res.cohorts.map((c: any) => c.weeks.length)));
        } else if (Array.isArray(res)) {
          setCohorts(res);
          setMaxWeeks(Math.max(...res.map((c: any) => c.weeks.length)));
        } else {
          setCohorts(mockCohorts);
          setMaxWeeks(Math.max(...mockCohorts.map(c => c.weeks.length)));
        }
      })
      .catch(() => {
        setCohorts(mockCohorts);
        setMaxWeeks(Math.max(...mockCohorts.map(c => c.weeks.length)));
      });
  }, []);

  return (
    <>
      <PageHeader title="Retention" description="Weekly cohort retention. Each row is the % of users still active N weeks after signup." />

      <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs uppercase tracking-wide">
              <th className="text-left font-medium py-2 pr-4 sticky left-0 bg-card">Cohort</th>
              <th className="text-left font-medium py-2 pr-4">Users</th>
              {Array.from({ length: maxWeeks }).map((_, i) => (
                <th key={i} className="font-medium py-2 px-2 text-center">W{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.cohort} className="border-t">
                <td className="py-2 pr-4 font-medium whitespace-nowrap sticky left-0 bg-card">{c.cohort}</td>
                <td className="py-2 pr-4 text-muted-foreground">{c.size.toLocaleString()}</td>
                {Array.from({ length: maxWeeks }).map((_, i) => {
                  const v = c.weeks[i];
                  return (
                    <td key={i} className="p-1">
                      <div
                        className="h-9 min-w-12 rounded-md grid place-items-center text-xs font-medium"
                        style={{
                          background: colorFor(v),
                          color: v && v > 55 ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                        }}
                      >
                        {v !== undefined ? `${v}%` : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs text-muted-foreground">W1 Retention</div>
          <div className="text-2xl font-semibold mt-1">68.9%</div>
          <div className="text-xs text-success mt-1">+4.2 pts vs Q1</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs text-muted-foreground">W4 Retention</div>
          <div className="text-2xl font-semibold mt-1">42.6%</div>
          <div className="text-xs text-success mt-1">+8.1 pts vs Q1</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs text-muted-foreground">W8 Retention</div>
          <div className="text-2xl font-semibold mt-1">29.8%</div>
          <div className="text-xs text-muted-foreground mt-1">Stable QoQ</div>
        </div>
      </div>
    </>
  );
}
