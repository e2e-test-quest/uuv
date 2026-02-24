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

import { key } from "@uuv/dictionary";
import {
    click,
    COOKIE_NAME,
    deleteCookieByName,
    findWithRoleAndName,
    findWithRoleAndNameAndChecked,
    findWithRoleAndNameAndContent,
    findWithRoleAndNameAndContentDisabled,
    findWithRoleAndNameAndContentEnabled,
    findWithRoleAndNameAndUnchecked,
    findWithRoleAndNameDisabled,
    findWithRoleAndNameEnabled,
    findWithRoleAndNameFocused,
    notFoundWithRoleAndName,
    withinRoleAndName,
    type,
    findWithRoleAndNameAndValue
} from "./core-engine";
import { Then, When } from "../../preprocessor/run/world";

// Begin of General Section

/**
 * key.when.withinElement.roleAndName.description
 * */
When(`${key.when.withinElement.roleAndName}`, async function(name: string) {
  return await withinRoleAndName(this, "$roleId", name);
});

/**
 * key.then.element.withRoleAndName.description
 * */
Then(`${key.then.element.withRoleAndName}`, async function(name: string) {
  await findWithRoleAndName(this, "$roleId", name);
});

/**
 * key.then.element.not.withRoleAndName.description
 * */
Then(
 `${key.then.element.not.withRoleAndName}`,
 async function(name: string) {
   await notFoundWithRoleAndName(this, "$roleId", name);
 }
);

// End of General Section
// Begin of Click Section

/**
 * key.when.click.description
 * */
When(`${key.when.click}`, async function(name: string) {
    await click(this, "$roleId", name);
});


// End of Click Section
// Begin of Type Section

/**
 * key.when.type.description
 * */
When(`${key.when.type}`, async function(textToType: string, name: string) {
  await type(this, "$roleId", name, textToType);
});

/**
 * key.when.enter.description
 * */
When(`${key.when.enter}`, async function(textToType: string, name: string) {
    await type(this, "$roleId", name, textToType);
});

/**
 * key.then.element.withRoleAndNameAndValue
 * */
When(`${key.then.element.withRoleAndNameAndValue}`, async function(name: string, expectedValue: string) {
    await findWithRoleAndNameAndValue(this, "$roleId", name, expectedValue);
    await deleteCookieByName(this, COOKIE_NAME.SELECTED_ELEMENT);
});

// End of Type Section
// Begin of Content Section

/**
 * key.then.element.withRoleAndNameAndContent.description
 * */
Then(
 `${key.then.element.withRoleAndNameAndContent}`,
 async function(name: string, expectedTextContent: string) {
   await findWithRoleAndNameAndContent(this, "$roleId", name, expectedTextContent);
 }
);

/**
 * key.then.element.withRoleAndNameAndContentDisabled.description
 * */
Then(
 `${key.then.element.withRoleAndNameAndContentDisabled}`,
 async function(name: string, expectedTextContent: string) {
   await findWithRoleAndNameAndContentDisabled(this, "$roleId", name, expectedTextContent);
 }
);

/**
 * key.then.element.withRoleAndNameDisabled.description
 * */
Then(
    `${key.then.element.withRoleAndNameDisabled}`,
    async function(name: string) {
        await findWithRoleAndNameDisabled(this, "$roleId", name);
    }
);

/**
 * key.then.element.withRoleAndNameAndContentEnabled.description
 * */
Then(
 `${key.then.element.withRoleAndNameAndContentEnabled}`,
 async function(name: string, expectedTextContent: string) {
   await findWithRoleAndNameAndContentEnabled(this, "$roleId", name, expectedTextContent);
 }
);

/**
 * key.then.element.withRoleAndNameEnabled.description
 * */
Then(
    `${key.then.element.withRoleAndNameEnabled}`,
    async function(name: string) {
        await findWithRoleAndNameEnabled(this, "$roleId", name);
    }
);

// End of Content Section

// Begin of Keyboard Section

/**
 * key.then.element.withRoleAndNameFocused.description
 * */
Then(
 `${key.then.element.withRoleAndNameFocused}`,
 async function(name: string) {
   await findWithRoleAndNameFocused(this, "$roleId", name);
 }
);

/**
 * key.then.element.previousWithRoleAndNameFocused.description
 * */
Then(
 `${key.then.element.previousWithRoleAndNameFocused}`,
 async function(name: string) {
   await this.page.keyboard.press("ShiftLeft+Tab");
   await findWithRoleAndNameFocused(this, "$roleId", name);
 }
);

/**
 * key.then.element.nextWithRoleAndNameFocused.description
 * */
Then(
 `${key.then.element.nextWithRoleAndNameFocused}`,
 async function(name: string) {
   await this.page.keyboard.press("Tab");
   await findWithRoleAndNameFocused(this, "$roleId", name);
 }
);
// End of Keyboard Section

// Begin of Checkable Section

/**
 * key.then.element.withRoleAndNameAndChecked.description
 * */
Then(
  `${key.then.element.withRoleAndNameAndChecked}`,
  async function(name: string) {
    await findWithRoleAndNameAndChecked(this, "$roleId", name);
  }
);

/**
* key.then.element.withRoleAndNameAndUnchecked.description
* */
Then(
  `${key.then.element.withRoleAndNameAndUnchecked}`,
  async function(name: string) {
    await findWithRoleAndNameAndUnchecked(this, "$roleId", name);
  }
);

// End of Checkable Section
