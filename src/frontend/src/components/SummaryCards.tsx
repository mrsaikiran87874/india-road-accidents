import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Heart,
  Skull,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { SummaryStats } from "../types";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: "up" | "down" | "neutral";
  "data-ocid"?: string;
}

function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  "data-ocid": ocid,
}: StatCardProps) {
  return (
    <div
      className="bg-card border border-border rounded-xl p-4 md:p-5 flex items-start gap-4"
      data-ocid={ocid}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl md:text-3xl font-bold font-display text-foreground tracking-tight">
          {value}
        </p>
        {subValue && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" && (
              <TrendingUp className="w-3 h-3 text-destructive" />
            )}
            {trend === "down" && (
              <TrendingDown className="w-3 h-3 text-accent" />
            )}
            <span
              className={`text-xs font-medium ${
                trend === "up"
                  ? "text-destructive"
                  : trend === "down"
                    ? "text-accent"
                    : "text-muted-foreground"
              }`}
            >
              {subValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 flex items-start gap-4">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function formatNumber(n: bigint): string {
  const num = Number(n);
  if (num >= 10_00_000) return `${(num / 10_00_000).toFixed(2)}M`;
  if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(1)}L`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString("en-IN");
}

interface SummaryCardsProps {
  stats: SummaryStats | null | undefined;
  isLoading: boolean;
}

export function SummaryCards({ stats, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        data-ocid="summary.loading_state"
      >
        {(["a", "b", "c", "d"] as const).map((k) => (
          <StatCardSkeleton key={k} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        data-ocid="summary.error_state"
      >
        <div className="col-span-full text-center text-muted-foreground text-sm py-8 bg-card border border-border rounded-xl">
          Unable to load summary statistics.
        </div>
      </div>
    );
  }

  const fatalityPct = `${(Number(stats.fatalityRate) / 10).toFixed(1)}% fatality rate`;
  const injuryPct = `${(Number(stats.injuryRate) / 10).toFixed(1)}% injury rate`;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      data-ocid="summary.cards"
    >
      <StatCard
        label="Total Accidents"
        value={formatNumber(stats.totalAccidents)}
        subValue="Across all states & vehicles"
        icon={AlertTriangle}
        iconColor="text-chart-2"
        iconBg="bg-chart-2/10"
        data-ocid="summary.total_accidents.card"
      />
      <StatCard
        label="Total Deaths"
        value={formatNumber(stats.deaths)}
        subValue={fatalityPct}
        icon={Skull}
        iconColor="text-destructive"
        iconBg="bg-destructive/10"
        trend="up"
        data-ocid="summary.total_deaths.card"
      />
      <StatCard
        label="Total Injuries"
        value={formatNumber(stats.injuries)}
        subValue={injuryPct}
        icon={Heart}
        iconColor="text-chart-3"
        iconBg="bg-chart-3/10"
        trend="neutral"
        data-ocid="summary.total_injuries.card"
      />
      <StatCard
        label="Survival Rate"
        value={`${(100 - Number(stats.fatalityRate) / 10).toFixed(1)}%`}
        subValue="Survived road accidents"
        icon={TrendingDown}
        iconColor="text-accent"
        iconBg="bg-accent/10"
        trend="down"
        data-ocid="summary.survival_rate.card"
      />
    </div>
  );
}
