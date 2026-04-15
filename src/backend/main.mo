import Types "types/accident-data";
import AccidentDataMixin "mixins/accident-data-api";
import AccidentDataLib "lib/accident-data";
import List "mo:core/List";

actor {
  let records = List.empty<Types.AccidentRecord>();

  // Seed data on first deploy (records list starts empty; lib.seedRecords populates it)
  AccidentDataLib.seedRecords(records);

  include AccidentDataMixin(records);
};
