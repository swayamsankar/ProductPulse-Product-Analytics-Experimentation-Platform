import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTitle } from "@/lib/use-title";
import { api } from "@/lib/api";

export default function FeaturesPage() {
  useTitle("Feature Adoption — ProductPulse");

  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/analytics/features")
      .then((data) => {
        setFeatures(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setFeatures([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sorted = [...features].sort(
    (a, b) => (b.adoptionPct || 0) - (a.adoptionPct || 0)
  );

  const top = sorted.slice(0, 3);
  const bottom = [...sorted].reverse().slice(0, 3);

  if (loading) {
    return <div className="p-6">Loading feature analytics...</div>;
  }

  return (
    <>
      <PageHeader
        title="Feature Adoption"
        description="Which features your users actually use."
      />

      {features.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <h3 className="text-lg font-semibold">
            No Feature Data Available
          </h3>
          <p className="text-muted-foreground mt-2">
            Upload event data to see feature adoption metrics.
          </p>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border bg-card p-5">
              <div className="font-semibold mb-1">
                Adoption rate by feature
              </div>

              <div className="text-xs text-muted-foreground mb-4">
                Percentage of users who triggered each event
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={features}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="feature"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis unit="%" />

                    <Tooltip />

                    <Bar
                      dataKey="adoptionPct"
                      fill="var(--color-primary)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-5">
                <div className="font-semibold">
                  Most Used Features
                </div>

                <ul className="mt-3 space-y-2 text-sm">
                  {top.map((f) => (
                    <li
                      key={f.feature}
                      className="flex justify-between"
                    >
                      <span>{f.feature}</span>
                      <span className="font-medium text-green-600">
                        {f.adoptionPct || 0}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-5">
                <div className="font-semibold">
                  Least Used Features
                </div>

                <ul className="mt-3 space-y-2 text-sm">
                  {bottom.map((f) => (
                    <li
                      key={f.feature}
                      className="flex justify-between"
                    >
                      <span>{f.feature}</span>
                      <span className="font-medium text-red-600">
                        {f.adoptionPct || 0}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-5 py-3">
                    Feature
                  </th>

                  <th className="text-right px-5 py-3">
                    Users
                  </th>

                  <th className="text-right px-5 py-3">
                    Events
                  </th>

                  <th className="text-right px-5 py-3">
                    Adoption
                  </th>
                </tr>
              </thead>

              <tbody>
                {features.map((f) => (
                  <tr
                    key={f.feature}
                    className="border-t"
                  >
                    <td className="px-5 py-3 font-medium">
                      {f.feature}
                    </td>

                    <td className="px-5 py-3 text-right">
                      {(f.users || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-3 text-right">
                      {(f.events || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-3 text-right">
                      {f.adoptionPct || 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}