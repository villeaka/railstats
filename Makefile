CURRENT_DIR:=$(shell pwd)

test:
	npx ava

test-backend:
	$(MAKE) -C $(CURRENT_DIR)/backend test

dev-frontend:
	$(MAKE) -C $(CURRENT_DIR)/frontend dev

dist-frontend:
	$(MAKE) -C $(CURRENT_DIR)/frontend dist

update-archiver:
	$(MAKE) -C $(CURRENT_DIR)/backend update-archiver

update-daily-report-generator:
	$(MAKE) -C $(CURRENT_DIR)/backend update-daily-report-generator

update-report-aggregator:
	$(MAKE) -C $(CURRENT_DIR)/backend update-report-aggregator
