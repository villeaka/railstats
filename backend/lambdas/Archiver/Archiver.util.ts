import { formatISO, subDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

// eslint-disable-next-line import/prefer-default-export
export function getDate(when: "today" | "yesterday") {
  const utcDate = (new Date()).toISOString();
  const finnishDate = utcToZonedTime(utcDate, "Europe/Helsinki");
  const date = when === "today" ? finnishDate : subDays(finnishDate, 1);

  return formatISO(date, { representation: "date" });
}
