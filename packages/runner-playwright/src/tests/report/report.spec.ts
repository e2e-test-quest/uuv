import { JunitReport, JunitReportHelper } from "@uuv/runner-commons/test";
import path from "path";
import { expect } from "@jest/globals";

describe("Runner Playwright JunitReport", () => {
    let report: JunitReport;

    beforeAll(async () => {
        report = await JunitReportHelper.readReport(path.join(__dirname, "../../../reports/e2e/junit-report.xml")) as JunitReport;
    });

    test("Should have good results", () => {
        expect(report.testsuites.tests).toEqual("139");
        expect(report.testsuites.failures).toEqual("9");
        expect(report.testsuites.errors).toEqual("0");
        expect(report.testsuites.skipped).toEqual("0");
    });

    test("Should fail for test : Error when waiting a mock without instanciate a mock before", () => {
        const testCase = JunitReportHelper.getTestCase(report, "ko.feature.spec.js", "Ko › Error when waiting a mock without instanciate a mock before");
        expect(testCase?.failure._).toContain("Mock uuvFixture must be defined before use this sentence");
    });

    test("Should fail for test : Ko Homepage - Bad title", () => {
        const testCase = JunitReportHelper.getTestCase(report, "ko.feature.spec.js", "Ko › Homepage - Bad title");
        expect(testCase?.failure._).toContain("Error: Timed out 6000ms waiting for expect(locator).toHaveCount(expected)");
        expect(testCase?.failure._).toContain("Locator: getByRole('heading', { name: 'Welcome to Weather App - ko', exact: true })");
    });

    test("Should fail for test : Ko TownResearch - Bad textbox name", () => {
        const testCase = JunitReportHelper.getTestCase(report, "ko.feature.spec.js", "Ko › TownResearch - Bad textbox name");
        expect(testCase?.failure._).toContain("Error: Timed out 6000ms waiting for expect(locator).toHaveCount(expected)");
        expect(testCase?.failure._).toContain("Locator: getByRole('textbox', { name: 'Search for a town3', exact: true })");
    });

    test("Should fail for test : Ko click failed with custom timeout", () => {
        const testCase = JunitReportHelper.getTestCase(report, "ko.feature.spec.js", "Ko › click failed with custom timeout");
        expect(testCase?.failure._).toContain("Error: Timed out 9000ms waiting for expect(locator).toHaveCount(expected)");
        expect(testCase?.failure._).toContain("Locator: getByRole('button', { name: 'Timer ended', exact: true })");
    });

    test("Should fail for test : Ko table", () => {
        const testCase = JunitReportHelper.getTestCase(report, "ko.feature.spec.js", "Ko › Table content should failed when wrong content");
        expect(testCase?.failure._).toContain("Error: cell at index [2, 1] should be Etienne Daaho");
        expect(testCase?.failure._).toContain("Locator: getByRole('row').nth(2).getByRole('cell').nth(1)");
        expect(testCase?.failure._).toContain("Expected string: \"Etienne Daaho\"");
        expect(testCase?.failure._).toContain("Received string: \"Francisco Chang\"");
    });
});
