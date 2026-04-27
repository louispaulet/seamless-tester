PORT ?= 5173

.PHONY: up kill test deploy deloy

node_modules: package.json package-lock.json
	npm install

up: node_modules
	npm run dev -- --host 0.0.0.0 --port $(PORT)

kill:
	-lsof -ti tcp:$(PORT) | xargs kill

test: node_modules
	npm test

deploy: node_modules
	npm run deploy

deloy: deploy
