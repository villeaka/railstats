import { IArchiveEntry } from "./Archive.types";

/**
 * The shape of the JSON that's generated by
 * a report parser, and stored in a bucket.
 */
export interface IReport<T> {
  /**
   * For daily reports formatted as "yyyy-mm-dd": the date from
   * which the data is from.
   * For aggregate reports formatted as full date time: the time
   * at which the report was generated.
   */
  date: string;
  data: T;
}

export type ReportParser<T> = (entry: IArchiveEntry) => IReport<T>;

export type AggregateReportParser<T> = (reports: IReport<any>[]) => IReport<T>;

/**
 * The kinds of reports that are generated.
 */
export type ReportPrefix = "summary";