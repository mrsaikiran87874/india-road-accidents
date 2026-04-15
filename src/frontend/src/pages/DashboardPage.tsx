import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DEFAULT_FILTER, FilterPanel } from "../components/FilterPanel";
import { SummaryCards } from "../components/SummaryCards";
import {
  useAccidentsByYear,
  useAllStates,
  useSummaryStats,
} from "../hooks/useAccidentData";
import { ALL_STATES, MAX_YEAR, MIN_YEAR, VehicleType } from "../types";
import type { FilterState } from "../types";

const CHART_COLORS = [
  "oklch(var(--chart-2))",
  "oklch(var(--chart-1))",
  "oklch(var(--chart-3))",
  "oklch(var(--chart-4))",
  "oklch(var(--chart-5))",
];

const PIE_DATA = [
  { name: "Two Wheeler", value: 42, color: CHART_COLORS[0] },
  { name: "Car / 4-Wheeler", value: 28, color: CHART_COLORS[1] },
  { name: "Heavy Vehicle", value: 18, color: CHART_COLORS[2] },
  { name: "Other", value: 12, color: CHART_COLORS[3] },
];

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return <Skeleton className="w-full rounded-lg" style={{ height }} />;
}

function SectionCard({
  title,
  subtitle,
  children,
  ocid,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  ocid?: string;
}) {
  return (
    <div
      className="bg-card border border-border rounded-xl p-4 md:p-5"
      data-ocid={ocid}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold font-display text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const { data: allStates } = useAllStates();

  const dataFilter = {
    startYear: BigInt(filter.startYear),
    endYear: BigInt(filter.endYear),
    states:
      filter.selectedStates.length > 0 ? filter.selectedStates : undefined,
    vehicleTypes:
      filter.selectedVehicleTypes.length > 0
        ? filter.selectedVehicleTypes
        : undefined,
  };

  const { data: summaryStats, isLoading: summaryLoading } =
    useSummaryStats(dataFilter);
  const { data: yearlyData, isLoading: yearlyLoading } = useAccidentsByYear(
    filter.startYear,
    filter.endYear,
  );

  const chartData = (yearlyData ?? []).map((y) => ({
    year: Number(y.year),
    Accidents: Number(y.totalAccidents),
    Deaths: Number(y.deaths),
    Injuries: Number(y.injuries),
  }));

  const availableStates = allStates ?? ALL_STATES;

  return (
    <div className="space-y-6" data-ocid="dashboard.page">
      <div>
        <h1 className="text-display-sm text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          India road accident overview · {MIN_YEAR}–{MAX_YEAR}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel
            availableStates={availableStates}
            value={filter}
            onChange={setFilter}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Summary Stats */}
          <SummaryCards stats={summaryStats} isLoading={summaryLoading} />

          {/* Yearly Trend Bar Chart */}
          <SectionCard
            title="Annual Accident Trends"
            subtitle="Total accidents, deaths and injuries per year across India"
            ocid="dashboard.yearly_trends.section"
          >
            {yearlyLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border))"
                  />
                  <XAxis
                    dataKey="year"
                    tick={{
                      fontSize: 11,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                      v >= 100000
                        ? `${(v / 100000).toFixed(0)}L`
                        : `${(v / 1000).toFixed(0)}K`
                    }
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
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                  />
                  <Bar
                    dataKey="Accidents"
                    fill={CHART_COLORS[0]}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Deaths"
                    fill={CHART_COLORS[3]}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Injuries"
                    fill={CHART_COLORS[2]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          {/* Two charts side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Line chart: fatality trend */}
            <SectionCard
              title="Fatality Rate Trend"
              subtitle="Deaths per 100 accidents over time"
              ocid="dashboard.fatality_trend.section"
            >
              {yearlyLoading ? (
                <ChartSkeleton height={220} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(var(--border))"
                    />
                    <XAxis
                      dataKey="year"
                      tick={{
                        fontSize: 11,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(var(--card))",
                        border: "1px solid oklch(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "oklch(var(--foreground))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Deaths"
                      stroke={CHART_COLORS[3]}
                      strokeWidth={2}
                      dot={{ r: 3, fill: CHART_COLORS[3] }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Injuries"
                      stroke={CHART_COLORS[2]}
                      strokeWidth={2}
                      dot={{ r: 3, fill: CHART_COLORS[2] }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </SectionCard>

            {/* Pie chart: vehicle share */}
            <SectionCard
              title="Accidents by Vehicle Type"
              subtitle="Distribution across vehicle categories (2016–2025)"
              ocid="dashboard.vehicle_share.section"
            >
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    label={({
                      name,
                      percent,
                    }: { name: string; percent: number }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {PIE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(var(--card))",
                      border: "1px solid oklch(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "oklch(var(--foreground))",
                    }}
                    formatter={(val: number) => [`${val}%`, "Share"]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px" }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
