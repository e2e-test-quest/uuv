import { Browser, Page } from "puppeteer";
import { A11yResultStatus, RuleCheckEnum } from "../../src/lib/model";
import { injectUvvA11YAndLoadUrl } from "../commons-test";
import { checkTest } from "./ExpectHelper";

describe("Reference - RGAA", () => {
    let browser: Browser;
    let page: Page;

    beforeEach(async () => {
        const context = await injectUvvA11YAndLoadUrl();
        browser = context.browser;
        page = context.page;
    });

    afterEach(async () => {
        await browser?.close();
    });

    async function validateA11y(url: string, enabledRules?: string[]) {
        return await page.evaluate(async (url, enabledRules) => {
            // @ts-ignore
            const rgaaChecker = new uuvA11y.RgaaChecker(url, enabledRules);
            const usecaseResult = await rgaaChecker.validate().toPromise();
            return {
                result: usecaseResult.result,
                summary: usecaseResult.result.rawResult.summary()
            };
        }, url, enabledRules);
    }

    it("should return some results", async () => {
        const { result, summary } = await validateA11y(page.url());
        await expect(result).toBeTruthy();
        await expect(summary).toBeTruthy();
    });

    it("should be ok when only one auto criteria is enabled", async () => {
        const { result, summary } = await validateA11y(page.url(), ["1.1"]);
        const [_1_1_1_TAG] = result.rawResult.ruleResults;
        expect(result).toBeTruthy();
        expect(result.status).toEqual(A11yResultStatus.ERROR);
        checkTest(_1_1_1_TAG, "1.1.1",
            A11yResultStatus.ERROR,
            [
                "img[data-testid=img-with-custom-role]",
                "img[data-testid=img-with-empty-alt]",
                "img[data-testid=img]",
                "img[data-testid=img-with-aria-labelledby-notExist]",
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.ERROR,
            criteria: {
                "1.1": {
                    status: A11yResultStatus.ERROR,
                    tests: expect.objectContaining({
                        "1.1.1": {
                            status: A11yResultStatus.ERROR
                        },
                        "1.1.2": {
                            status: A11yResultStatus.SUCCESS
                        },
                        "1.1.3": {
                            status: A11yResultStatus.SUCCESS
                        },
                        "1.1.5": {
                            status: A11yResultStatus.SUCCESS
                        },
                        "1.1.6": {
                            status: A11yResultStatus.SUCCESS
                        }
                    })
                }
            }
        });
    });

    it("should be ok when only one manual criteria is enabled", async () => {
        const expectedResult = {
            status: A11yResultStatus.MANUAL,
            ruleResults: [
                {
                    status: A11yResultStatus.MANUAL,
                    rule: {
                        check: RuleCheckEnum.MANUAL,
                        criterion: "8.6",
                        description: "if present, title tag must be relevant",
                        elementType: "mandatory - title",
                        help: "adapt this tag content",
                        id: "8.6.1",
                        wcag: "2.4.2 A",
                        shouldNotExist: true
                    },
                    validations: [
                        {
                            criteria: "8.6",
                            errorNodes: [],
                            nodesToCheckManually: [
                                {
                                    attributes: "",
                                    help: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.6.1",
                                    html: "<title>Is it revelant ? </title>",
                                    node: {},
                                    selector: "html > body > title:nth-of-type(1)"
                                }
                            ],
                            status: A11yResultStatus.MANUAL
                        }
                    ]
                }
            ]
        };
        const { result, summary } = await validateA11y(page.url(), ["8.6"]);
        expect(result).toBeTruthy();
        expect(result.status).toEqual(A11yResultStatus.MANUAL);
        expect(result.rawResult).toMatchObject(expectedResult);
        expect(summary).toEqual({
            status: A11yResultStatus.MANUAL,
            criteria: {
                "8.6": {
                    status: A11yResultStatus.MANUAL,
                    tests: {
                        "8.6.1": {
                            status: A11yResultStatus.MANUAL
                        }
                    }
                }
            }
        });
    });
});
