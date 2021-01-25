import { IArchiveEntry } from "../../../../../types/Archive.types";

const ARRIVAL_TIME = 1610877600000;
const DELAYED_DELTA = 600000;
const EARLY_DELTA = -150000;
const ON_TIME_DELTA = 0;

const input: IArchiveEntry = {
  date: "2021-01-16",
  trips: [
    {
      cat: "Long-distance",
      id: "HKI-JNS",
      tid: "IC 1",
      typ: "IC",
      stops: [
        {
          id: "PSL",
          t: ARRIVAL_TIME,
          d: ON_TIME_DELTA,
        },
        {
          id: "KÄP",
          t: ARRIVAL_TIME,
          d: DELAYED_DELTA,
        },
        {
          id: "OLK",
          t: ARRIVAL_TIME,
          d: EARLY_DELTA,
        },
      ],
    },
    {
      cat: "Long-distance",
      id: "JNS-HKI",
      tid: "S 2",
      typ: "S",
      stops: [
        {
          id: "PLT",
          t: ARRIVAL_TIME,
          d: DELAYED_DELTA,
        },
        {
          id: "SUL",
          t: ARRIVAL_TIME,
          d: DELAYED_DELTA,
        },
        {
          id: "NTH",
          cancelled: true,
        },
      ],
    },
    {
      cat: "Long-distance",
      id: "JNS-HKI",
      tid: "S 3",
      typ: "S",
      stops: [
        {
          id: "PLT",
          cancelled: true,
        },
        {
          id: "SUL",
          cancelled: true,
        },
      ],
    },
    {
      cat: "Commuter",
      id: "LPV-HKI",
      tid: "A",
      typ: "HL",
      stops: [
        {
          id: "MÄK",
          t: ARRIVAL_TIME,
          d: DELAYED_DELTA,
        },
        {
          id: "PJM",
          t: ARRIVAL_TIME,
          d: DELAYED_DELTA,
        },
        {
          id: "VMO",
          t: ARRIVAL_TIME,
          d: ON_TIME_DELTA,
        },
        {
          id: "HPL",
          t: ARRIVAL_TIME,
          d: ON_TIME_DELTA,
        },
      ],
    },
  ],
};

export default input;
