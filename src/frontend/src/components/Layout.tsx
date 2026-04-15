import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  AlertTriangle,
  Car,
  LayoutDashboard,
  MapPin,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/states", label: "State Analysis", icon: MapPin },
  { to: "/vehicles", label: "Vehicle Analysis", icon: Car },
  { to: "/guidelines", label: "Prevention Guidelines", icon: ShieldCheck },
];

function NavItem({
  to,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-sidebar border-r border-sidebar-border sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-sidebar-foreground font-display leading-tight">
              Road Accident
            </p>
            <p className="text-xs text-muted-foreground leading-tight">
              Data Analysis · India
            </p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} active={pathname === item.to} />
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Data covers 2016–2025. Source: Ministry of Road Transport &amp;
            Highways, India.
          </p>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar border-r border-sidebar-border transform transition-smooth md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-sm font-bold text-sidebar-foreground font-display">
              Road Accident Data
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            data-ocid="nav.close_sidebar.button"
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              active={pathname === item.to}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-card border-b border-border sticky top-0 z-30 px-4 md:px-6 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileOpen(true)}
            data-ocid="nav.open_sidebar.button"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-bold font-display text-foreground truncate">
              Road Accident Data Analysis — India
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              10-Year Historical Trends (2016–2025)
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live Data
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 bg-background">{children}</main>

        {/* Footer */}
        <footer className="bg-muted/40 border-t border-border px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              © {new Date().getFullYear()} Road Accident Data Analysis — India.
              Data: MoRTH.
            </span>
            <span>
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
