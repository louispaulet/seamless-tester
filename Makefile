PORT ?= 5173

.PHONY: up kill test deploy deloy

node_modules: package.json package-lock.json
	npm install

up: node_modules
	npm run dev -- --host 0.0.0.0 --port $(PORT)

kill:
	@pids=$$(lsof -ti tcp:$(PORT)); \
	if [ -n "$$pids" ]; then \
		kill $$pids; \
	else \
		echo "No process listening on port $(PORT)"; \
	fi

test: node_modules
	npm test

deploy: node_modules
	npm run deploy

deloy: deploy
