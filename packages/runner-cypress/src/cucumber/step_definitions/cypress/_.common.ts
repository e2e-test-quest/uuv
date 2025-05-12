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

import { ByRoleOptions } from "@testing-library/cypress";
import { Context } from "./_context";
import Chainable = Cypress.Chainable;
import { KEY_PRESS } from "@uuv/runner-commons/step-definition-generator";
import { A11yReferenceEnum } from "@uuv/a11y";

const contextAlias = "context";
const foundedChildElementAlias = "foundedChildElement";

export const shouldGenerateA11yReport = (): boolean => {
    const generateA11yReport = Cypress.env("uuvOptions")?.report.a11y.enabled;
    return generateA11yReport === true;
};

export const getA11yResultFilePath = (): string => {
    return Cypress.env("uuvOptions").report.a11y.relativePath;
};

export const uuvGetContext = (): Chainable<Context> => {
    return cy.get<Context>(`@${contextAlias}`);
};

export function uuvCheckContextWithinFocusedElement(dontThrowError = false): Cypress.Chainable<Context> {
    return cy.get<Context>(`@${contextAlias}`)
        .then(context => {
            if (!context.withinFocusedElement && !dontThrowError) {
                throw new Error("No element currently selected");
            }
            return context;
        });
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function uuvPatchContext(partOfContext: any): Cypress.Chainable<Context> {
    return cy.get<Context>(`@${contextAlias}`).then(context => {
        cy.wrap({
            ...context,
            ...partOfContext
        }).as(contextAlias);
    });
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
function addContextOptions(context: Context, roleOptions: any): any {
    const retour = {
        timeout: context.timeout
    };

    return Object.assign(roleOptions, retour);
}

/* eslint-disable  @typescript-eslint/ban-types */
function abstractFindBy(callBackFunction: Function, inputToSearch: any, inputOptions: any) : Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.uuvGetContext().then(context => {
        // console.log(contextAlias, context);
        const parentElement = context.withinFocusedElement;
        const options = addContextOptions(context, inputOptions);

        if (parentElement) {
            // console.log("parentElement: ", parentElement);
            return parentElement.should("exist").within(() => {
                callBackFunction(inputToSearch, options).as(foundedChildElementAlias);
            });
        }

        cy.wrap(null).as(foundedChildElementAlias);
        return callBackFunction(inputToSearch, options);
    });
}

export function uuvFindAllByRole(role: string, roleOptions: ByRoleOptions) : Cypress.Chainable<JQuery<HTMLElement>> {
    return abstractFindBy(
        cy.findAllByRole,
        role,
        roleOptions
    );
}

export function uuvFindByRole(role: string, roleOptions: ByRoleOptions) : Cypress.Chainable<JQuery<HTMLElement>> {
    return abstractFindBy(
        cy.findByRole,
        role,
        roleOptions
    );
}

export function uuvFindByLabelText(labelTextToSearch: string, roleOptions: ByRoleOptions) : Cypress.Chainable<JQuery<HTMLElement>> {
    return abstractFindBy(
        cy.findByLabelText,
        labelTextToSearch,
        roleOptions
    );
}

export function uuvFindByText(textToSearch: string, roleOptions: ByRoleOptions) : Cypress.Chainable<JQuery<HTMLElement>> {
    return abstractFindBy(
        cy.findByText,
        (content: any, element: any) => {
            const hasText = (elem: any) => elem.textContent === textToSearch;
            const elementHasText = hasText(element);
            const childrenDontHaveText = Array.from(element?.children || []).every(child => !hasText(child));
            return elementHasText && childrenDontHaveText;
        },
        roleOptions
    );
}

export function uuvFindByTestId(testId: string) : Cypress.Chainable<JQuery<HTMLElement>> {
    return abstractFindBy(
        cy.findByTestId,
        testId,
        {}
    );
}

export function uuvFoundedElement(subject) : Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`@${foundedChildElementAlias}`)
        .then((response: any) => {
            return response !== "empty" && response !== null ? response.foundedChildElement : subject;
        });
}

export function pressKey(key: string) {
    switch (key) {
        case KEY_PRESS.TAB:
            cy.realPress("Tab");
            break;
        case KEY_PRESS.REVERSE_TAB:
            cy.realPress(["ShiftLeft", "Tab"]);
            break;
        case KEY_PRESS.UP:
            cy.realPress("ArrowUp");
            break;
        case KEY_PRESS.DOWN:
            cy.realPress("ArrowDown");
            break;
        case KEY_PRESS.LEFT:
            cy.realPress("ArrowLeft");
            break;
        case KEY_PRESS.RIGHT:
            cy.realPress("ArrowRight");
            break;
        default:
            console.error("the command" + key + " is unrecognized.");
            break;
    }
}

export type UuvA11yOptions = {
    reference: A11yReferenceEnum;
    runnerOptions?: any;
    expectedResult?: UuvA11yExpectedResult
}

export type UuvA11yExpectedResult = {
    value: any;
    isContainsMode?: boolean;
}
