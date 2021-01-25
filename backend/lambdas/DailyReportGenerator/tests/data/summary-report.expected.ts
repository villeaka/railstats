import { ISummaryReport } from "../../../../../types/reports/SummaryReport.types";

const expected: ISummaryReport = {
  date: "2021-01-16",
  data: {
    com: {
      c: 0,
      d: 300000,
      n: 4,
      p: 2,
    },
    long: {
      c: 2,
      d: 600000,
      n: 5,
      p: 2,
    },
    tot: {
      c: 2,
      d: 600000,
      n: 9,
      p: 4,
    },
  },
};

export default expected;
