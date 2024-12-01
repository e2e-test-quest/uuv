import { Browser, Page } from "puppeteer";
import * as path from "path";
import { A11yResultStatus } from "../../../src/lib/model";
import { injectUvvA11YAndLoadUrl } from "../../commons-test";
import { checkTest } from "../ExpectHelper";

describe("8-required-element", () => {
    let browser: Browser;
    let page: Page;

    async function initA11yOnPage(file: string) {
        const context = await injectUvvA11YAndLoadUrl(path.join(__dirname, file));
        browser = context.browser;
        page = context.page;
    }

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

    it.each(["without-doctype.html", "doctype-after-html.html"])("8.1 should return results for '%s'", async (nonCompliantPage: string) => {
        await initA11yOnPage(nonCompliantPage);
        const { result, summary } = await validateA11y(page.url(), ["8.1"]);
        expect(result.status).toEqual(A11yResultStatus.ERROR);
        const [_8_1_1, _8_1_2, _8_1_3] = result.rawResult.ruleResults;
        checkTest(_8_1_1, "8.1.1",
            A11yResultStatus.ERROR,
            [
                "html[data-testid=html]",
            ]
        );
        checkTest(_8_1_2, "8.1.2",
            A11yResultStatus.ERROR,
            [
                "html[data-testid=html]",
            ]
        );
        checkTest(_8_1_3, "8.1.3",
            A11yResultStatus.ERROR,
            [
                "html[data-testid=html]",
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.ERROR,
            criteria: {
                "8.1": {
                    status: A11yResultStatus.ERROR,
                    tests: expect.objectContaining({
                        "8.1.1": {
                            status: A11yResultStatus.ERROR
                        },
                        "8.1.2": {
                            status: A11yResultStatus.ERROR
                        },
                        "8.1.3": {
                            status: A11yResultStatus.ERROR
                        },
                    })
                }
            }
        });
    });

    it("8.3 should return results for 'html-without-lang.html'", async () => {
        await initA11yOnPage("html-without-lang.html");
        const { result, summary } = await validateA11y(page.url(), ["8.3"]);
        expect(result.status).toEqual(A11yResultStatus.ERROR);
        const [_8_3_1] = result.rawResult.ruleResults;
        checkTest(_8_3_1, "8.3.1",
            A11yResultStatus.ERROR,
            [
                "html[data-testid=html-without-lang]",
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.ERROR,
            criteria: {
                "8.3": {
                    status: A11yResultStatus.ERROR,
                    tests: expect.objectContaining({
                        "8.3.1": {
                            status: A11yResultStatus.ERROR
                        }
                    })
                }
            }
        });
    });

    it.each(["html-lang.html", "html-xml-lang.html"])("8.3 should return results for '%s'", async (nonCompliantPage: string) => {
        await initA11yOnPage(nonCompliantPage);
        const { result, summary } = await validateA11y(page.url(), ["8.3"]);
        expect(result.status).toEqual(A11yResultStatus.SUCCESS);
        const [_8_3_1] = result.rawResult.ruleResults;
        checkTest(_8_3_1, "8.3.1",
            A11yResultStatus.SUCCESS
        );
        expect(summary).toEqual({
            status: A11yResultStatus.SUCCESS,
            criteria: {
                "8.3": {
                    status: A11yResultStatus.SUCCESS,
                    tests: expect.objectContaining({
                        "8.3.1": {
                            status: A11yResultStatus.SUCCESS
                        }
                    })
                }
            }
        });
    });

    it.each([["html-lang.html", "html-with-lang"], ["html-xml-lang.html", "html-with-lang-xml"]])("8.4 should return results for '%s'", async (nonCompliantPage: string, expectedNode) => {
        await initA11yOnPage(nonCompliantPage);
        const { result, summary } = await validateA11y(page.url(), ["8.4"]);
        expect(result.status).toEqual(A11yResultStatus.MANUAL);
        const [_8_4_1] = result.rawResult.ruleResults;
        checkTest(_8_4_1, "8.4.1",
            A11yResultStatus.MANUAL,
            [],
            [
                `html[data-testid=${expectedNode}]`
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.MANUAL,
            criteria: {
                "8.4": {
                    status: A11yResultStatus.MANUAL,
                    tests: expect.objectContaining({
                        "8.4.1": {
                            status: A11yResultStatus.MANUAL
                        }
                    })
                }
            }
        });
    });

    it("8.5 should return results for 'html-lang.html'", async () => {
        await initA11yOnPage("html-lang.html");
        const { result, summary } = await validateA11y(page.url(), ["8.5"]);
        expect(result.status).toEqual(A11yResultStatus.ERROR);
        const [_8_5_1] = result.rawResult.ruleResults;
        checkTest(_8_5_1, "8.5.1",
            A11yResultStatus.ERROR,
            [
                "html[data-testid=html-with-lang]",
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.ERROR,
            criteria: {
                "8.5": {
                    status: A11yResultStatus.ERROR,
                    tests: expect.objectContaining({
                        "8.5.1": {
                            status: A11yResultStatus.ERROR
                        }
                    })
                }
            }
        });
    });

    it("8.5 should return results for 'html-with-title.html'", async () => {
        await initA11yOnPage("html-with-title.html");
        const { result, summary } = await validateA11y(page.url(), ["8.5"]);
        expect(result.status).toEqual(A11yResultStatus.SUCCESS);
        const [_8_5_1] = result.rawResult.ruleResults;
        checkTest(_8_5_1, "8.5.1",
            A11yResultStatus.SUCCESS
        );
        expect(summary).toEqual({
            status: A11yResultStatus.SUCCESS,
            criteria: {
                "8.5": {
                    status: A11yResultStatus.SUCCESS,
                    tests: expect.objectContaining({
                        "8.5.1": {
                            status: A11yResultStatus.SUCCESS
                        }
                    })
                }
            }
        });
    });

    it("8.6 should return results for 'html-with-title.html'", async () => {
        await initA11yOnPage("html-with-title.html");
        const { result, summary } = await validateA11y(page.url(), ["8.6"]);
        expect(result.status).toEqual(A11yResultStatus.MANUAL);
        const [_8_6_1] = result.rawResult.ruleResults;
        checkTest(_8_6_1, "8.6.1",
            A11yResultStatus.MANUAL,
            [],
            [
                "html[data-testid=html-with-title] > head:nth-of-type(1) > title:nth-of-type(1)"
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.MANUAL,
            criteria: {
                "8.6": {
                    status: A11yResultStatus.MANUAL,
                    tests: expect.objectContaining({
                        "8.6.1": {
                            status: A11yResultStatus.MANUAL
                        }
                    })
                }
            }
        });
    });

    it("8.7 should return results for 'html-with-title.html'", async () => {
        await initA11yOnPage("html-with-title.html");
        const { result, summary } = await validateA11y(page.url(), ["8.7"]);
        expect(result.status).toEqual(A11yResultStatus.MANUAL);
        const [_8_7_1] = result.rawResult.ruleResults;
        checkTest(_8_7_1, "8.7.1",
            A11yResultStatus.MANUAL,
            [],
            [
                "html[data-testid=html-with-title]"
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.MANUAL,
            criteria: {
                "8.7": {
                    status: A11yResultStatus.MANUAL,
                    tests: expect.objectContaining({
                        "8.7.1": {
                            status: A11yResultStatus.MANUAL
                        }
                    })
                }
            }
        });
    });

    it("8.8 should return results for 'html-multi-lang.html'", async () => {
        await initA11yOnPage("html-multi-lang.html");
        const { result, summary } = await validateA11y(page.url(), ["8.8"]);
        expect(result.status).toEqual(A11yResultStatus.MANUAL);
        const [_8_8_1] = result.rawResult.ruleResults;
        checkTest(_8_8_1, "8.8.1",
            A11yResultStatus.MANUAL,
            [],
            [
                "span[data-testid=word-lang]",
                "span[data-testid=word-lang-xml]"
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.MANUAL,
            criteria: {
                "8.8": {
                    status: A11yResultStatus.MANUAL,
                    tests: expect.objectContaining({
                        "8.8.1": {
                            status: A11yResultStatus.MANUAL
                        }
                    })
                }
            }
        });
    });

    it("8.10 should return results for 'dir.html'", async () => {
        await initA11yOnPage("dir.html");
        const { result, summary } = await validateA11y(page.url(), ["8.10"]);
        expect(result.status).toEqual(A11yResultStatus.ERROR);
        const [_8_10_1, _8_10_2] = result.rawResult.ruleResults;
        checkTest(_8_10_1, "8.10.1",
            A11yResultStatus.ERROR,
            [
                "p[data-testid=dir-not-compliant]"
            ]
        );
        checkTest(_8_10_2, "8.10.2",
            A11yResultStatus.MANUAL,
            [],
            [
                "p[data-testid=dir-ltr]",
                "p[data-testid=dir-rtl]"
            ]
        );
        expect(summary).toEqual({
            status: A11yResultStatus.ERROR,
            criteria: {
                "8.10": {
                    status: A11yResultStatus.ERROR,
                    tests: expect.objectContaining({
                        "8.10.1": {
                            status: A11yResultStatus.ERROR
                        },
                        "8.10.2": {
                            status: A11yResultStatus.MANUAL
                        }
                    })
                }
            }
        });
    });
});
