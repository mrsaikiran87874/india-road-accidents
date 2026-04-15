import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike, Car, CircleDot, Truck } from "lucide-react";
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
import { useAccidentsByVehicleType } from "../hooks/useAccidentData";
import { VEHICLE_TYPE_LABELS, VehicleType } from "../types";
import { MAX_YEAR, MIN_YEAR } from "../types";

const ALL_VEHICLE_TYPES = [
  VehicleType.TwoWheeler,
  VehicleType.Car,
  VehicleType.HeavyVehicle,
  VehicleType.Other,
];

const CHART_COLORS = [
  "oklch(var(--chart-2))",
  "oklch(var(--chart-1))",
  "oklch(var(--chart-3))",
  "oklch(var(--chart-4))",
  "oklch(var(--chart-5))",
];

const VEHICLE_ICONS: Record<string, React.ElementType> = {
  TwoWheeler: Bike,
  Car: Car,
  HeavyVehicle: Truck,
  Other: CircleDot,
};

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return <Skeleton className="w-full rounded-lg" style={{ height }} />;
}

export default function VehiclesPage() {
  const { data: vehicleData, isLoading } =
    useAccidentsByVehicleType(ALL_VEHICLE_TYPES);

  const summaryData = (vehicleData ?? []).map((v, i) => ({
    name: VEHICLE_TYPE_LABELS[v.vehicleType] ?? v.vehicleType,
    Accidents: Number(v.totalAccidents),
    Deaths: Number(v.deaths),
    Injuries: Number(v.injuries),
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const pieData = summaryData.map((d) => ({
    name: d.name,
    value: d.Accidents,
    color: d.color,
  }));

  // Build yearly trend per vehicle type
  const yearSet = new Set<number>();
  for (const v of vehicleData ?? []) {
    for (const y of v.yearlyBreakdown) {
      yearSet.add(Number(y.year));
    }
  }
  const years = Array.from(yearSet).sort();

  const trendData = years.map((year) => {
    const entry: Record<string, number> = { year };
    for (const v of vehicleData ?? []) {
      const ys = v.yearlyBreakdown.find((y) => Number(y.year) === year);
      entry[VEHICLE_TYPE_LABELS[v.vehicleType] ?? v.vehicleType] = ys
        ? Number(ys.totalAccidents)
        : 0;
    }
    return entry;
  });

  return (
    <div className="space-y-6" data-ocid="vehicles.page">
      <div>
        <h1 className="text-display-sm text-foreground">Vehicle Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Accident breakdown by vehicle type across India · {MIN_YEAR}–
          {MAX_YEAR}
        </p>
      </div>

      {/* Vehicle Summary Cards */}
      {isLoading ? (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="vehicles.cards.loading_state"
        >
          {(["a", "b", "c", "d"] as const).map((k) => (
            <Skeleton key={k} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="vehicles.summary_cards"
        >
          {(vehicleData ?? []).map((v, i) => {
            const Icon = VEHICLE_ICONS[v.vehicleType] ?? CircleDot;
            const pct =
              Number(v.totalAccidents) > 0
                ? ((Number(v.deaths) / Number(v.totalAccidents)) * 100).toFixed(
                    1,
                  )
                : "0.0";
            return (
              <div
                key={v.vehicleType}
                className="bg-card border border-border rounded-xl p-4"
                data-ocid={`vehicles.card.item.${i + 1}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${CHART_COLORS[i]}33` }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: CHART_COLORS[i] }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {VEHICLE_TYPE_LABELS[v.vehicleType]}
                  </span>
                </div>
                <p className="text-xl font-bold font-display text-foreground">
                  {Number(v.totalAccidents).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground">accidents</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {pct}% fatality
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* Two charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar: comparison */}
        <div
          className="bg-card border border-border rounded-xl p-4 md:p-5"
          data-ocid="vehicles.comparison_chart.section"
        >
          <h2 className="text-base font-semibold font-display text-foreground mb-1">
            Accident Comparison by Vehicle
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Total metrics per vehicle category
          </p>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={summaryData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 10,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
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
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
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
        </div>

        {/* Donut: share */}
        <div
          className="bg-card border border-border rounded-xl p-4 md:p-5"
          data-ocid="vehicles.share_chart.section"
        >
          <h2 className="text-base font-semibold font-display text-foreground mb-1">
            Vehicle Share of Total Accidents
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Proportional contribution to road accidents
          </p>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
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
                  formatter={(val: number) => [
                    val.toLocaleString("en-IN"),
                    "Accidents",
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Yearly Trend Line Chart */}
      {trendData.length > 0 && (
        <div
          className="bg-card border border-border rounded-xl p-4 md:p-5"
          data-ocid="vehicles.trend_chart.section"
        >
          <h2 className="text-base font-semibold font-display text-foreground mb-1">
            Yearly Accident Trend by Vehicle Type
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            How each vehicle category's accident count evolved over time
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={trendData}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
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
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              {Object.keys(VEHICLE_TYPE_LABELS).map((vt, i) => (
                <Line
                  key={vt}
                  type="monotone"
                  dataKey={VEHICLE_TYPE_LABELS[vt]}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
