#### Statistics on how punctual Finland's passenger rail services are.

Data provided by [Fintraffic's API](https://www.digitraffic.fi/rautatieliikenne/) under license _CC BY 4.0_.

___

#### Architecture

The front-end is a React app which is pre-rendered into static HTML at build time, and served from S3. It presents report data as different kinds of graphs.

The back-end fetches train data and parses it into reports. Report generation is a three-phased process, and it consists of a series of Lambdas:
1. **Archiver**
    * Triggered by scheduled EventBridge events, the Lambda periodically fetches current day's train data from the [Fintraffic's API](https://www.digitraffic.fi/rautatieliikenne/), parses it into a more manageable form, and stores it as JSON into the archive bucket. The same is done for previous day's data in the first hours of the day, to account for train trips that span over midnight.
2. **Daily report generator**
    * Triggered by S3 object put into the archive bucket, the Lambda fetches the triggering object, parses it into different reports, and stores them as JSON into the daily report bucket. The report parsing consists of _N_ number of parsers: one for each kind of report (e.g. "summary report" and "top delay causes report"). The Lambda then stores each of the reports – each with their own identifying key prefix.
3. **Report aggregator**
    * Triggered by S3 object put into the daily report bucket, the Lambda fetches daily reports for the past year based on the key prefix of the triggering object, and aggregates the reports into one report. Aggregation is handled by a parser, which is determined by the report's prefix. The Lambda then stores the report into the report bucket, where the front-end eventually fetches it from.

Report generation is three-phased because the train data archived in phase #1 is quite detailed and weighs in at ~900 kB per entry. Aggregating reports (phase #3) straight from this data would mean processing over 300 MB of JSON for each report. To address this issue, phase #2 helps pre-process the final report by parsing and storing a daily report, which depending on the report is around 150 bytes per entry. This means that phase #3 needs to process only around 55 kB (365 daily reports) of JSON per report.
