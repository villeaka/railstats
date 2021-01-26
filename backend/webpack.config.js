const _ = require("lodash");

const baseConfig = {
  target: "node",
  mode: "production",
  output: {
    filename: "[name].js",
    path: `${__dirname}/dist`,
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = [
  _.merge({}, baseConfig, {
    name: "archiver",
    entry: {
      archiver: `${__dirname}/lambdas/Archiver/Archiver.handler.ts`,
    },
  }),
  _.merge({}, baseConfig, {
    name: "daily-report-generator",
    entry: {
      "daily-report-generator": `${__dirname}/lambdas/DailyReportGenerator/DailyReportGenerator.handler.ts`,
    },
  }),
  _.merge({}, baseConfig, {
    name: "report-aggregator",
    entry: {
      "report-aggregator": `${__dirname}/lambdas/ReportAggregator/ReportAggregator.handler.ts`,
    },
  }),
];
