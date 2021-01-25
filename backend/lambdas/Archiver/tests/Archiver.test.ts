import test from "ava";

import trainFeedInput from "./data/train-feed.input";
import expectedEntry from "./data/train-feed.expected";
import { getDate } from "../Archiver.util";
import generateArchiveEntry from "../Archiver.parser";

test("date is in correct format", (t) => {
  const date = getDate("today");
  t.regex(date, /202\d-\d{2}-\d{2}/);
});

test("archive entry is generated correctly", (t) => {
  const entry = generateArchiveEntry(trainFeedInput);
  t.deepEqual(entry, expectedEntry);
});
