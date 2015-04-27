TESTS = $(shell find tests -name 'test_*.js')
TIMEOUT = 2000

BIN = node

install:
	@npm install

clean:
	@rm -rf node_modules npm-debug.log

test:
	@npm install mongodb
	@$(BIN) ./node_modules/.bin/_mocha --use-strict -t $(TIMEOUT) -R spec -u bdd $(TESTS)
	@npm uninstall mongodb

test-cov:
	@$(BIN) ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -t $(TIMEOUT) $(TESTS)

.PHONY: test test-cov clean install
