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

import {
    A11yChecker,
    A11yReferenceEnum,
    NodeToCheckManually,
    NonCompliantNode,
    UuvA11yResultUsecase,
    AccessibilityIssue,
    IssueType,
    A11yResult
} from "@uuv/a11y";
import { Observable } from "rxjs";
import ObjectLike = Cypress.ObjectLike;
import $ from "jquery";
import {
    getA11yResultFilePath,
    shouldGenerateA11yReport,
    UuvA11yOptions
} from "./_.common";
import _ from "lodash";

export const injectUvvA11y = () => {

    const fileName =
        typeof require?.resolve === "function"
            ? require.resolve("@uuv/a11y/bundle")
            : "node_modules/@uuv/a11y/bundle/uuv-a11y.bundle.js";
    cy.readFile<string>(fileName).then((source) =>
        cy.window({ log: false }).then((window) => {
            window.eval(source);
        })
    );
};

export const checkUvvA11y = (options: UuvA11yOptions) => {
    cy.window({ log: false })
        .then((win: any) => {
            return new Cypress.Promise(async (resolve, reject) => {
                try {
                    const url = win.location.href;
                    const a11yChecker = getA11yCheckerForReference(win, options, url);
                    assert.isDefined(a11yChecker, "A11y reference not found");
                    const reportOfUsecase = await(a11yChecker?.validate(
                        Cypress.currentTest.title,
                        "empty Script",
                        {
                            file: Cypress.spec.relative,
                            column: 0,
                            line: 0
                        }
                    ) as Observable<UuvA11yResultUsecase>).toPromise();
                    if (shouldGenerateA11yReport() && reportOfUsecase) {
                        storeA11yResult(reportOfUsecase).then(() => {
                            logAllA11yRuleResult(options.reference, reportOfUsecase);
                            assertWithExpectedResult(options, reportOfUsecase);
                        });
                        resolve();
                    } else {
                        logAllA11yRuleResult(options.reference, reportOfUsecase);
                        assertWithExpectedResult(options, reportOfUsecase);
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
};

export const showUvvA11yReport = (reference: A11yReferenceEnum) => {
    const a11yReport = readA11yReport();
    const log = buildCypressLog(
        "a11y synthesis",
        reference,
        {
            reference: reference,
            nodes: a11yReport
        });
    log.finish();
};

function getA11yCheckerForReference(win: any, options: UuvA11yOptions, url: string): A11yChecker | undefined {
    let checker;
    console.debug("reference", options.reference);
    switch (options.reference) {
        case A11yReferenceEnum.WCAG_WEB:
            checker = new win.uuvA11y.WcagChecker(url, options.runnerOptions);
            break;
        case A11yReferenceEnum.WCAG_ANDROID:
            break;
        case A11yReferenceEnum.WCAG_IOS:
            break;
        case A11yReferenceEnum.RGAA:
        default:
            checker = new win.uuvA11y.RgaaChecker(url);
            break;
    }
    return checker;
}

function assertWithExpectedResult(options: UuvA11yOptions, reportOfUsecase?: UuvA11yResultUsecase) {
    const validationFailedMessage = "A11y validation failed";
    if (options.expectedResult) {
        const summary = (reportOfUsecase?.result.rawResult as A11yResult).summary();
        if (!options.expectedResult.isContainsMode) {
            assert.deepEqual(summary, options.expectedResult.value, validationFailedMessage);
        } else {
            cy.wrap(summary)
                .should("containSubset", options.expectedResult.value);
        }
    } else {
        assert.equal(reportOfUsecase?.result.issues.filter(issue => issue.type === IssueType.Error).length, 0, validationFailedMessage);
        assert.equal(reportOfUsecase?.result.issues.filter(issue => issue.type === IssueType.Warning).length, 0, validationFailedMessage);
    }
}

function logAllA11yRuleResult(reference: A11yReferenceEnum, reportOfUsecase?: UuvA11yResultUsecase) {
    reportOfUsecase?.result.issues.forEach(a11yIssue => {
        // logValidatingA11yRule(result.reference, ruleResult);
        logA11yRuleResult(reference, a11yIssue);
    });
}

function logA11yRuleResult(reference: A11yReferenceEnum, a11yIssue: AccessibilityIssue) {
    switch (a11yIssue.type) {
        case "error":
        case "warning":
            logNonCompliantNode(reference, a11yIssue);
            break;
        // case A11yResultStatus.MANUAL:
        //     logNodeToCheckManually(reference, ruleResult);
        //     break;
        // case A11yResultStatus.UNKNOWN:
        //     break;
        // case A11yResultStatus.SUCCESS:
        //     break;
    }
}

function buildCypressLog(name: string, message: string, consoleLog?: ObjectLike) {
    return Cypress.log({
        name: name,
        displayName: name,
        message: message,
        consoleProps() {
            return consoleLog ? consoleLog : {};
        }
    });
}

function logNonCompliantNode(reference: A11yReferenceEnum, a11yIssue: AccessibilityIssue) {
    const errorNode = a11yIssue.htmlElement;
    const log = buildCypressLog(
        `${reference.toString()} error !`,
        `criteria ${a11yIssue.code} with message : ${a11yIssue.message}`,
        getConsoleDetails(a11yIssue, errorNode as any)
    );
    if (errorNode) {
        log.set({ $el: $(errorNode as any) }).snapshot();
    }
    log.error(new Error(`Validation ${a11yIssue.type} on node: ${errorNode}`));
}

// function logNodeToCheckManually(reference: A11yReferenceEnum, ruleResult: A11yRuleResult) {
//     const nodesToCheckManually = ruleResult.getNodesToCheckManually();
//     const log = buildCypressLog(
//         `${reference.toString()} to validate manually !`,
//         `criteria ${ruleResult.rule.criterion} on ${nodesToCheckManually.length} nodes`,
//         getConsoleDetails(reference, ruleResult, nodesToCheckManually)
//     );
//     nodesToCheckManually.forEach(nodeToCheck => log.set({ $el: $(nodeToCheck.node.domNode) }).snapshot());
//     log.finish();
// }

function getConsoleDetails(a11yIssue: AccessibilityIssue, nodes: (NonCompliantNode | NodeToCheckManually)[]) {
    return {
        // Id: a11yIssue.runnerExtras.help rule.id,
        // WCAG: a11yIssue.code,
        // targetUrl: ruleResult.url,
        criteria: a11yIssue.code,
        // "Element type": ruleResult.rule.elementType,
        help: `${a11yIssue.runnerExtras.help}, ${a11yIssue.runnerExtras.helpUrl}`,
        runnerExtra: a11yIssue.runnerExtras,
        nodes: nodes
    };
}

function storeA11yResult(reportOfUsecase: UuvA11yResultUsecase): Cypress.Chainable<any> {
    const reportOfUsecaseToSore = _.cloneDeep(reportOfUsecase);
    reportOfUsecaseToSore.result.issues.forEach(issue => delete issue.htmlElement);

    const filePath = getA11yResultFilePath();
    return cy.readFile(filePath).then((report: any) => {
        report.app.usecases.push(reportOfUsecaseToSore);
        writeA11yReport(report);
    });

}

function readA11yReport(): Cypress.Chainable<any> {
    const filePath = getA11yResultFilePath();
    return cy.readFile(filePath);
}

function writeA11yReport(data: any) {
    const filePath = getA11yResultFilePath();
    return cy.writeFile(filePath, data, { flag: "w" });
}
