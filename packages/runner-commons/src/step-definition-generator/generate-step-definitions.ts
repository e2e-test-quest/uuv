/**
 * Software Name : UUV
 *
 * SPDX-License-Identifier: MIT
 *
 * This software is distributed under the MIT License,
 * see the "LICENSE" file for more details
 *
 * Authors: NJAKO MOLOM Louis Fredice & SERVICAL Stanley
 * Software description: Make test writing fast, understandable by any human
 * understanding English or French.
 */

import { BaseStepDefinition } from "./generate-base-step-definitions";
import { BasedRoleStepDefinition } from "./generate-based-role-step-definitions";
import { STEP_DEFINITION_FILE_NAME, TEST_RUNNER_ENUM } from "./common";


function generateStepDefinitionForRunner(baseDir: string, runner: TEST_RUNNER_ENUM, wordingFileRelativePath: string) {
 const runnerBaseStepDefinition: BaseStepDefinition = new BaseStepDefinition(
     baseDir,
     runner,
     STEP_DEFINITION_FILE_NAME.BASE,
     wordingFileRelativePath
 );
 runnerBaseStepDefinition.runGenerate();

 const runnerBasedRoleStepDefinition: BasedRoleStepDefinition = new BasedRoleStepDefinition(
     baseDir,
     runner,
     STEP_DEFINITION_FILE_NAME.BY_ROLE,
     wordingFileRelativePath
 );
 runnerBasedRoleStepDefinition.runGenerate();
}


export function generateStepDefinitionForWebRunner(baseDir: string, runner: TEST_RUNNER_ENUM) {
 generateStepDefinitionForRunner(baseDir, runner, "../assets/i18n/web");
}

export function generateStepDefinitionForMobileRunner(baseDir: string, runner: TEST_RUNNER_ENUM) {
 generateStepDefinitionForRunner(baseDir, runner, "../assets/i18n/mobile");
}
