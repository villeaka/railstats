import _ from "lodash";

import composeParser from "../DailyReportGenerator.parser";
import { IArchiveEntry, ITrip, ITripStop } from "../../../../types/Archive.types";
import { ISummaryReportData, ISummaryReportDataNode } from "../../../../types/reports/SummaryReport.types";

/**
 * TODO: From env.
 *
 * If arrival delta is below this threshold, then
 * the train is regarded to be on time.
 */
const DELAY_THRESHOLD = 300000;

export default composeParser(generateSummaryReportData);

function generateSummaryReportData(entry: IArchiveEntry): ISummaryReportData {
  const { trips } = entry;

  return toSummaryReportEntry(trips);
}

function toSummaryReportEntry(trips: ITrip[]): ISummaryReportData {
  const commuters = trips.filter((trip) => trip.cat === "Commuter");
  const longDistances = trips.filter((trip) => trip.cat === "Long-distance");

  return {
    com: toSummaryReportEntryNode(commuters),
    long: toSummaryReportEntryNode(longDistances),
    tot: toSummaryReportEntryNode(trips),
  };
}

function toSummaryReportEntryNode(trips: ITrip[]): ISummaryReportDataNode {
  const arrivals = _.flatten(
    trips.map((trip) => (
      trip.stops.filter(
        /**
         * If the stop delta (or timestamp – they are derived from the same
         * property) is set, then the train has arrived to the stop.
         */
        (stop): stop is ITripStop & { d: number } => stop.d !== undefined,
      )
    )),
  );

  /**
   * A trip is considered cancelled if any stop is missed.
   */
  const cancelledCount = trips.filter((trip) => trip.stops.some((stop) => stop.cancelled)).length;
  const medianDelta = median(arrivals.map((arrival) => arrival.d));
  const totalCount = arrivals.length;
  const onTimeCount = arrivals.filter((arrival) => arrival.d < DELAY_THRESHOLD).length;

  return {
    c: cancelledCount,
    d: medianDelta,
    n: totalCount,
    p: onTimeCount,
  };
}

function median(values: number[]) {
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const evenLength = sorted.length % 2 === 0;

  if (evenLength) {
    const middleValues: [number, number] = [sorted[middle - 1], sorted[middle]];

    return Math.round(_.mean(middleValues));
  }

  return sorted[middle];
}
