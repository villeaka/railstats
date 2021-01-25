import { Handler, S3Event } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";

import generateSummaryReport from "./parsers/SummaryReport.parser";
import { IArchiveEntry } from "../../../types/Archive.types";
import { IReport, ReportPrefix } from "../../../types/Report.types";

const { DAILY_REPORTS_BUCKET } = (process.env as Record<string, string>);
const SUMMARY_REPORT_PREFIX = "summary";

const s3 = new S3();

/**
 * Fetches an archive entry, generates daily reports from
 * it, and stores those reports in the daily report bucket.
 *
 * @param event The S3 (put) event that triggered this lambda.
 */
export const handler: Handler = async (event: S3Event) => {
  const [caller] = event.Records;
  const {
    s3: {
      bucket: { arn, name },
      object: { key },
    },
  } = caller;

  console.log(`Invoked by ${arn}`);
  console.log(`Fetching archive entry "${key}"`);

  const entry: IArchiveEntry = await s3.getObject({
    Bucket: name,
    Key: key,
  })
    .promise()
    .then((res) => (res.Body ? JSON.parse(res.Body.toString()) : null));

  if (!entry) {
    throw new Error("Invalid archive entry");
  }

  console.log("Generating reports");

  const reports: Record<ReportPrefix, IReport<any>> = {
    [SUMMARY_REPORT_PREFIX]: generateSummaryReport(entry),
  };

  const s3PutPromises = Object
    .entries(reports)
    .map(([prefix, report]) => (
      s3.putObject({
        Bucket: DAILY_REPORTS_BUCKET,
        Key: `${prefix}_${report.date}.json`,
        Body: JSON.stringify(report),
      }).promise()
    ));

  await Promise.all(s3PutPromises);

  console.log("Successfully stored reports");
};
