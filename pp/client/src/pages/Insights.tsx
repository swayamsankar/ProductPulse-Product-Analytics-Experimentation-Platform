import { PageHeader } from "@/components/PageHeader";
import { insights } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle2, Info, Lightbulb, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTitle } from "@/lib/use-title";

const styles = {
  high: { icon: AlertTriangle, cls: "text-destructive bg-destructive/10" },
  warn: { icon: AlertTriangle, cls: "text-warning bg-warning/15" },
  success: { icon: CheckCircle2, cls: "text-success bg-success/10" },
  info: { icon: Info, cls: "text-primary bg-primary/10" },
} as const;

export default function InsightsPage() {
  useTitle("Insights — ProductPulse");
  return (
    <>
      <PageHeader
        title="Insights & reports"
        description="AI-generated observations from your event data, plus downloadable reports."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success("Generating PDF report…")}>
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {insights.map((i) => {
          const s = styles[i.severity];
          const Icon = s.icon;
          return (
            <div key={i.title} className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${s.cls}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">{i.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{i.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 font-semibold">
          <Lightbulb className="h-4 w-4 text-warning" /> Recommendations
        </div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
          <li>Roll out <span className="text-foreground font-medium">Onboarding Checklist v2 — Variant A</span> to 100% of new signups.</li>
          <li>Investigate the mobile OTP step in the Account Created funnel.</li>
          <li>Add an in-app tour for the API Access feature to lift adoption above 9%.</li>
          <li>Set up an alert on W1 retention dropping below 65%.</li>
        </ul>
      </div>
    </>
  );
}
