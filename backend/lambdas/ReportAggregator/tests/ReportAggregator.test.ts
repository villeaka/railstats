import test from "ava";

import summaryReports from "./data/summary-report.input";
import expectedAggregateSummaryReport from "./data/summary-report.expected";
import aggregateSummaryReports from "../parsers/SummaryReport.parser";

test("summary reports aggregate correctly", (t) => {
  const { date, data } = aggregateSummaryReports(summaryReports);
  const { data: expectedData } = expectedAggregateSummaryReport;

  /**
   * Aggregate report date is calculated dynamically,
   * so can't assert its value statically.
   */
  t.regex(date, /202\d-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
  t.deepEqual(data, expectedData);
});
