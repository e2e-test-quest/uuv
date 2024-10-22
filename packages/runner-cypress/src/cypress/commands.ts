// / <reference types="cypress" />
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

import "@testing-library/cypress/add-commands";
import "cypress-axe";
import { ByRoleOptions } from "@testing-library/cypress";
import {
  UuvA11yOptions,
  uuvCheckContextWithinFocusedElement,
  uuvFindAllByRole,
  uuvFindByLabelText,
  uuvFindByRole,
  uuvFindByTestId,
  uuvFindByText,
  uuvFoundedElement,
  uuvGetContext,
  uuvPatchContext
} from "../cucumber/step_definitions/cypress/_.common";
import { Context } from "../cucumber/step_definitions/cypress/_context";
import "cypress-real-events";
import {
  injectUvvA11y,
  checkUvvA11y,
  showUvvA11yReport
} from "../cucumber/step_definitions/cypress/a11y-engine";
import { A11yReferenceEnum, A11yResult } from "@uuv/a11y";

declare global {
  namespace Cypress {
    interface Chainable {
      uuvGetContext(contextName?: string): Cypress.Chainable<Context>;

      uuvCheckContextWithinFocusedElement(dontThrowError?: boolean): Cypress.Chainable<Context>;

      uuvCheckContextKeyboardFocusedElement(): Cypress.Chainable<Context>;

      uuvPatchContext(partOfContext: any, contextName?: string): Chainable<Context>;

      uuvFindByText(textToSearch: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>;

      uuvFindByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>>;

      uuvFindByRole(role: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>;

      uuvFindByLabelText(labelTextToSearch: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>;

      uuvFindAllByRole(role: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>;

      uuvFoundedElement(): Cypress.Chainable<JQuery<HTMLElement>>;

      injectUvvA11y(): Cypress.Chainable<void>;

      checkUvvA11y(options: UuvA11yOptions): Cypress.Chainable<A11yResult>;

      showUvvA11yReport(reference: A11yReferenceEnum): Cypress.Chainable<A11yResult[]>;
    }
  }
}

Cypress.Commands.add("uuvGetContext", uuvGetContext);
Cypress.Commands.add("uuvCheckContextWithinFocusedElement", uuvCheckContextWithinFocusedElement);
Cypress.Commands.add("uuvPatchContext", uuvPatchContext);
Cypress.Commands.add("uuvFindByText", uuvFindByText);
Cypress.Commands.add("uuvFindByTestId", uuvFindByTestId);
Cypress.Commands.add("uuvFindByRole", uuvFindByRole);
Cypress.Commands.add("uuvFindByLabelText", uuvFindByLabelText);
Cypress.Commands.add("uuvFindAllByRole", uuvFindAllByRole);
Cypress.Commands.add("uuvFoundedElement", { prevSubject: true }, uuvFoundedElement);
Cypress.Commands.add("injectUvvA11y", injectUvvA11y);
Cypress.Commands.add("checkUvvA11y", checkUvvA11y);
Cypress.Commands.add("showUvvA11yReport", showUvvA11yReport);

const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
