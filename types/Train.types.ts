export interface ITrain {
  trainNumber: number;
  departureDate: string;
  operatorUICCode: number
  operatorShortCode: string;
  trainType: string;
  trainCategory: TrainCategory;
  commuterLineID: string;
  runningCurrently: boolean;
  cancelled: boolean;
  deleted?: boolean;
  version: number;
  timetableType: "REGULAR" | "ADHOC";
  timetableAcceptanceDate: string;
  timeTableRows: ITimeTableRow[];
}

export interface ITimeTableRow {
  trainStopping: boolean;
  stationShortCode: string;
  stationUICCode: number;
  countryCode: "FI" | "RU";
  type: "ARRIVAL" | "DEPARTURE";
  commercialStop?: boolean;
  commercialTrack?: string;
  cancelled: boolean;
  scheduledTime: string;
  liveEstimateTime?: string;
  estimateSource?: string;
  unknownDelay?: boolean;
  actualTime?: string;
  differenceInMinutes?: number;
  causes: ICause[];
  trainReady?: ITrainReadyStatus;
}

// TODO: Move into Report.types
export interface IAggregateReport {
  summary: IAggregateReportNode;
  dailys: IAggregateDailyReport[];
}

export interface IAggregateDailyReport extends IAggregateReportNode {
  date: IDailyReport["date"];
}

export interface IAggregateReportNode {
  total: IDelayGroup;
  longDistance: IDelayGroup;
  commuter: IDelayGroup;
}

export interface IDailyReport {
  date: string;
  nodes: IDailyReportNode[];
}

export interface IDailyReportNode {
  id: string;
  cat: DailyReportTrainCategory;
  del: IDelayGroup;
}

export interface IDelayGroup {
  dep: IDelayNode;
  int: IDelayNode;
  arr: IDelayNode;
}

export interface IDelayNode {
  /**
   * Average train delay in milliseconds.
   * Negative value indicates train was early.
   */
  t: number | null;
  /**
   * Number of occurances from which the average train delay
   * is calculated from.
   */
  n: number;
}

/**
 * The categories of trains that are included on reports.
 */
export type DailyReportTrainCategory = Extract<TrainCategory, "Commuter" | "Long-distance">;

export type TrainCategory = "Cargo" | "Commuter" | "Locomotive" | "Long-distance" | "On-track machines" | "Shunting";

interface ICause {
  categoryCodeId: number;
  categoryCode: string;
  detailedCategoryCodeId?: number;
  detailedCategoryCode?: string;
  thirdCategoryCodeId?: number;
  thirdCategoryCode?: string;
}

interface ITrainReadyStatus {
  source: string;
  accepted: boolean;
  timestamp: string;
}
