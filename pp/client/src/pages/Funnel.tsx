import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { useTitle } from "@/lib/use-title";
import { api } from "@/lib/api";
import { funnel as mockFunnel } from "@/lib/mock-data"; // fallback for demo if no API

export default function FunnelPage() {
  useTitle("Funnel — ProductPulse");
  const [funnel, setFunnel] = useState<any[]>([]);

  useEffect(() => {
    // Use fetch-like api (api returns Promise<any>), not api.get
    api("/analytics/funnel?steps=signup,activate,purchase")
      .then(res => {
        // If you expect { steps: ... }, return res.steps, otherwise adjust as needed
        if (res && res.data && Array.isArray(res.data.steps)) {
          setFunnel(res.data.steps);
        } else if (res && Array.isArray(res.steps)) {
          setFunnel(res.steps);
        } else if (Array.isArray(res)) {
          setFunnel(res);
        } else {
          setFunnel(mockFunnel);
        }
      })
      .catch(() => {
        setFunnel(mockFunnel);
      });
  }, []);

  const max = funnel.length > 0 ? funnel[0].users : 1;

  return (
    <>
      <PageHeader title="Funnel analytics" description="Visitor → Signup → Feature usage → Purchase. Identify the biggest drop-offs." />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="font-semibold mb-1">Conversion by step</div>
          <div className="text-xs text-muted-foreground mb-4">Total visitors at each stage</div>
          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis dataKey="step" type="category" tick={{ fontSize: 12 }} width={120} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="users" radius={[0, 6, 6, 0]}>
                  {funnel.map((_, i) => (
                    <Cell key={i} fill={`color-mix(in oklab, var(--color-primary) ${100 - i * 12}%, white)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="font-semibold mb-3">Step-by-step</div>
          <ol className="space-y-3">
            {funnel.map((s, i) => {
              const prev = i === 0 ? s.users : funnel[i - 1].users;
              const stepRate = ((s.users / prev) * 100).toFixed(1);
              const overall = ((s.users / max) * 100).toFixed(1);
              return (
                <li key={s.step} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{i + 1}. {s.step}</span>
                    <span className="text-muted-foreground">{s.users.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${overall}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Step conv: <span className="text-foreground font-medium">{stepRate}%</span></span>
                    <span>Overall: <span className="text-foreground font-medium">{overall}%</span></span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="font-semibold">Insights</div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• The largest drop-off (58%) happens between <span className="text-foreground font-medium">Visitor</span> and <span className="text-foreground font-medium">Signup Started</span> — investigate landing page CTAs.</li>
          <li>• Only <span className="text-foreground font-medium">27%</span> of activated users reach a purchase. Consider in-app upsells after first feature use.</li>
          <li>• Mobile users convert <span className="text-foreground font-medium">38% lower</span> than desktop at the Account Created step.</li>
        </ul>
      </div>
    </>
  );
}
