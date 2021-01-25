import _ from "lodash";

import { AggregateReportParser, IReport } from "../../../types/Report.types";

/**
 * Composes a report parser which generates
 * an aggregate report from daily reports.
 */
export default function composeParser<T>(
  generateReportData: (reports: IReport<any>[]) => T,
): AggregateReportParser<T> {
  return (reports: IReport<any>[]) => {
    const isoTimestamp = (new Date()).toISOString();
    const sortedReports = _.sortBy(reports, "date");

    return {
      date: isoTimestamp,
      data: generateReportData(sortedReports),
    };
  };
}
