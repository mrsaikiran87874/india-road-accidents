import Types "../types/accident-data";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Return all accident records as an immutable array
  public func getAllRecords(records : List.List<Types.AccidentRecord>) : [Types.AccidentRecord] {
    records.toArray();
  };

  // Filter records by year range (inclusive)
  public func filterByYearRange(
    records : List.List<Types.AccidentRecord>,
    startYear : Nat,
    endYear : Nat,
  ) : [Types.AccidentRecord] {
    records.filter(func(r) { r.year >= startYear and r.year <= endYear }).toArray();
  };

  // Filter records by state names
  public func filterByStates(
    records : List.List<Types.AccidentRecord>,
    states : [Text],
  ) : [Types.AccidentRecord] {
    if (states.size() == 0) return records.toArray();
    records.filter(func(r) { states.find(func(s) { s == r.state }) != null }).toArray();
  };

  // Filter records by vehicle types
  public func filterByVehicleTypes(
    records : List.List<Types.AccidentRecord>,
    vehicleTypes : [Types.VehicleType],
  ) : [Types.AccidentRecord] {
    if (vehicleTypes.size() == 0) return records.toArray();
    records.filter(func(r) { vehicleTypes.find(func(vt) { vt == r.vehicleType }) != null }).toArray();
  };

  // Apply a DataFilter to records — combines all active filters
  public func applyFilter(
    records : List.List<Types.AccidentRecord>,
    filter : Types.DataFilter,
  ) : [Types.AccidentRecord] {
    var filtered = records.toArray();

    switch (filter.startYear) {
      case (?sy) {
        let ey = switch (filter.endYear) { case (?e) e; case null 2025 };
        filtered := filtered.filter(func(r) { r.year >= sy and r.year <= ey });
      };
      case null {
        switch (filter.endYear) {
          case (?ey) {
            filtered := filtered.filter(func(r) { r.year <= ey });
          };
          case null {};
        };
      };
    };

    switch (filter.states) {
      case (?sts) {
        if (sts.size() > 0) {
          filtered := filtered.filter(func(r) { sts.find(func(s) { s == r.state }) != null });
        };
      };
      case null {};
    };

    switch (filter.vehicleTypes) {
      case (?vts) {
        if (vts.size() > 0) {
          filtered := filtered.filter(func(r) { vts.find(func(vt) { vt == r.vehicleType }) != null });
        };
      };
      case null {};
    };

    filtered;
  };

  // Aggregate records into YearlyStats, sorted ascending by year
  public func aggregateByYear(records : [Types.AccidentRecord]) : [Types.YearlyStats] {
    let yearMap = Map.empty<Nat, (Nat, Nat, Nat)>();
    for (r in records.values()) {
      let (acc, deaths, injuries) = switch (yearMap.get(r.year)) {
        case (?v) v;
        case null (0, 0, 0);
      };
      yearMap.add(r.year, (acc + r.totalAccidents, deaths + r.deaths, injuries + r.injuries));
    };
    let pairs = yearMap.toArray();
    let sorted = pairs.sort(func(a : (Nat, (Nat, Nat, Nat)), b : (Nat, (Nat, Nat, Nat))) : { #less; #equal; #greater } {
      Nat.compare(a.0, b.0)
    });
    sorted.map<(Nat, (Nat, Nat, Nat)), Types.YearlyStats>(func(entry) {
      let (year, stats) = entry;
      let (acc, d, inj) = stats;
      { year; totalAccidents = acc; deaths = d; injuries = inj }
    });
  };

  // Aggregate records into StateStats, sorted descending by totalAccidents
  public func aggregateByState(records : [Types.AccidentRecord]) : [Types.StateStats] {
    let stateMap = Map.empty<Text, (Nat, Nat, Nat)>();
    let stateYearMap = Map.empty<Text, Map.Map<Nat, (Nat, Nat, Nat)>>();

    for (r in records.values()) {
      // Update state totals
      let (acc, d, inj) = switch (stateMap.get(r.state)) {
        case (?v) v;
        case null (0, 0, 0);
      };
      stateMap.add(r.state, (acc + r.totalAccidents, d + r.deaths, inj + r.injuries));

      // Update per-state yearly breakdown
      let yearMap = switch (stateYearMap.get(r.state)) {
        case (?m) m;
        case null {
          let m = Map.empty<Nat, (Nat, Nat, Nat)>();
          stateYearMap.add(r.state, m);
          m;
        };
      };
      let (ya, yd, yi) = switch (yearMap.get(r.year)) {
        case (?v) v;
        case null (0, 0, 0);
      };
      yearMap.add(r.year, (ya + r.totalAccidents, yd + r.deaths, yi + r.injuries));
    };

    let pairs = stateMap.toArray();
    let sorted = pairs.sort(func(a : (Text, (Nat, Nat, Nat)), b : (Text, (Nat, Nat, Nat))) : { #less; #equal; #greater } {
      let (_, aStats) = a;
      let (_, bStats) = b;
      let (aAcc, _, _) = aStats;
      let (bAcc, _, _) = bStats;
      Nat.compare(bAcc, aAcc)
    });
    sorted.map<(Text, (Nat, Nat, Nat)), Types.StateStats>(func(entry) {
      let (state, totals) = entry;
      let (totalAcc, totalD, totalInj) = totals;
      let yearBreakdown = buildYearBreakdown(stateYearMap, state);
      {
        state;
        yearlyBreakdown = yearBreakdown;
        totalAccidents = totalAcc;
        deaths = totalD;
        injuries = totalInj;
      }
    });
  };

  // Aggregate records into VehicleTypeStats
  public func aggregateByVehicleType(records : [Types.AccidentRecord]) : [Types.VehicleTypeStats] {
    let vtMap = Map.empty<Text, (Types.VehicleType, Nat, Nat, Nat)>();
    let vtYearMap = Map.empty<Text, Map.Map<Nat, (Nat, Nat, Nat)>>();

    for (r in records.values()) {
      let key = vehicleTypeKey(r.vehicleType);
      let (vt, acc, d, inj) = switch (vtMap.get(key)) {
        case (?(v, a, dd, i)) (v, a, dd, i);
        case null (r.vehicleType, 0, 0, 0);
      };
      vtMap.add(key, (vt, acc + r.totalAccidents, d + r.deaths, inj + r.injuries));

      let yearMap = switch (vtYearMap.get(key)) {
        case (?m) m;
        case null {
          let m = Map.empty<Nat, (Nat, Nat, Nat)>();
          vtYearMap.add(key, m);
          m;
        };
      };
      let (ya, yd, yi) = switch (yearMap.get(r.year)) {
        case (?v) v;
        case null (0, 0, 0);
      };
      yearMap.add(r.year, (ya + r.totalAccidents, yd + r.deaths, yi + r.injuries));
    };

    let pairs = vtMap.toArray();
    pairs.map<(Text, (Types.VehicleType, Nat, Nat, Nat)), Types.VehicleTypeStats>(func(entry) {
      let (key, vtData) = entry;
      let (vt, totalAcc, totalD, totalInj) = vtData;
      let yearBreakdown = buildYearBreakdown(vtYearMap, key);
      {
        vehicleType = vt;
        totalAccidents = totalAcc;
        deaths = totalD;
        injuries = totalInj;
        yearlyBreakdown = yearBreakdown;
      }
    });
  };

  // Compute SummaryStats over a flat array of records
  public func computeSummary(records : [Types.AccidentRecord]) : Types.SummaryStats {
    var totalAccidents = 0;
    var totalDeaths = 0;
    var totalInjuries = 0;
    for (r in records.values()) {
      totalAccidents += r.totalAccidents;
      totalDeaths += r.deaths;
      totalInjuries += r.injuries;
    };
    let fatalityRate = if (totalAccidents == 0) 0 else (totalDeaths * 1000) / totalAccidents;
    let injuryRate = if (totalAccidents == 0) 0 else (totalInjuries * 1000) / totalAccidents;
    {
      totalAccidents;
      deaths = totalDeaths;
      injuries = totalInjuries;
      fatalityRate;
      injuryRate;
    };
  };

  // Return all unique state names present in the records
  public func listAllStates(records : List.List<Types.AccidentRecord>) : [Text] {
    let seen = Map.empty<Text, Bool>();
    for (r in records.values()) {
      seen.add(r.state, true);
    };
    seen.keys().toArray();
  };

  // Return all prevention guidelines based on India's 4E strategy
  public func getGuidelines() : [Types.Guideline] {
    [
      {
        id = 1;
        category = "Education";
        title = "Road Safety Awareness Programs";
        description = "Educate road users about traffic rules, safe driving practices, and the consequences of reckless behavior through schools, colleges, and community programs.";
        tips = [
          "Attend certified defensive driving courses",
          "Teach children road safety from an early age",
          "Follow the look right, look left, look right again rule before crossing",
          "Never use mobile phones while driving or walking on roads",
        ];
      },
      {
        id = 2;
        category = "Education";
        title = "Helmet and Seatbelt Compliance";
        description = "Two-wheeler riders account for the highest accident fatalities in India. Wearing helmets reduces death risk by 40%. Seatbelts reduce car occupant fatality risk by 50%.";
        tips = [
          "Always wear an ISI-marked helmet — full-face helmets offer best protection",
          "Fasten seatbelts for all passengers, including rear-seat occupants",
          "Children under 12 should use age-appropriate car seats",
          "Replace helmets after any impact even if damage is not visible",
        ];
      },
      {
        id = 3;
        category = "Engineering";
        title = "Road Infrastructure Improvements";
        description = "Engineering interventions such as better road design, adequate lighting, clear signage, and safe pedestrian crossings significantly reduce accident frequency and severity.";
        tips = [
          "Advocate for proper road markings and reflective signs in your area",
          "Report potholes and road defects to local municipal authorities",
          "Support installation of speed breakers near schools and hospitals",
          "Use designated pedestrian crossings and footpaths wherever available",
        ];
      },
      {
        id = 4;
        category = "Enforcement";
        title = "Traffic Law Enforcement";
        description = "Strict enforcement of speed limits, drunk-driving laws, and traffic regulations deters violations. India's Motor Vehicles Amendment Act 2019 introduced higher penalties for offences.";
        tips = [
          "Never drink and drive — blood alcohol limit is 30mg per 100ml in India",
          "Respect speed limits: 50 km/h in urban areas, 100 km/h on highways",
          "Do not jump red lights or overtake from the wrong side",
          "Carry valid license, insurance, and PUC certificate at all times",
        ];
      },
      {
        id = 5;
        category = "Enforcement";
        title = "Anti-Speeding and Overloading Measures";
        description = "Speeding is involved in over 70% of fatal accidents in India. Heavy vehicles are frequently overloaded, increasing stopping distances and rollover risk.";
        tips = [
          "Maintain safe following distance — at least 3 seconds behind the vehicle ahead",
          "Reduce speed in rain, fog, or at night when visibility is reduced",
          "Heavy vehicle operators must not exceed axle load limits",
          "Use cruise control on highways to maintain consistent legal speeds",
        ];
      },
      {
        id = 6;
        category = "Emergency Care";
        title = "Golden Hour Response and First Aid";
        description = "Timely medical care within the golden hour after an accident can save lives. India's Good Samaritan Law protects bystanders who help accident victims.";
        tips = [
          "Call 112 (National Emergency) or 108 (Ambulance) immediately after an accident",
          "Do not move an injured person unless there is risk of fire or drowning",
          "Learn basic first aid and CPR — it can save a life before help arrives",
          "Good Samaritans are legally protected — help accident victims without fear",
        ];
      },
      {
        id = 7;
        category = "Emergency Care";
        title = "Trauma Care Infrastructure";
        description = "India is expanding its network of trauma centres and cashless treatment schemes for road accident victims. Knowing nearby facilities can reduce response time.";
        tips = [
          "Save the nearest trauma centre number in your phone",
          "Road accident victims are entitled to cashless treatment at empanelled hospitals",
          "Nirbhaya Fund supports setting up trauma centres every 100 km on national highways",
          "Register vehicles on iRAD (Integrated Road Accident Database) for faster response",
        ];
      },
    ];
  };

  // Seed: generate realistic MORTH-pattern records for 2016-2025
  public func seedRecords(records : List.List<Types.AccidentRecord>) {
    if (records.size() > 0) return;

    let stateBaseAccidents : [(Text, Nat)] = [
      ("Uttar Pradesh", 42000),
      ("Tamil Nadu", 38000),
      ("Maharashtra", 34000),
      ("Madhya Pradesh", 30000),
      ("Karnataka", 28000),
      ("Rajasthan", 24000),
      ("Gujarat", 22000),
      ("Andhra Pradesh", 20000),
      ("Telangana", 18000),
      ("West Bengal", 16000),
      ("Kerala", 14000),
      ("Haryana", 12000),
      ("Punjab", 10000),
      ("Bihar", 9000),
      ("Delhi", 8000),
    ];

    // (year, multiplier_num, multiplier_den): growth 2016-2019, COVID dip 2020, recovery 2021-2025
    let yearMultipliers : [(Nat, Nat, Nat)] = [
      (2016, 90, 100),
      (2017, 95, 100),
      (2018, 100, 100),
      (2019, 103, 100),
      (2020, 72, 100),
      (2021, 88, 100),
      (2022, 96, 100),
      (2023, 101, 100),
      (2024, 104, 100),
      (2025, 106, 100),
    ];

    // (vt, accShare_num, accShare_den, deathRate_num, deathRate_den, injRate_num, injRate_den)
    let vehicleTypeParams : [(Types.VehicleType, Nat, Nat, Nat, Nat, Nat, Nat)] = [
      (#TwoWheeler,   45, 100, 28, 100, 95, 100),
      (#Car,          30, 100, 18, 100, 85, 100),
      (#HeavyVehicle, 15, 100, 42, 100, 70, 100),
      (#Other,        10, 100, 12, 100, 60, 100),
    ];

    // Per-state variation multipliers (num, den)
    let stateVariation : [(Text, Nat, Nat)] = [
      ("Uttar Pradesh",  103, 100),
      ("Tamil Nadu",     101, 100),
      ("Maharashtra",    102, 100),
      ("Madhya Pradesh",  98, 100),
      ("Karnataka",       99, 100),
      ("Rajasthan",       97, 100),
      ("Gujarat",        101, 100),
      ("Andhra Pradesh", 100, 100),
      ("Telangana",      102, 100),
      ("West Bengal",     98, 100),
      ("Kerala",          96, 100),
      ("Haryana",         99, 100),
      ("Punjab",         101, 100),
      ("Bihar",          103, 100),
      ("Delhi",          100, 100),
    ];

    for (statePair in stateBaseAccidents.values()) {
      let (state, baseAcc) = statePair;
      let (svNum, svDen) = switch (stateVariation.find(func(sv) { let (s, _, _) = sv; s == state })) {
        case (?(_, n, d)) (n, d);
        case null (100, 100);
      };

      for (ymPair in yearMultipliers.values()) {
        let (year, ymNum, ymDen) = ymPair;
        let stateYearBase = (baseAcc * ymNum * svNum) / (ymDen * svDen);

        for (vtPair in vehicleTypeParams.values()) {
          let (vt, accNum, accDen, drNum, drDen, irNum, irDen) = vtPair;
          let vtAccidents = (stateYearBase * accNum) / accDen;
          let yearOffset = if (year > 2018) year - 2018 else 0;
          let adjustedAccidents = vtAccidents + (yearOffset * vtAccidents / 200);
          let deaths = (adjustedAccidents * drNum) / drDen;
          let injuries = (adjustedAccidents * irNum) / irDen;

          records.add({
            year;
            state;
            vehicleType = vt;
            totalAccidents = adjustedAccidents;
            deaths;
            injuries;
          });
        };
      };
    };
  };

  // Helper: build sorted yearly breakdown from a keyed map of year maps
  private func buildYearBreakdown(
    outerMap : Map.Map<Text, Map.Map<Nat, (Nat, Nat, Nat)>>,
    key : Text,
  ) : [Types.YearlyStats] {
    switch (outerMap.get(key)) {
      case (?ym) {
        let pairs = ym.toArray();
        let sorted = pairs.sort(func(a : (Nat, (Nat, Nat, Nat)), b : (Nat, (Nat, Nat, Nat))) : { #less; #equal; #greater } {
          Nat.compare(a.0, b.0)
        });
        sorted.map<(Nat, (Nat, Nat, Nat)), Types.YearlyStats>(func(entry) {
          let (year, stats) = entry;
          let (acc, d, inj) = stats;
          { year; totalAccidents = acc; deaths = d; injuries = inj }
        });
      };
      case null [];
    };
  };

  // Internal helper: stable string key for a VehicleType
  private func vehicleTypeKey(vt : Types.VehicleType) : Text {
    switch (vt) {
      case (#TwoWheeler)   "TwoWheeler";
      case (#Car)          "Car";
      case (#HeavyVehicle) "HeavyVehicle";
      case (#Other)        "Other";
    };
  };
};
