CURRENT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

test:
	npx ava

frontend:
	$(MAKE) -C $(CURRENT_DIR)/frontend dev

dist-frontend:
	$(MAKE) -C $(CURRENT_DIR)/frontend dist

update-archiver:
	$(MAKE) -C $(CURRENT_DIR)/backend update-archiver

update-daily-report-generator:
	$(MAKE) -C $(CURRENT_DIR)/backend update-daily-report-generator

update-report-aggregator:
	$(MAKE) -C $(CURRENT_DIR)/backend update-report-aggregator
