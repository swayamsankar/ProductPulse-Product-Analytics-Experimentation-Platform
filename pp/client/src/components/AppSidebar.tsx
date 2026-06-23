import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Filter, Users, Sparkles, FlaskConical, Upload, Lightbulb,
  Activity, Menu, X, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuth } from "@/lib/api";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/funnel", label: "Funnel", icon: Filter },
  { to: "/retention", label: "Retention", icon: Users },
  { to: "/features", label: "Feature Adoption", icon: Sparkles },
  { to: "/experiments", label: "A/B Testing", icon: FlaskConical },
  { to: "/upload", label: "Data Upload", icon: Upload },
  { to: "/insights", label: "Insights", icon: Lightbulb },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/auth";
  };

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("pp_user") || "{}");
    } catch {
      return {};
    }
  })();

  const Inner = (
    <>
      <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
          <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="font-semibold tracking-tight">ProductPulse</span>
      </Link>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2 mb-2">
          <div className="h-7 w-7 rounded-full bg-sidebar-accent grid place-items-center text-xs font-medium">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <div className="text-sidebar-foreground font-medium text-sm truncate">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email || ""}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
            <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold">ProductPulse</span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 rounded-md hover:bg-sidebar-accent/60">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col bg-sidebar text-sidebar-foreground">
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 p-2 rounded-md hover:bg-sidebar-accent/60">
              <X className="h-5 w-5" />
            </button>
            {Inner}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground sticky top-0">
        {Inner}
      </aside>
    </>
  );
}
