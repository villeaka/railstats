import { IReport } from "../Report.types";

export type IAggregateSummaryReport = IReport<ISummaryReport[]>;
export type ISummaryReport = IReport<ISummaryReportData>;

export interface ISummaryReportData {
  /**
   * Commuter train summary.
   */
  com: ISummaryReportDataNode;
  /**
   * Long-distance train summary.
   */
  long: ISummaryReportDataNode;
  /**
   * Total summary.
   */
  tot: ISummaryReportDataNode;
}

export interface ISummaryReportDataNode {
  /**
   * Total count of arrivals.
   */
  n: number;
  /**
   * Punctual arrival count.
   */
  p: number;
  /**
   * Cancelled count.
   */
  c: number;
  /**
   * Median delta.
   */
  d: number;
}
