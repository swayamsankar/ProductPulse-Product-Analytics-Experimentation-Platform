import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { api } from "@/lib/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Trophy,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTitle } from "@/lib/use-title";

export default function ExperimentsPage() {
  useTitle("A/B Testing — ProductPulse");

  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/experiments")
      .then((data) => {
        setExperiments(data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading experiments...</div>;
  }

  return (
    <>
      <PageHeader
        title="A/B Testing"
        description="Compare experiment variants and surface statistically significant winners."
      />

      {experiments.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <h3 className="text-lg font-semibold">
            No Experiments Found
          </h3>

          <p className="text-muted-foreground mt-2">
            Create an experiment to see results here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {experiments.map((e) => {
            const significance =
              e.stats?.pValue != null
                ? ((1 - e.stats.pValue) * 100).toFixed(1)
                : "0";

            const winner =
              e.variants?.length >= 2
                ? e.variants[0].conversions >
                  e.variants[1].conversions
                  ? e.variants[0].name
                  : e.variants[1].name
                : "-";

            const chartData =
              e.variants?.map((v: any) => ({
                ...v,
                rate:
                  v.visitors > 0
                    ? Number(
                        (
                          (v.conversions / v.visitors) *
                          100
                        ).toFixed(2)
                      )
                    : 0,
              })) || [];

            return (
              <div
                key={e._id}
                className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">
                      {e.name}
                    </div>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md",
                        e.status === "running"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {e.status === "running" ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" />
                      )}

                      {e.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Significance:
                      </span>{" "}
                      <span className="font-medium text-success">
                        {significance}%
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-success font-medium">
                      <Trophy className="h-4 w-4" />
                      {winner}
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 h-56">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={chartData}
                        margin={{ left: -10 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis dataKey="name" />

                        <YAxis unit="%" />

                        <Tooltip />

                        <Bar
                          dataKey="rate"
                          fill="var(--color-primary)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left px-3 py-2">
                            Variant
                          </th>

                          <th className="text-right px-3 py-2">
                            Visitors
                          </th>

                          <th className="text-right px-3 py-2">
                            Conv.
                          </th>

                          <th className="text-right px-3 py-2">
                            Rate
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {chartData.map((v: any) => (
                          <tr
                            key={v.name}
                            className="border-t"
                          >
                            <td className="px-3 py-2">
                              {v.name}
                            </td>

                            <td className="px-3 py-2 text-right">
                              {v.visitors.toLocaleString()}
                            </td>

                            <td className="px-3 py-2 text-right">
                              {v.conversions.toLocaleString()}
                            </td>

                            <td className="px-3 py-2 text-right">
                              {v.rate}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}