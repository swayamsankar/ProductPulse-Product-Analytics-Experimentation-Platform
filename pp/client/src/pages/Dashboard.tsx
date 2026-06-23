
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { useTitle } from "@/lib/use-title";
import { api } from "@/lib/api";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Dashboard() {
  useTitle("Dashboard — ProductPulse");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for authentication token on mount
  useEffect(() => {
    const token = localStorage.getItem("pp_token");
    if (!token) {
      // If not authenticated, redirect to auth page
      navigate("/auth", { replace: true });
      return;
    }

    // If authenticated, fetch analytics
    api("/analytics/kpis")
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Loading dashboard...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-500">
          Failed to load analytics
        </h2>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Product analytics overview"
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="DAU"
          value={fmt(data.dau || 0)}
        />

        <KpiCard
          label="MAU"
          value={fmt(data.mau || 0)}
        />

        <KpiCard
          label="Conversion"
          value={`${data.conversionPct || 0}%`}
        />

        <KpiCard
          label="Events"
          value={fmt(data.totalEvents || 0)}
        />
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-2">
          Activity Summary
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            Daily Active Users:
            <span className="font-medium ml-2">
              {fmt(data.dau || 0)}
            </span>
          </p>

          <p>
            Monthly Active Users:
            <span className="font-medium ml-2">
              {fmt(data.mau || 0)}
            </span>
          </p>

          <p>
            Conversion Rate:
            <span className="font-medium ml-2">
              {data.conversionPct || 0}%
            </span>
          </p>

          <p>
            Total Events:
            <span className="font-medium ml-2">
              {fmt(data.totalEvents || 0)}
            </span>
          </p>
        </div>
      </div>

      {data.totalEvents === 0 && (
        <div className="mt-6 rounded-xl border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">
            No Analytics Data Available
          </h3>

          <p className="text-muted-foreground mt-2">
            Upload a CSV file to start generating analytics.
          </p>
        </div>
      )}
    </>
  );
}
