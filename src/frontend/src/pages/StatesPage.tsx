import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, X } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAccidentsByState, useAllStates } from "../hooks/useAccidentData";
import { ALL_STATES, MAX_YEAR, MIN_YEAR } from "../types";

const CHART_COLORS = [
  "oklch(var(--chart-2))",
  "oklch(var(--chart-1))",
  "oklch(var(--chart-3))",
  "oklch(var(--chart-4))",
  "oklch(var(--chart-5))",
];

const DEFAULT_STATES = [
  "Telangana",
  "Kerala",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
];

function ChartSkeleton({ height = 320 }: { height?: number }) {
  return <Skeleton className="w-full rounded-lg" style={{ height }} />;
}

export default function StatesPage() {
  const { data: allStates } = useAllStates();
  const [selected, setSelected] = useState<string[]>(DEFAULT_STATES);

  const availableStates = allStates ?? ALL_STATES;
  const { data: stateData, isLoading } = useAccidentsByState(selected);

  const toggleState = (state: string) => {
    setSelected((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state],
    );
  };

  const comparisonData = (stateData ?? []).map((s) => ({
    state: s.state.length > 10 ? `${s.state.substring(0, 10)}…` : s.state,
    fullName: s.state,
    Accidents: Number(s.totalAccidents),
    Deaths: Number(s.deaths),
    Injuries: Number(s.injuries),
  }));

  const radarData = (stateData ?? []).slice(0, 6).map((s) => ({
    state: s.state.length > 8 ? `${s.state.substring(0, 8)}…` : s.state,
    accidents: Number(s.totalAccidents) / 1000,
    deaths: Number(s.deaths) / 100,
    injuries: Number(s.injuries) / 1000,
  }));

  return (
    <div className="space-y-6" data-ocid="states.page">
      <div>
        <h1 className="text-display-sm text-foreground">State Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare accident data across Indian states · {MIN_YEAR}–{MAX_YEAR}
        </p>
      </div>

      {/* State Selector */}
      <div
        className="bg-card border border-border rounded-xl p-4"
        data-ocid="states.selector.panel"
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold font-display">
            Select States to Compare
          </span>
          <span className="text-xs text-muted-foreground">
            ({selected.length} selected)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableStates.map((state, i) => {
            const isActive = selected.includes(state);
            return (
              <Button
                key={state}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => toggleState(state)}
                data-ocid={`states.selector.item.${i + 1}`}
                className="h-7 text-xs rounded-full"
              >
                {isActive && <X className="w-3 h-3 mr-1" />}
                {state}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Active selection badges */}
      {selected.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          data-ocid="states.selected_badges"
        >
          {selected.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1">
              <MapPin className="w-3 h-3" />
              {s}
            </Badge>
          ))}
        </div>
      )}

      {/* Comparative Bar Chart */}
      <div
        className="bg-card border border-border rounded-xl p-4 md:p-5"
        data-ocid="states.comparison_chart.section"
      >
        <h2 className="text-base font-semibold font-display text-foreground mb-1">
          State-wise Accident Comparison
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Cumulative totals for selected states over selected period
        </p>
        {isLoading || comparisonData.length === 0 ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={comparisonData}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 100000
                    ? `${(v / 100000).toFixed(0)}L`
                    : `${(v / 1000).toFixed(0)}K`
                }
              />
              <YAxis
                type="category"
                dataKey="state"
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "oklch(var(--foreground))",
                }}
                formatter={(val: number) => val.toLocaleString("en-IN")}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Bar
                dataKey="Accidents"
                fill={CHART_COLORS[0]}
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="Deaths"
                fill={CHART_COLORS[3]}
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="Injuries"
                fill={CHART_COLORS[2]}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Radar Chart */}
      <div
        className="bg-card border border-border rounded-xl p-4 md:p-5"
        data-ocid="states.radar_chart.section"
      >
        <h2 className="text-base font-semibold font-display text-foreground mb-1">
          Multi-Metric State Radar
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Normalized comparison across accidents, deaths, and injuries (top 6
          states)
        </p>
        {isLoading || radarData.length === 0 ? (
          <ChartSkeleton height={300} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
              <PolarGrid stroke="oklch(var(--border))" />
              <PolarAngleAxis
                dataKey="state"
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
              />
              <PolarRadiusAxis
                tick={{ fontSize: 9, fill: "oklch(var(--muted-foreground))" }}
              />
              <Radar
                name="Accidents (×1K)"
                dataKey="accidents"
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.2}
              />
              <Radar
                name="Deaths (×100)"
                dataKey="deaths"
                stroke={CHART_COLORS[3]}
                fill={CHART_COLORS[3]}
                fillOpacity={0.2}
              />
              <Radar
                name="Injuries (×1K)"
                dataKey="injuries"
                stroke={CHART_COLORS[2]}
                fill={CHART_COLORS[2]}
                fillOpacity={0.2}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "oklch(var(--foreground))",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* State data table */}
      {!isLoading && comparisonData.length > 0 && (
        <div
          className="bg-card border border-border rounded-xl overflow-hidden"
          data-ocid="states.data_table"
        >
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold font-display">
              State Summary Table
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    State
                  </th>
                  <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Accidents
                  </th>
                  <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Deaths
                  </th>
                  <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Injuries
                  </th>
                  <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Fatality %
                  </th>
                </tr>
              </thead>
              <tbody>
                {(stateData ?? []).map((s, i) => {
                  const fatalityPct =
                    Number(s.totalAccidents) > 0
                      ? (
                          (Number(s.deaths) / Number(s.totalAccidents)) *
                          100
                        ).toFixed(1)
                      : "0.0";
                  return (
                    <tr
                      key={s.state}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      data-ocid={`states.table.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {s.state}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {Number(s.totalAccidents).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-destructive">
                        {Number(s.deaths).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {Number(s.injuries).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          variant={
                            Number(fatalityPct) > 30
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {fatalityPct}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
