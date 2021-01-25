import { Handler, S3Event } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import _ from "lodash";

import generateAggregateSummaryReport from "./parsers/SummaryReport.parser";
import { AggregateReportParser, IReport, ReportPrefix } from "../../../types/Report.types";

const { REPORTS_BUCKET } = (process.env as Record<string, string>);
/**
 * Fetch daily reports for the last year.
 */
const MAX_DAILY_REPORT_FETCH_COUNT = 365;

const s3 = new S3();

/**
 * Fetches daily reports based on the triggering object prefix, generates
 * an aggregate report from those, and stores the report in the report bucket.
 *
 * @param event The S3 (put) event that triggered this lambda.
 */
export const handler: Handler = async (event: S3Event) => {
  const [caller] = event.Records;
  const {
    s3: {
      bucket: { arn, name },
      object: { key: invokingObjectKey },
    },
  } = caller;

  console.log(`Invoked by ${arn}`);

  const prefix = invokingObjectKey.split("_")[0] as ReportPrefix;
  const parser = getParser(prefix);

  if (!parser) {
    throw new Error(`Invalid prefix "${prefix}"`);
  }

  const { Contents } = await s3.listObjectsV2({
    Bucket: name,
    MaxKeys: MAX_DAILY_REPORT_FETCH_COUNT,
    Prefix: prefix,
  }).promise();

  const keys = Contents
    ?.map(({ Key }) => Key)
    .filter((key): key is string => !!key);

  if (!keys?.length) {
    throw new Error(`No reports matched the prefix "${prefix}"`);
  }

  const s3GetPromises = keys.map((key) => (
    s3.getObject({
      Bucket: name,
      Key: key,
    })
      .promise()
      .then((res) => {
        const report: IReport<any> = res.Body ? JSON.parse(res.Body.toString()) : null;

        return report;
      })
  ));

  const dailyReports: IReport<any>[] = (await Promise.all(s3GetPromises))
    /**
     * Filter out empty S3 responses. Shouldn't be possible.
     */
    .filter(_.isObject);

  console.log("Generating aggregate report");

  const aggregateReport = parser(dailyReports);

  await s3.putObject({
    Bucket: REPORTS_BUCKET,
    Key: `${prefix}.json`,
    Body: JSON.stringify(aggregateReport),
  }).promise();

  console.log("Successfully stored report");
};

function getParser(prefix: ReportPrefix): AggregateReportParser<any> | null {
  switch (prefix) {
    case "summary":
      return generateAggregateSummaryReport;
    default:
      return null;
  }
}
