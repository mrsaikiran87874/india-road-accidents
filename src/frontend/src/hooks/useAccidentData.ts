import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { DataFilter, VehicleType } from "../types";

export function useAccidentsByYear(startYear: number, endYear: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["accidentsByYear", startYear, endYear],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAccidentsByYear(BigInt(startYear), BigInt(endYear));
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAccidentsByState(states: string[]) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["accidentsByState", states],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAccidentsByState(states);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAccidentsByVehicleType(vehicleTypes: VehicleType[]) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["accidentsByVehicleType", vehicleTypes],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAccidentsByVehicleType(vehicleTypes);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSummaryStats(filter: DataFilter) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["summaryStats", filter],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSummaryStats(filter);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllStates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["allStates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePreventionGuidelines() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["preventionGuidelines"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPreventionGuidelines();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 60 * 1000,
  });
}
