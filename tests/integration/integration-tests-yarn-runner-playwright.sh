#!/bin/bash

set -o pipefail
set -o errexit

source functions.sh
RUNNER_NAME='playwright'
WORKING_DIR="runner-${RUNNER_NAME}"
RUNNER_DIR="../../../packages/runner-${RUNNER_NAME}"
NPM_PACKAGE_COMMONS=$(ls ../../dist/packages/uuv-runner-commons-*)
NPM_PACKAGE_A11Y=$(ls ../../dist/packages/uuv-a11y-*)
NPM_PACKAGE_PLAYWRIGHT=$(ls ../../dist/packages/uuv-playwright-*)
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
yarn init -y
cp -f "../package-playwright.json" "package.json"
A11Y_VERSION="../$NPM_PACKAGE_A11Y"
DICTIONARY_VERSION="../$NPM_PACKAGE_DICTIONARY"
sed -i "s|to-replace-a11y|${A11Y_VERSION}|" package.json
sed -i "s|to-replace-dictionary|${DICTIONARY_VERSION}|" package.json

log "I" "Installing npm dependencies"
cat package.json
yarn add -D "../$NPM_PACKAGE_DICTIONARY" "../$NPM_PACKAGE_COMMONS" "../$NPM_PACKAGE_PLAYWRIGHT"

log "I" "Copying test files and dependencies"
cp -R "${RUNNER_DIR}/e2e/" ./uuv
cp "../custom-step-definition.feature" ./uuv/e2e
rm ./uuv/e2e/ko.feature
mkdir -p ./uuv/playwright/fixtures
cp -R "${RUNNER_DIR}/playwright/fixtures/" ./uuv/playwright

log "I" "Replace baseUurl"
sed -i 's/http:\/\/localhost:4200/https:\/\/e2e-test-quest.github.io\/simple-webapp\//g' uuv/playwright.config.ts

log "I" "Running e2e test"
if ! yarn uuv e2e --generateHtmlReport --generateJunitReport --generateA11yReport; then
    log "E" "An error occured during e2e testing"
    exit 1
fi

log "I" "Ended"
