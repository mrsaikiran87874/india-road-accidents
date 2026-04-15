import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Filter, RotateCcw } from "lucide-react";
import { useState } from "react";
import { MAX_YEAR, MIN_YEAR, VEHICLE_TYPE_LABELS, VehicleType } from "../types";
import type { FilterState } from "../types";

const ALL_VEHICLE_TYPES: VehicleType[] = [
  VehicleType.TwoWheeler,
  VehicleType.Car,
  VehicleType.HeavyVehicle,
  VehicleType.Other,
];

const DEFAULT_FILTER: FilterState = {
  startYear: MIN_YEAR,
  endYear: MAX_YEAR,
  selectedStates: [],
  selectedVehicleTypes: [],
};

interface FilterPanelProps {
  availableStates: string[];
  value: FilterState;
  onChange: (filter: FilterState) => void;
}

export function FilterPanel({
  availableStates,
  value,
  onChange,
}: FilterPanelProps) {
  const [yearRange, setYearRange] = useState([value.startYear, value.endYear]);

  const handleYearChange = (range: number[]) => {
    setYearRange(range);
    onChange({ ...value, startYear: range[0], endYear: range[1] });
  };

  const toggleState = (state: string) => {
    const next = value.selectedStates.includes(state)
      ? value.selectedStates.filter((s) => s !== state)
      : [...value.selectedStates, state];
    onChange({ ...value, selectedStates: next });
  };

  const toggleVehicle = (vt: VehicleType) => {
    const next = value.selectedVehicleTypes.includes(vt)
      ? value.selectedVehicleTypes.filter((v) => v !== vt)
      : [...value.selectedVehicleTypes, vt];
    onChange({ ...value, selectedVehicleTypes: next });
  };

  const handleReset = () => {
    setYearRange([MIN_YEAR, MAX_YEAR]);
    onChange(DEFAULT_FILTER);
  };

  const hasActiveFilters =
    yearRange[0] !== MIN_YEAR ||
    yearRange[1] !== MAX_YEAR ||
    value.selectedStates.length > 0 ||
    value.selectedVehicleTypes.length > 0;

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 space-y-5"
      data-ocid="filter.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold font-display text-foreground">
            Filters
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs h-5">
              Active
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          data-ocid="filter.reset_button"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Year Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Year Range
          </Label>
          <span className="text-xs font-mono text-primary font-semibold">
            {yearRange[0]} – {yearRange[1]}
          </span>
        </div>
        <Slider
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={yearRange}
          onValueChange={handleYearChange}
          data-ocid="filter.year_range.select"
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{MIN_YEAR}</span>
          <span>{MAX_YEAR}</span>
        </div>
      </div>

      {/* Vehicle Types */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Vehicle Type
        </Label>
        <div className="space-y-2">
          {ALL_VEHICLE_TYPES.map((vt) => (
            <div key={vt} className="flex items-center gap-2">
              <Checkbox
                id={`vt-${vt}`}
                checked={value.selectedVehicleTypes.includes(vt)}
                onCheckedChange={() => toggleVehicle(vt)}
                data-ocid={`filter.vehicle_${vt.toLowerCase()}.checkbox`}
              />
              <Label
                htmlFor={`vt-${vt}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {VEHICLE_TYPE_LABELS[vt]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* States */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            States
          </Label>
          {value.selectedStates.length > 0 && (
            <span className="text-xs text-primary font-medium">
              {value.selectedStates.length} selected
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableStates.map((state) => (
            <div key={state} className="flex items-center gap-2">
              <Checkbox
                id={`state-${state}`}
                checked={value.selectedStates.includes(state)}
                onCheckedChange={() => toggleState(state)}
                data-ocid={`filter.state_${state.toLowerCase().replace(/\s+/g, "_")}.checkbox`}
              />
              <Label
                htmlFor={`state-${state}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_FILTER };
