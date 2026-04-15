module {
  public type VehicleType = {
    #TwoWheeler;
    #Car;
    #HeavyVehicle;
    #Other;
  };

  // A single data record: accidents for one state, one year, one vehicle type
  public type AccidentRecord = {
    year : Nat;
    state : Text;
    vehicleType : VehicleType;
    totalAccidents : Nat;
    deaths : Nat;
    injuries : Nat;
  };

  // Aggregated data per year (all states, all vehicle types)
  public type YearlyStats = {
    year : Nat;
    totalAccidents : Nat;
    deaths : Nat;
    injuries : Nat;
  };

  // Per-state stats with yearly breakdown
  public type StateStats = {
    state : Text;
    yearlyBreakdown : [YearlyStats];
    totalAccidents : Nat;
    deaths : Nat;
    injuries : Nat;
  };

  // Per-vehicle-type stats
  public type VehicleTypeStats = {
    vehicleType : VehicleType;
    totalAccidents : Nat;
    deaths : Nat;
    injuries : Nat;
    yearlyBreakdown : [YearlyStats];
  };

  // Summary stats returned for a given filter set
  public type SummaryStats = {
    totalAccidents : Nat;
    deaths : Nat;
    injuries : Nat;
    fatalityRate : Nat; // deaths per 1000 accidents (scaled)
    injuryRate : Nat;   // injuries per 1000 accidents (scaled)
  };

  // Filters for querying data
  public type DataFilter = {
    states : ?[Text];
    vehicleTypes : ?[VehicleType];
    startYear : ?Nat;
    endYear : ?Nat;
  };

  // A prevention guideline entry
  public type Guideline = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    tips : [Text];
  };
};
