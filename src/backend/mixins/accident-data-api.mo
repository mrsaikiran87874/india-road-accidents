import Types "../types/accident-data";
import AccidentDataLib "../lib/accident-data";
import List "mo:core/List";

mixin (records : List.List<Types.AccidentRecord>) {
  // Returns aggregated yearly stats for the given year range
  public query func getAccidentsByYear(startYear : Nat, endYear : Nat) : async [Types.YearlyStats] {
    let filtered = AccidentDataLib.filterByYearRange(records, startYear, endYear);
    AccidentDataLib.aggregateByYear(filtered);
  };

  // Returns per-state statistics (with yearly breakdown) for the requested states
  public query func getAccidentsByState(states : [Text]) : async [Types.StateStats] {
    let filtered = AccidentDataLib.filterByStates(records, states);
    AccidentDataLib.aggregateByState(filtered);
  };

  // Returns per-vehicle-type statistics for the requested vehicle types
  public query func getAccidentsByVehicleType(vehicleTypes : [Types.VehicleType]) : async [Types.VehicleTypeStats] {
    let filtered = AccidentDataLib.filterByVehicleTypes(records, vehicleTypes);
    AccidentDataLib.aggregateByVehicleType(filtered);
  };

  // Returns all distinct state names stored in the dataset
  public query func getAllStates() : async [Text] {
    AccidentDataLib.listAllStates(records);
  };

  // Returns summary stats (totals + rates) for a given filter set
  public query func getSummaryStats(filter : Types.DataFilter) : async Types.SummaryStats {
    let filtered = AccidentDataLib.applyFilter(records, filter);
    AccidentDataLib.computeSummary(filtered);
  };

  // Returns structured prevention guidelines
  public query func getPreventionGuidelines() : async [Types.Guideline] {
    AccidentDataLib.getGuidelines();
  };
};
