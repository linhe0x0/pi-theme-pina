.DEFAULT_GOAL := help
.PHONY: help dev undev validate typecheck check

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

dev: ## Register this repo as a pi package (themes + extensions, loaded live)
	pi install .
	@echo "Registered. Unregister with 'make undev'."

undev: ## Remove the package registration
	pi remove .

validate: ## Validate theme files against pi's theme schema
	node scripts/validate.mjs

typecheck: ## Typecheck extension sources
	npx tsc --noEmit

check: validate typecheck ## Run all checks
