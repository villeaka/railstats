include .env
ENV:=$(shell cat .env | xargs | sed 's/ /,/g')
ROOT_DIR:=$(shell dirname $$(pwd))

test:
	cd .. && npx ava backend/**/*.test.ts

test-archiver:
	cd .. && npx ava backend/lambdas/Archiver/**/*.test.ts

test-daily-report-generator:
	cd .. && npx ava backend/lambdas/DailyReportGenerator/**/*.test.ts

test-report-aggregator:
	cd .. && npx ava backend/lambdas/ReportAggregator/**/*.test.ts

# Archiver

dist-archiver: test-archiver
	npx webpack -c ./webpack.config.js --config-name $(ARCHIVER_PACKAGE_NAME)
	zip -j dist/$(ARCHIVER_PACKAGE_NAME).zip dist/$(ARCHIVER_PACKAGE_NAME).js

init-archiver: dist-archiver
	aws --profile $(AWS_PROFILE) \
	lambda create-function \
	--function-name $(ARCHIVER_FUNCTION_NAME) \
	--zip-file fileb://dist/$(ARCHIVER_PACKAGE_NAME).zip \
	--handler $(ARCHIVER_PACKAGE_NAME).handler \
	--runtime nodejs12.x \
	--timeout 30 \
	--memory-size 1024 \
	--role $(ARCHIVER_ROLE) \
	--environment "Variables={$(ENV)}"

update-archiver: dist-archiver
	aws --profile $(AWS_PROFILE) \
	lambda update-function-code \
	--function-name $(ARCHIVER_FUNCTION_NAME) \
	--zip-file fileb://dist/$(ARCHIVER_PACKAGE_NAME).zip

	aws --profile $(AWS_PROFILE) \
	lambda update-function-configuration \
	--function-name $(ARCHIVER_FUNCTION_NAME) \
	--environment "Variables={$(ENV)}"

# DailyReportGenerator

dist-daily-report-generator: test-daily-report-generator
	npx webpack -c webpack.config.js --config-name $(DAILY_REPORT_GENERATOR_PACKAGE_NAME)
	zip -j dist/$(DAILY_REPORT_GENERATOR_PACKAGE_NAME).zip dist/$(DAILY_REPORT_GENERATOR_PACKAGE_NAME).js

init-daily-report-generator: dist-daily-report-generator
	aws --profile $(AWS_PROFILE) \
	lambda create-function --function-name $(DAILY_REPORT_GENERATOR_FUNCTION_NAME) \
	--zip-file fileb://dist/$(DAILY_REPORT_GENERATOR_PACKAGE_NAME).zip \
	--handler $(DAILY_REPORT_GENERATOR_PACKAGE_NAME).handler \
	--runtime nodejs12.x \
	--timeout 30 \
	--memory-size 1024 \
	--role $(DAILY_REPORT_GENERATOR_ROLE) \
	--environment "Variables={$(ENV)}"

	aws lambda --profile $(AWS_PROFILE) \
	add-permission \
	--function-name $(DAILY_REPORT_GENERATOR_FUNCTION_NAME) \
	--principal s3.amazonaws.com \
	--statement-id s3invoke \
	--action "lambda:InvokeFunction" \
	--source-arn arn:aws:s3:::$(ARCHIVE_BUCKET) \
	--source-account $(AWS_ACCOUNT)

update-daily-report-generator: dist-daily-report-generator
	aws --profile $(AWS_PROFILE) \
	lambda update-function-code --function-name $(DAILY_REPORT_GENERATOR_FUNCTION_NAME) \
	--zip-file fileb://dist/$(DAILY_REPORT_GENERATOR_PACKAGE_NAME).zip

	aws --profile $(AWS_PROFILE) \
	lambda update-function-configuration \
	--function-name $(DAILY_REPORT_GENERATOR_FUNCTION_NAME) \
	--environment "Variables={$(ENV)}"

# ReportAggregator

dist-report-aggregator: test-report-aggregator
	npx webpack -c webpack.config.js --config-name $(REPORT_AGGREGATOR_PACKAGE_NAME)
	zip -j dist/$(REPORT_AGGREGATOR_PACKAGE_NAME).zip dist/$(REPORT_AGGREGATOR_PACKAGE_NAME).js

init-report-aggregator: dist-report-aggregator
	aws --profile $(AWS_PROFILE) \
	lambda create-function \
	--function-name $(REPORT_AGGREGATOR_FUNCTION_NAME) \
	--zip-file fileb://dist/$(REPORT_AGGREGATOR_PACKAGE_NAME).zip \
	--handler $(REPORT_AGGREGATOR_PACKAGE_NAME).handler \
	--runtime nodejs12.x \
	--timeout 30 \
	--memory-size 1024 \
	--role $(REPORT_AGGREGATOR_ROLE) \
	--environment "Variables={$(ENV)}"

	aws lambda --profile $(AWS_PROFILE) \
	add-permission \
	--function-name $(REPORT_AGGREGATOR_FUNCTION_NAME) \
	--principal s3.amazonaws.com \
	--statement-id s3invoke \
	--action "lambda:InvokeFunction" \
	--source-arn arn:aws:s3:::$(DAILY_REPORTS_BUCKET) \
	--source-account $(AWS_ACCOUNT)

update-report-aggregator: dist-report-aggregator
	aws --profile $(AWS_PROFILE) \
	lambda update-function-code --function-name $(REPORT_AGGREGATOR_FUNCTION_NAME) \
	--zip-file fileb://dist/$(REPORT_AGGREGATOR_PACKAGE_NAME).zip

	aws --profile $(AWS_PROFILE) \
	lambda update-function-configuration \
	--function-name $(REPORT_AGGREGATOR_FUNCTION_NAME) \
	--environment "Variables={$(ENV)}"
