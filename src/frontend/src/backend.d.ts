import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DataFilter {
    states?: Array<string>;
    startYear?: bigint;
    endYear?: bigint;
    vehicleTypes?: Array<VehicleType>;
}
export interface SummaryStats {
    injuries: bigint;
    deaths: bigint;
    fatalityRate: bigint;
    injuryRate: bigint;
    totalAccidents: bigint;
}
export interface VehicleTypeStats {
    vehicleType: VehicleType;
    yearlyBreakdown: Array<YearlyStats>;
    injuries: bigint;
    deaths: bigint;
    totalAccidents: bigint;
}
export interface YearlyStats {
    year: bigint;
    injuries: bigint;
    deaths: bigint;
    totalAccidents: bigint;
}
export interface StateStats {
    yearlyBreakdown: Array<YearlyStats>;
    injuries: bigint;
    deaths: bigint;
    state: string;
    totalAccidents: bigint;
}
export interface Guideline {
    id: bigint;
    title: string;
    tips: Array<string>;
    description: string;
    category: string;
}
export enum VehicleType {
    Car = "Car",
    TwoWheeler = "TwoWheeler",
    Other = "Other",
    HeavyVehicle = "HeavyVehicle"
}
export interface backendInterface {
    getAccidentsByState(states: Array<string>): Promise<Array<StateStats>>;
    getAccidentsByVehicleType(vehicleTypes: Array<VehicleType>): Promise<Array<VehicleTypeStats>>;
    getAccidentsByYear(startYear: bigint, endYear: bigint): Promise<Array<YearlyStats>>;
    getAllStates(): Promise<Array<string>>;
    getPreventionGuidelines(): Promise<Array<Guideline>>;
    getSummaryStats(filter: DataFilter): Promise<SummaryStats>;
}
