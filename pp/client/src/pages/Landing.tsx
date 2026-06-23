import { Link } from "react-router-dom";
import {
  Activity, ArrowRight, BarChart3, Filter, FlaskConical,
  LineChart as LineChartIcon, Sparkles, Users, Upload, ShieldCheck, Zap, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, CartesianGrid,
} from "recharts";
import { trend, funnel } from "@/lib/mock-data";
import { useTitle } from "@/lib/use-title";

export default function Landing() {
  useTitle("ProductPulse — Transform Product Data Into Decisions");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <LogoBar />
      <Features />
      <DashboardPreview />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
            <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">ProductPulse</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#preview" className="hover:text-foreground">Product</a>
          <a href="#benefits" className="hover:text-foreground">Why us</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard">
              Open app <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-28 md:pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-[var(--shadow-card)]">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          New — AI-powered insight generation
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl mx-auto">
          Transform product data into{" "}
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            decisions
          </span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          The all-in-one analytics & experimentation platform for product teams. Track funnels, retention, feature adoption, and A/B tests — without the spreadsheet sprawl.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/dashboard">
              Explore the demo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#preview">See product</a>
          </Button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">No credit card required · Free for solo teams</div>

        <div className="mt-14 mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-card shadow-[var(--shadow-elegant)] overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/40">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-muted-foreground">app.productpulse.io / dashboard</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 p-5 text-left">
              <MiniStat label="DAU" value="12,480" delta="+6.4%" />
              <MiniStat label="Conversion" value="4.82%" delta="+0.6%" />
              <MiniStat label="MRR" value="$92,340" delta="+12.3%" />
              <div className="md:col-span-3 h-56 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hero-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} interval={5} />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="dau" stroke="var(--color-primary)" strokeWidth={2} fill="url(#hero-grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-xs text-success">{delta}</div>
      </div>
    </div>
  );
}

function LogoBar() {
  const logos = ["Acme", "Lumen", "Northwind", "Globex", "Initech", "Hooli"];
  return (
    <section className="border-y bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">Trusted by product teams at</span>
        {logos.map((l) => (<span key={l} className="font-semibold text-sm opacity-70">{l}</span>))}
      </div>
    </section>
  );
}

const featureList = [
  { icon: BarChart3, title: "KPI Dashboards", body: "DAU, WAU, MAU, conversion, retention, and revenue at a glance." },
  { icon: Filter, title: "Funnel Analytics", body: "See where users drop off across any multi-step journey." },
  { icon: Users, title: "Cohort Retention", body: "Heatmaps that reveal whether new features actually keep users." },
  { icon: Sparkles, title: "Feature Adoption", body: "Identify the features driving stickiness — and the dead weight." },
  { icon: FlaskConical, title: "A/B Testing", body: "Compare variants with statistical significance built in." },
  { icon: Zap, title: "AI Insights", body: "Auto-generated recommendations from your event data." },
];

function Features() {
  return (
    <section id="features" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Everything a product team needs</h2>
          <p className="mt-3 text-muted-foreground">
            Built for PMs, analysts, and founders who want answers — not another data warehouse migration.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureList.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="font-semibold">{f.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section id="preview" className="py-20 md:py-24 bg-muted/30 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-sm font-medium text-primary">Funnel Analytics</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Find the leaks in your user journey</h2>
          <p className="mt-3 text-muted-foreground">
            Drop a CSV of events or connect your warehouse, then visualize step-by-step conversion in seconds.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {["Step-by-step drop-off rates","Side-by-side funnel comparison","Segment by user property or device","Export to PDF / share with stakeholders"].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Button className="mt-7" asChild>
            <Link to="/funnel">Open funnel demo <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-elegant)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Visitor → Purchase</div>
              <div className="font-semibold">Last 30 days</div>
            </div>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis dataKey="step" type="category" tick={{ fontSize: 12 }} width={120} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="users" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Zap, title: "Ship 2× faster", body: "Stop waiting on data requests — explore funnels and cohorts yourself." },
    { icon: ShieldCheck, title: "Trustworthy metrics", body: "Consistent definitions of DAU, retention, and conversion across the org." },
    { icon: Upload, title: "Bring your own data", body: "Upload CSVs or stream events. No SQL required." },
  ];
  return (
    <section id="benefits" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Why product teams choose ProductPulse</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((i) => (
            <div key={i.title} className="rounded-xl border bg-card p-6 text-center shadow-[var(--shadow-card)]">
              <div className="h-10 w-10 rounded-lg bg-accent/15 grid place-items-center mx-auto mb-4">
                <i.icon className="h-5 w-5 text-success" />
              </div>
              <div className="font-semibold">{i.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 sm:px-6 pb-24">
      <div className="max-w-5xl mx-auto rounded-2xl p-10 md:p-14 text-center text-primary-foreground shadow-[var(--shadow-elegant)]" style={{ background: "var(--gradient-primary)" }}>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Ready to understand your users?</h2>
        <p className="mt-3 opacity-90 max-w-xl mx-auto">Start exploring with realistic demo data — no setup required.</p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/dashboard">Open the dashboard <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
            <Activity className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-medium text-foreground">ProductPulse</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#preview" className="hover:text-foreground">Product</a>
          <Link to="/auth" className="hover:text-foreground">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
