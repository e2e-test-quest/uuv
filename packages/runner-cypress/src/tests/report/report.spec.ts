import { JunitReport, JunitReportHelper } from "@uuv/runner-commons/test";
import path from "path";
import { expect } from "@jest/globals";
import { UuvA11yResult } from "@uuv/a11y";
import fs from "fs";

describe("Runner Cypress JunitReport", () => {
    let report: JunitReport;

    beforeAll(async () => {
        report = await JunitReportHelper.readReport(path.join(__dirname, "../../../reports/e2e/junit-report.xml")) as JunitReport;
    });

    test("Should have good results", () => {
        expect(report.testsuites.tests).toEqual("170");
        expect(report.testsuites.failures).toEqual("13");
        expect(report.testsuites.errors).toBeUndefined();
        expect(report.testsuites.skipped).toBeUndefined();
    });

    test("Should fail for test : Ko Homepage - Bad title", () => {
        const testCase = JunitReportHelper.getTestCase(report, "Ko", "Ko Homepage - Bad title");
        expect(testCase?.failure._).toContain("Timed out retrying after 6000ms: Unable to find an accessible element with the role \"heading\" and name \"Welcome to Weather App - ko\"");
    });

    test("Should fail for test : Ko TownResearch - Bad textbox name", () => {
        const testCase = JunitReportHelper.getTestCase(report, "Ko", "Ko TownResearch - Bad textbox name");
        expect(testCase?.failure._).toContain("Timed out retrying after 6000ms: Unable to find an accessible element with the role \"textbox\" and name \"Search for a town3\"");
    });

    test("Should fail for test : Ko click failed with custom timeout", () => {
        const testCase = JunitReportHelper.getTestCase(report, "Ko", "Ko click failed with custom timeout");
        expect(testCase?.failure._).toContain("Timed out retrying after 9000ms: Unable to find an accessible element with the role \"button\" and name \"Timer ended\"");
    });

    test("Should fail for test : Ko axe core failed", () => {
        const testCase = JunitReportHelper.getTestCase(report, "Ko", "Ko axe core failed");
        expect(testCase?.failure._).toContain("A11y validation failed: expected 1 to equal 0");
    });

    test("Should fail for test : Ko table", () => {
        const testCase = JunitReportHelper.getTestCase(report, "Ko", "Ko Table content should failed when wrong content");
        expect(testCase?.failure._).toContain("Expected the table content [[\"Company\",\"Contact\",\"Country\"],[\"Alfreds Futterkiste\",\"Maria Anders\",\"Germany\"],[\"Centro comercial Moctezuma\",\"Francisco Chang\",\"Mexico\"],[\"Ernst Handel\",\"Roland Mendel\",\"Austria\"],[\"Island Trading\",\"Helen Bennett\",\"UK\"],[\"Laughing Bacchus Winecellars\",\"Yoshi Tannamuri\",\"Canada\"],[\"Magazzini Alimentari Riuniti\",\"Giovanni Rovelli\",\"Italy\"]] to equals [[\"Company\",\"Contact\",\"Country\"],[\"Alfreds Futterkiste\",\"Maria Anders\",\"Germany\"],[\"Centro comercial Moctezuma\",\"Etienne Daaho\",\"Mexico\"],[\"Ernst Handel\",\"Roland Mendel\",\"Austria\"],[\"Island Trading\",\"Helen Bennett\",\"UK\"],[\"Laughing Bacchus Winecellars\",\"Yoshi Tannamuri\",\"Canada\"],[\"Magazzini Alimentari Riuniti\",\"Giovanni Rovelli\",\"Italy\"]]: expected [ Array(7) ] to deeply equal [ Array(7) ]");
    });

    test("Should fail for test : Select a value in combo box then check - Bad value", () => {
        const testCase = JunitReportHelper.getTestCase(report, "Ko", "Ko Select a value in combo box then check - Bad value");
        expect(testCase?.failure._).toContain("Timed out retrying after 6000ms: Unable to find an accessible element with the role \"option\" and name \"Unreal1\"");
    });

    test("Should fail for test : Set a input text value then check - Bad value", () => {
        const testCase = JunitReportHelper.getTestCase(report, "Ko", "Ko Set a input text value then check - Bad value");
        expect(testCase?.failure._).toContain("expected '<input#new-town-name.form-control.ng-untouched.ng-dirty.ng-valid>' to have value 'Qwerty', but the value was 'Azerty'");
    });
});

describe("Runner Cypress A11yReport", () => {
    let report: UuvA11yResult;

    beforeAll(async () => {
        report = JSON.parse(
            fs.readFileSync(path.join(__dirname, "../../../reports/a11y-report.json"), {
            encoding: "utf8", flag: "r"
            })
        ) as UuvA11yResult;
    });

    test("Should have good results", () => {
        expect(report.app.name).toEqual("@uuv/cypress");
        expect(report.app.description).toEqual("A solution to facilitate the writing and execution of E2E tests understandable by any human being using cucumber(BDD) and cypress");
        expect(report.app.usecases.length).toEqual(15);
        expect(report.app.usecases[0]).toMatchObject({
            "name": "key.then.a11y.check.default",
            "script": "empty Script",
            "location": {
                "file": path.join("e2e", "en-accessibility.feature"),
                "column": 0,
                "line": 0
            },
            "result": {
                "reference": "WCAG-WEB",
                "issues": [],
                "status": "success"
            }
        });
        expect(report.app.usecases[1]).toMatchObject({
            "name": "key.then.a11y.check.onlyCritical",
            "script": "empty Script",
            "location": {
                "file": path.join("e2e", "en-accessibility.feature"),
                "column": 0,
                "line": 0
            },
            "result": {
                "reference": "WCAG-WEB",
                "issues": [],
                "status": "success"
            }
        });
        expect(report.app.usecases[2]).toMatchObject({
            "name": "key.then.a11y.check.withFixtureOption",
            "script": "empty Script",
            "location": {
                "file": path.join("e2e", "en-accessibility.feature"),
                "column": 0,
                "line": 0
            },
            "result": {
                "reference": "WCAG-WEB",
                "issues": [],
                "status": "success"
            }
        });
        expect(report.app.usecases[3]).toMatchObject({
            "name": "key.then.a11y.check.withImpacts",
            "script": "empty Script",
            "location": {
                "file": path.join("e2e", "en-accessibility.feature"),
                "column": 0,
                "line": 0
            },
            "result": {
                "reference": "WCAG-WEB",
                "issues": [],
                "status": "success"
            }
        });
        expect(report.app.usecases[4]).toMatchObject({
            "name": "key.then.a11y.check.withTags",
            "script": "empty Script",
            "location": {
                "file": path.join("e2e", "en-accessibility.feature"),
                "column": 0,
                "line": 0
            },
            "result": {
                "reference": "WCAG-WEB",
                "issues": [],
                "status": "success"
            }
        });
        expect(report.app.usecases[5]).toMatchObject({
            "name": "key.then.a11y.rgaa.defaultWithResultContaining",
            "script": "empty Script",
            "location": {
                "file": path.join("e2e", "en-rgaa.feature"),
                "column": 0,
                "line": 0
            },
            "result": {
                "reference": "WCAG-WEB",
                "status": "error"
            }
        });
        expect(report.app.usecases[5].result.issues.length).toEqual(94);
        expect(report.app.usecases[6]).toMatchObject({
            "name": "key.then.a11y.rgaa.defaultWithResult",
            "script": "empty Script",
            "location": {
                "file": path.join("e2e", "en-rgaa.feature"),
                "column": 0,
                "line": 0
            },
            "result": {
                "reference": "WCAG-WEB",
                "status": "error"
            }
        });
        expect(report.app.usecases[6].result.issues.length).toEqual(94);
    });
});
