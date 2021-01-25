import composeParser from "../ReportAggregator.parser";
import { ISummaryReport } from "../../../../types/reports/SummaryReport.types";

export default composeParser(generateSummaryReportData);

/**
 * The summary report aggregation is a simple
 * concatenation of daily reports.
 */
function generateSummaryReportData(reports: ISummaryReport[]) {
  return reports;
}
