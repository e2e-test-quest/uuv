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

import { Then, When, } from "@badeball/cypress-cucumber-preprocessor";
import "../../cypress/commands";
import {
    click,
    findWithRoleAndName,
    findWithRoleAndNameAndAttribute,
    findWithRoleAndNameAndContent,
    findWithRoleAndNameAndContentDisabled,
    findWithRoleAndNameAndContentEnabled,
    findWithRoleAndNameDisabled,
    findWithRoleAndNameEnabled,
    findWithRoleAndNameFocused,
    notFoundWithRoleAndName,
    withinRoleAndName
} from "./core-engine";
import { key } from "@uuv/runner-commons/wording/web";
import { pressKey } from "./_.common";

// Begin of General Section

/**
 * key.when.withinElement.roleAndName.description
 * */
When(`${key.when.withinElement.roleAndName}`, function(name: string) {
    withinRoleAndName("$roleId", name);
});

/**
 * key.then.element.withRoleAndName.description
 * */
Then(`${key.then.element.withRoleAndName}`, function(name: string) {
    findWithRoleAndName("$roleId", name);
});

/**
 * key.then.element.not.withRoleAndName.description
 * */
Then(
    `${key.then.element.not.withRoleAndName}`,
    function(name: string) {
        notFoundWithRoleAndName("$roleId", name);
    }
);

// End of General Section
// Begin of Click Section

/**
 * key.when.click.description
 * */
When(`${key.when.click}`, function(name: string) {
    click("$roleId", name);
});

// End of Click Section
// Begin of Type Section

/**
 * key.when.type.description
 * */
When(`${key.when.type}`, function(textToType: string, name: string) {
    cy.uuvFindByRole("$roleId", { name: name }).uuvFoundedElement().type(textToType);
});

/**
 * key.when.enter.description
 * */
When(`${key.when.enter}`, function(textToType: string, name: string) {
    cy.uuvFindByRole("$roleId", { name: name }).uuvFoundedElement().type(textToType);
});

// End of Type Section
// Begin of Content Section

/**
 * key.then.element.withRoleAndNameAndContent.description
 * */
Then(
    `${key.then.element.withRoleAndNameAndContent}`,
    function(name: string, expectedTextContent: string) {
        findWithRoleAndNameAndContent("$roleId", name, expectedTextContent);
    }
);

/**
 * key.then.element.withRoleAndNameAndContentDisabled.description
 * */
Then(
    `${key.then.element.withRoleAndNameAndContentDisabled}`,
    function(name: string, expectedTextContent: string) {
        findWithRoleAndNameAndContentDisabled("$roleId", name, expectedTextContent);
    }
);

/**
 * key.then.element.withRoleAndNameAndContentEnabled.description
 * */
Then(
    `${key.then.element.withRoleAndNameAndContentEnabled}`,
    function(name: string, expectedTextContent: string) {
        findWithRoleAndNameAndContentEnabled("$roleId", name, expectedTextContent);
    }
);

/**
 * key.then.element.withRoleAndNameDisabled.description
 * */
Then(
    `${key.then.element.withRoleAndNameDisabled}`,
    function(name: string) {
        findWithRoleAndNameDisabled("$roleId", name);
    }
);

/**
 * key.then.element.withRoleAndNameEnabled.description
 * */
Then(
    `${key.then.element.withRoleAndNameEnabled}`,
    function(name: string) {
        findWithRoleAndNameEnabled("$roleId", name);
    }
);

// End of Content Section

// Begin of Keyboard Section

/**
 * key.then.element.withRoleAndNameFocused.description
 * */
Then(
    `${key.then.element.withRoleAndNameFocused}`,
    function(name: string) {
        findWithRoleAndNameFocused("$roleId", name);
    }
);

/**
 * key.then.element.previousWithRoleAndNameFocused.description
 * */
Then(
    `${key.then.element.previousWithRoleAndNameFocused}`,
    function(name: string) {
        pressKey("{reverseTab}");
        findWithRoleAndNameFocused("$roleId", name);
    }
);

/**
 * key.then.element.nextWithRoleAndNameFocused.description
 * */
Then(
    `${key.then.element.nextWithRoleAndNameFocused}`,
    function(name: string) {
        pressKey("{tab}");
        findWithRoleAndNameFocused("$roleId", name);
    }
);

// End of Keyboard Section

// Begin of Checkable Section

/**
 * key.then.element.withRoleAndNameAndChecked.description
 * */
Then(
    `${key.then.element.withRoleAndNameAndChecked}`,
    function(name: string) {
        findWithRoleAndNameAndAttribute("$roleId", name, "checked", true);
    }
);

/**
 * key.then.element.withRoleAndNameAndUnchecked.description
 * */
Then(
    `${key.then.element.withRoleAndNameAndUnchecked}`,
    function(name: string) {
        findWithRoleAndNameAndAttribute("$roleId", name, "checked", false);
    }
);

// End of Checkable Section
