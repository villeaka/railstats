import test from "ava";

import entry from "./data/archive-entry.input";
import expectedSummaryReport from "./data/summary-report.expected";
import generateSummaryReport from "../parsers/SummaryReport.parser";

test("daily summary report is generated correctly", (t) => {
  const report = generateSummaryReport(entry);
  t.deepEqual(report, expectedSummaryReport);
});
