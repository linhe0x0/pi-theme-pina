AGENT_THEMES_DIR ?= $(HOME)/.pi/agent/themes
THEME_FILES := $(wildcard themes/*.json)

.DEFAULT_GOAL := help
.PHONY: help install link unlink validate

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Copy themes into ~/.pi/agent/themes
	mkdir -p $(AGENT_THEMES_DIR)
	cp $(THEME_FILES) $(AGENT_THEMES_DIR)/
	@echo "Installed $(words $(THEME_FILES)) theme(s) to $(AGENT_THEMES_DIR)"

link: ## Symlink themes into ~/.pi/agent/themes (edit here, /reload in pi)
	mkdir -p $(AGENT_THEMES_DIR)
	@for f in $(THEME_FILES); do ln -sfn $$(pwd)/$$f $(AGENT_THEMES_DIR)/$${f##*/}; echo "linked $$f"; done

unlink: ## Remove installed or linked themes from ~/.pi/agent/themes
	@for f in $(notdir $(THEME_FILES)); do rm -f $(AGENT_THEMES_DIR)/$$f; echo "removed $$f"; done

dev: unlink ## Register this repo as a pi package (themes + editor extension, loaded live)
	pi install .
	@echo "Registered. Unregister with 'make undev'."

undev: ## Remove the package registration
	pi remove .

validate: ## Validate theme files against pi's theme schema
	node scripts/validate.mjs
