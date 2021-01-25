import summaryReports from "./summary-report.input";
import { IAggregateSummaryReport } from "../../../../../types/reports/SummaryReport.types";

const expected: IAggregateSummaryReport = {
  date: "foo",
  data: summaryReports,
};

export default expected;
