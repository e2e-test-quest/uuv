/**
 * Copyright UUV.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DataTable, Given, Then, When, } from "@badeball/cypress-cucumber-preprocessor";
import { Context } from "./_context";
import "../../../cypress/commands";
import { Method } from "cypress/types/net-stubbing";
import { key } from "@uuv/runner-commons";
import {
    assertTextContent,
    findWithRoleAndName,
    findWithRoleAndNameAndContent, findWithRoleAndNameAndContentDisable, findWithRoleAndNameAndContentEnable,
    notFoundWithRoleAndName,
    withinRoleAndName
} from "./core-engine";

When(`${key.when.visit}`, function(siteUrl: string) {
    if (siteUrl.match("^http:\\/\\/|https:\\/\\/")) {
        return cy.visit(`${siteUrl}`);
    }
    return cy.visit(`${Cypress.config().baseUrl}${siteUrl}`);
});

When(`${key.when.click}`, function() {
    cy.uuvCheckContextFocusedElement().then(context => {
        context.focusedElement!.click();
    });
});

When(`${key.when.type}`, function(textToType: string) {
    cy.uuvCheckContextFocusedElement().then((context) => {
        context.focusedElement!.focus();
        context.focusedElement!.type(textToType);
    });
});

////////////////////////////////////////////
// Context ACTIONS
////////////////////////////////////////////

Given(`${key.given.viewport.preset}`, function(viewportPreset: string) {
    return cy.viewport(viewportPreset as Cypress.ViewportPreset);
});

Given(
    `${key.given.viewport.withWidthAndHeight}`,
    function(width: number, height: number) {
        return cy.viewport(width, height);
    }
);

When(`${key.when.timeout}`, function(newTimeout: number) {
    return cy.uuvPatchContext({
        timeout: newTimeout,
    });
});

When(`${key.when.withinElement.roleAndName}`, function(role: string, name: string) {
    return withinRoleAndName(role, name);
});

When(`${key.when.withinElement.ariaLabel}`, function(expectedAriaLabel: string) {
    const foundedElement = cy.uuvFindByLabelText(expectedAriaLabel, {})
        .uuvFoundedElement()
        .should("exist");

    return cy.uuvPatchContext({
        focusedElement: foundedElement
    });
});

When(`${key.when.withinElement.testId}`, function(testId: string) {
    const foundedElement = cy.uuvFindByTestId(testId)
        .uuvFoundedElement()
        .should("exist");

    return cy.uuvPatchContext({
        focusedElement: foundedElement
    });
});

When(`${key.when.withinElement.selector}`, function(selector: string) {
    const foundedElement = cy.uuvGetContext().then(context => {
        const parentElement = context.focusedElement;
        if (parentElement) {
            console.log("parentElement: ", parentElement);
            return parentElement.should("exist").within(() => {
                cy.get(selector).as("foundedChildElement");
            });
        }
        cy.wrap(null).as("foundedChildElement");
        return cy.get(selector);
    }).uuvFoundedElement()
        .should("exist");

    return cy.uuvPatchContext({
        focusedElement: foundedElement
    });
});

When(`${key.when.resetContext}`, function() {
    return cy.wrap(new Context()).as("context");
});

When(
    `${key.when.mock.withBody}`,
    function(verb: Method, uri: string, name: string, body: any) {
        return cy
            .intercept(verb, uri, {
                body: body,
            })
            .as(name);
    }
);

When(
    `${key.when.mock.withStatusCode}`,
    function(verb: Method, uri: string, name: string, statusCode: number) {
        return cy
            .intercept(verb, uri, {
                statusCode: statusCode,
            })
            .as(name);
    }
);

When(
    `${key.when.mock.withFixture}`,
    function(verb: Method, uri: string, name: string, fixture: any) {
        return cy
            .intercept(verb, uri, {
                fixture: fixture,
            })
            .as(name);
    }
);

////////////////////////////////////////////
// INTERCEPTION
////////////////////////////////////////////
When(
    `${key.when.headers.forUriAndMethod}`,
    function(url: string, method: string, headersToSet: DataTable) {
        cy.intercept(method as Method, url, (req) => {
            req.headers = {
                ...req.headers,
                ...headersToSet.rowsHash(),
            };
            req.continue();
        });
    }
);

When(`${key.when.headers.forUri}`, function(url: string, headersToSet: DataTable) {
    cy.intercept(url, (req) => {
        req.headers = {
            ...req.headers,
            ...headersToSet.rowsHash(),
        };
        req.continue();
    });
});

////////////////////////////////////////////
// VALIDATION
////////////////////////////////////////////

/**
 * Look for an element based on its content
 */
Then(`${key.then.element.withContent}`, async function(textContent: string) {
    cy.uuvFindByText(textContent, {})
        .uuvFoundedElement()
        .should("exist");
});

Then(`${key.then.element.not.withContent}`, async function(textContent: string) {
    cy.uuvFindByText(textContent, {})
        .should("not.exist");
});

Then(`${key.then.element.withTestId}`, async function(testId: string) {
    cy.uuvFindByTestId(testId)
        .uuvFoundedElement()
        .should("exist");
});

Then(`${key.then.element.not.withTestId}`, async function(testId: string) {
    cy.uuvFindByTestId(testId)
        .should("not.exist");
});

Then(`${key.then.element.withRoleAndName}`, async function(role: string, name: string) {
    findWithRoleAndName(role, name);
});

Then(
    `${key.then.element.not.withRoleAndName}`,
    async function(role: string, name: string) {
        notFoundWithRoleAndName(role, name);
    }
);

Then(
    `${key.then.element.withRoleAndNameAndContent}`,
    async function(expectedRole: string, name: string, expectedTextContent: string) {
        findWithRoleAndNameAndContent(expectedRole, name, expectedTextContent);
    }
);

Then(
    `${key.then.element.withRoleAndNameAndContentDisabled}`,
    async function(expectedRole: string, name: string, expectedTextContent: string) {
        findWithRoleAndNameAndContentDisable(expectedRole, name, expectedTextContent);
    }
);

Then(
    `${key.then.element.withRoleAndNameAndContentEnabled}`,
    async function(expectedRole: string, name: string, expectedTextContent: string) {
        findWithRoleAndNameAndContentEnable(expectedRole, name, expectedTextContent);
    }
);

Then(`${key.then.element.withAriaLabel}`, async function(expectedAriaLabel: string) {
    cy.uuvFindByLabelText(expectedAriaLabel, {})
        .uuvFoundedElement()
        .should("exist");
});

Then(`${key.then.element.not.withAriaLabel}`, async function(expectedAriaLabel: string) {
   cy.uuvFindByLabelText(expectedAriaLabel, {})
      .should("not.exist");
});

Then(
    `${key.then.element.withAriaLabelAndContent}`,
    async function(expectedAriaLabel: string, expectedTextContent: string) {
        cy.uuvFindByLabelText(expectedAriaLabel, {})
            .uuvFoundedElement()
            .should("exist")
            .then((response) => {
                assert.equal(response.length, 1);
                assertTextContent(response, expectedTextContent);
            });
    }
);

Then(`${key.then.wait.mock}`, async function(name: string) {
    cy.wait([`@${name}`]);
});

Then(`${key.then.wait.milliSeconds}`, async function(ms: number) {
     cy.wait(ms);
});

Then(
    `${key.then.list.withNameAndContent}`,
    async function(expectedListName: string, expectedElementsOfList: DataTable) {
        cy.uuvFindByRole("list", { name: expectedListName })
            .uuvFoundedElement()
            .should("exist")
            .within(() => {
                return cy.uuvFindAllByRole("listitem", {}).then((listitem) => {
                    const foundedElement: any[] = [];
                    for (let i = 0; i < listitem.length; i++) {
                        foundedElement.push([listitem[i].textContent]);
                    }
                    assert.equal(listitem.length, expectedElementsOfList.raw().length);
                    assert.deepEqual(
                        foundedElement,
                        expectedElementsOfList.raw(),
                        `expected [${expectedElementsOfList.raw()}] to be [${foundedElement}]`
                    );
                });
            });
    }
);

Then(
    `${key.then.attributes.withValues}`,
    async function(expectedAttributeList: DataTable) {
        cy.uuvCheckContextFocusedElement().then((context) => {
            const elementToSelect = context.focusedElement!;
            for (const currentIndex in expectedAttributeList.raw()) {
                const attributeName = expectedAttributeList.raw()[currentIndex][0];
                const attributeValue = expectedAttributeList.raw()[currentIndex][1];
                elementToSelect.then((response) => {
                    assert.equal(response[0].getAttribute(attributeName), attributeValue);
                });
            }
        });
    }
);

Then(`${key.then.element.withSelector}`, async function(selector: string) {
    cy.get(selector).should("exist");
});


Then(
    `${key.then.a11y.check}`,
    async function() {
        cy.injectAxe();
        cy.checkA11y();
});
