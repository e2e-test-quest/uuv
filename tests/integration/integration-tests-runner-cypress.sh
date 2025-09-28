#!/bin/bash

set -o pipefail
set -o errexit

source functions.sh
RUNNER_NAME='cypress'
WORKING_DIR="runner-${RUNNER_NAME}"
RUNNER_DIR="../../../packages/runner-${RUNNER_NAME}"
NPM_PACKAGE_COMMONS=$(ls ../../dist/packages/uuv-runner-commons-*)
NPM_PACKAGE_A11Y=$(ls ../../dist/packages/uuv-a11y-*)
NPM_PACKAGE_CYPRESS=$(ls ../../dist/packages/uuv-cypress-*)
NPM_PACKAGE_DICTIONARY=$(ls ../../dist/packages/uuv-dictionary-*)

log "I" "Cleaning existing directory"
if [ -d "$WORKING_DIR" ]; then rm -Rf $WORKING_DIR; fi

log "I" "Creating directory"
mkdir -p "$WORKING_DIR"
cp "tsconfig.${RUNNER_NAME}.json" "$WORKING_DIR/tsconfig.json"
cp "tsconfig.${RUNNER_NAME}.e2e.json" "$WORKING_DIR/tsconfig.e2e.json"
mkdir -p "$WORKING_DIR/uuv/cucumber/step_definitions"
cp "my-custom-step-definitions.${RUNNER_NAME}.ts" "$WORKING_DIR/uuv/cucumber/step_definitions/my-custom-step-definitions.ts"
cd "$WORKING_DIR"

log "I" "Creating new npm project"
npm init -y
cp -f "../package-cypress.json" "package.json"
A11Y_VERSION="../$NPM_PACKAGE_A11Y"
sed -i "s|to-replace|${A11Y_VERSION}|" package.json

log "I" "Installing npm dependencies"
npm install -D "../$NPM_PACKAGE_DICTIONARY" "../$NPM_PACKAGE_COMMONS" "../$NPM_PACKAGE_CYPRESS" ts-loader

log "I" "Copying test files and dependencies"
cp -R "${RUNNER_DIR}/e2e/" ./uuv
cp "../custom-step-definition.feature" ./uuv/e2e
rm ./uuv/e2e/ko.feature
mkdir -p ./uuv/cypress/fixtures
cp -R "${RUNNER_DIR}/cypress/fixtures/" ./uuv/cypress

log "I" "Replace baseUurl"
sed -i 's/http:\/\/localhost:4200/https:\/\/e2e-test-quest.github.io\/simple-webapp\//g' uuv/cypress.config.ts

log "I" "Running e2e test"
if ! npx uuv e2e --generateHtmlReport --generateJunitReport --generateA11yReport; then
    log "E" "An error occurred during e2e testing"
    exit 1
fi

log "I" "Ended"
