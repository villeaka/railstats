import { EventBridgeEvent, Handler } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import fetch from "node-fetch";

import generateArchiveEntry from "./Archiver.parser";
import { getDate } from "./Archiver.util";
import { ITrain } from "../../../types/Train.types";

const {
  ARCHIVE_BUCKET,
  ARCHIVER_CURRENT_DAY_RULE,
  ARCHIVER_PREVIOUS_DAY_RULE,
} = (process.env as Record<string, string>);

const s3 = new S3();

/**
 * Fetches train data for the day, parses it, and
 * stores it in the archive bucket.
 *
 * @param event The scheduled EventBridge event that
 * triggered this lambda.
 */
export const handler: Handler = async (event: EventBridgeEvent<any, any>) => {
  const [caller] = event.resources;

  console.log(`Invoked by ${caller}`);

  const date = getTrainFeedDate(caller);

  if (!date) {
    throw new Error("Invalid caller");
  }

  console.log(`Fetching train feed for date ${date}`);

  const trains: ITrain[] = await fetch(`https://rata.digitraffic.fi/api/v1/trains/${date}`).then((res) => res.json());

  const entry = generateArchiveEntry(trains);

  await s3.putObject({
    Bucket: ARCHIVE_BUCKET,
    Key: `${date}.json`,
    Body: JSON.stringify(entry),
  }).promise();

  console.log(`Successfully archived entry for date ${date}`);
};

/**
 * The lambda regularly archives the current day's
 * train data. In addition, a second trigger for previous
 * day's train data is needed during the first hours of the day,
 * so data from trains spanning over midnight is also archived.
 *
 * @param caller The resource that invoked the lambda.
 * @returns The date for which to fetch the train feed.
 */
function getTrainFeedDate(caller: string) {
  const name = caller.split(":").pop();

  switch (name) {
    case ARCHIVER_CURRENT_DAY_RULE:
      return getDate("today");
    case ARCHIVER_PREVIOUS_DAY_RULE:
      return getDate("yesterday");
    default:
      return null;
  }
}
