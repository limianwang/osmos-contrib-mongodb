TESTS = $(shell find tests -name 'test_*.js')
TIMEOUT = 2000

test:
	node ./node_modules/.bin/_mocha --use-strict -t $(TIMEOUT) -R spec -u bdd $(TESTS)

test-cov:
	node ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -t $(TIMEOUT) $(TESTS)

.PHONY: test test-cov
