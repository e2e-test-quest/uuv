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

import { key } from "@uuv/runner-commons/wording/web";
import {
  click,
  COOKIE_NAME,
  deleteCookieByName,
  findWithRoleAndName,
  findWithRoleAndNameAndChecked,
  findWithRoleAndNameAndContent,
  findWithRoleAndNameAndContentDisable,
  findWithRoleAndNameAndContentEnable,
  findWithRoleAndNameAndUnchecked,
  findWithRoleAndNameFocused,
  getPageOrElement,
  getTimeout,
  notFoundWithRoleAndName,
  withinRoleAndName
} from "./core-engine";
import { Then, When } from "../../preprocessor/run/world";
import { expect } from "@playwright/test";

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
  await getPageOrElement(this).then(async (element) => {
    const byRole = await element.getByRole("$roleId", { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(this) });
    await byRole.type(textToType);
    await deleteCookieByName(this, COOKIE_NAME.SELECTED_ELEMENT);
  });
});

/**
 * key.when.enter.description
 * */
When(`${key.when.enter}`, async function(textToType: string, name: string) {
    await getPageOrElement(this).then(async (element) => {
        const byRole = await element.getByRole("$roleId", { name: name, includeHidden: true, exact: true });
        await expect(byRole).toHaveCount(1);
        await byRole.type(textToType);
        await deleteCookieByName(this, COOKIE_NAME.SELECTED_ELEMENT);
    });
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
   await findWithRoleAndNameAndContentDisable(this, "$roleId", name, expectedTextContent);
 }
);

/**
 * key.then.element.withRoleAndNameAndContentEnabled.description
 * */
Then(
 `${key.then.element.withRoleAndNameAndContentEnabled}`,
 async function(name: string, expectedTextContent: string) {
   await findWithRoleAndNameAndContentEnable(this, "$roleId", name, expectedTextContent);
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
