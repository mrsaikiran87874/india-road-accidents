import { VehicleType } from "../backend";
import type {
  DataFilter,
  Guideline,
  StateStats,
  SummaryStats,
  VehicleTypeStats,
  YearlyStats,
} from "../backend.d";

export { VehicleType };
export type {
  YearlyStats,
  StateStats,
  VehicleTypeStats,
  SummaryStats,
  DataFilter,
  Guideline,
};

export interface ChartDataPoint {
  year: number;
  totalAccidents: number;
  deaths: number;
  injuries: number;
}

export interface StateChartData {
  state: string;
  totalAccidents: number;
  deaths: number;
  injuries: number;
}

export interface VehicleChartData {
  vehicleType: string;
  totalAccidents: number;
  deaths: number;
  injuries: number;
}

export interface FilterState {
  startYear: number;
  endYear: number;
  selectedStates: string[];
  selectedVehicleTypes: VehicleType[];
}

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  TwoWheeler: "Two Wheeler",
  Car: "Car / Four Wheeler",
  HeavyVehicle: "Heavy Vehicle",
  Other: "Other Vehicle",
};

export const ALL_STATES = [
  "Telangana",
  "Kerala",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Rajasthan",
  "Gujarat",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "West Bengal",
  "Bihar",
  "Delhi",
  "Punjab",
  "Haryana",
];

export const MIN_YEAR = 2016;
export const MAX_YEAR = 2025;
