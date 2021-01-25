import { IArchiveEntry } from "../../../types/Archive.types";
import { ReportParser } from "../../../types/Report.types";

/**
 * Composes a report parser which generates
 * a daily report from an archive entry.
 */
export default function composeParser<T>(
  generateReportData: (e: IArchiveEntry) => T,
): ReportParser<T> {
  return (entry: IArchiveEntry) => {
    const { date } = entry;

    return {
      date,
      data: generateReportData(entry),
    };
  };
}
