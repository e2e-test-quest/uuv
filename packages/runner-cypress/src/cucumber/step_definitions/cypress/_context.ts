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

import { DEFAULT_TIMEOUT, IContext } from "@uuv/runner-commons/runner/step-definitions";


export class Context implements IContext {
  public withinFocusedElement : Cypress.Chainable<JQuery<HTMLElement>> | undefined;
  public timeout : number | null = DEFAULT_TIMEOUT;
}
