import { IArchiveEntry } from "../../../../../types/Archive.types";
import { DELAYED_TIME, EARLY_TIME, SCHEDULED_TIME } from "./train-feed.input";

const DELAYED_TIMESTAMP = Date.parse(DELAYED_TIME);
const EARLY_TIMESTAMP = Date.parse(EARLY_TIME);
const SCHEDULED_TIMESTAMP = Date.parse(SCHEDULED_TIME);

const expected: IArchiveEntry = {
  date: "2021-01-17",
  trips: [
    {
      id: "HKI-JNS",
      cat: "Long-distance",
      tid: "IC 3",
      typ: "IC",
      stops: [
        {
          id: "PSL",
          d: 300000,
          t: DELAYED_TIMESTAMP,
        },
        {
          id: "HVK",
        },
        {
          id: "JNS",
        },
      ],
    },
    {
      id: "HKI-ILA",
      cat: "Commuter",
      tid: "A",
      typ: "HL",
      stops: [
        {
          id: "PSL",
          d: 0,
          t: SCHEDULED_TIMESTAMP,
        },
        {
          id: "ILA",
          d: 0,
          t: SCHEDULED_TIMESTAMP,
        },
      ],
    },
    {
      id: "LPV-PJM",
      cat: "Commuter",
      tid: "A",
      typ: "HL",
      stops: [
        {
          id: "MÄK",
          d: 300000,
          t: DELAYED_TIMESTAMP,
        },
        {
          id: "PJM",
          cancelled: true,
        },
      ],
    },
  ],
};

export default expected;
