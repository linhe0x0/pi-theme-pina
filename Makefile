.DEFAULT_GOAL := help
.PHONY: help build validate install uninstall typecheck check

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

build: ## Sync vars in themes/*.json with tokens.json
	node scripts/build.mjs

validate: ## Validate themes/*.json: schema, core consistency, vars freshness
	node scripts/validate.mjs

install: build ## Register this repo as a pi package (themes + extensions, loaded live)
	pi install .
	@echo "Registered. Unregister with 'make undev'."

uninstall: ## Remove the package registration
	pi remove .

typecheck: ## Typecheck extension sources
	npx tsc --noEmit

check: validate typecheck ## Run all checks
