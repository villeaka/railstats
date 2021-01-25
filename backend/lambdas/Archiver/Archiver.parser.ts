import _ from "lodash";

import { ArchivalTrainCategory, IArchiveEntry, ITrip, ITripStop } from "../../../types/Archive.types";
import { ITimeTableRow, ITrain } from "../../../types/Train.types";

const ARCHIVAL_TRAIN_CATEGORIES: ArchivalTrainCategory[] = ["Commuter", "Long-distance"];

export default function generateArchiveEntry(trains: ITrain[]): IArchiveEntry {
  const trips: ITrip[] = trains
    .filter((train) => {
      const {
        trainCategory,
        trainNumber,
        trainType,
        commuterLineID,
        timeTableRows,
      } = train;

      if (!_.includes(ARCHIVAL_TRAIN_CATEGORIES, trainCategory)) {
        return false;
      }

      if (!timeTableRows.length) {
        return false;
      }

      const trainLineId = trainCategory === "Commuter"
        ? commuterLineID
        : `${trainType} ${trainNumber}`;

      /**
       * Observed during testing that train "HV 11663" was categorized as "Commuter", and
       * its `commuterLineID` was empty – likely a mislabeling. Sanity check `trainLineId` to
       * prevent cases like this.
       */
      if (!trainLineId) {
        return false;
      }

      return true;
    })
    .map((train) => {
      const {
        trainCategory,
        trainNumber,
        trainType,
        commuterLineID,
        timeTableRows,
      } = train;

      const origin = _.head(timeTableRows)?.stationShortCode;
      const destination = _.last(timeTableRows)?.stationShortCode;

      const trainLineId = trainCategory === "Commuter"
        ? commuterLineID
        : `${trainType} ${trainNumber}`;

      const arrivals = timeTableRows.filter((row) => row.type === "ARRIVAL");

      return {
        cat: trainCategory as ArchivalTrainCategory,
        id: `${origin}-${destination}`,
        tid: trainLineId,
        typ: trainType,
        stops: arrivals.map(toTripStop),
      };
    });

  return {
    /**
     * `departureDate` is same for all rows returned by the API.
     */
    date: trains[0].departureDate,
    trips,
  };
}

function toTripStop(timeTableRow: ITimeTableRow): ITripStop {
  const {
    stationShortCode,
    cancelled,
    causes,
    scheduledTime,
    actualTime,
  } = timeTableRow;

  const timestamp = actualTime ? getUTCTimestamp(actualTime) : undefined;
  const delta = timestamp ? timestamp - getUTCTimestamp(scheduledTime) : undefined;
  const causeIds = causes.map((cause) => cause.detailedCategoryCodeId || cause.categoryCodeId);

  return {
    id: stationShortCode,
    ...timestamp && { t: timestamp },
    /**
     * Allow zero values to be included since
     * it indicates the train was on time to
     * a millisecond.
     */
    ...delta !== undefined && { d: delta },
    ...cancelled && { cancelled },
    ...causeIds.length && { causes: causeIds },
  };
}

function getUTCTimestamp(date: string) {
  const isoDate = (new Date(date)).toISOString();

  return Date.parse(isoDate);
}
