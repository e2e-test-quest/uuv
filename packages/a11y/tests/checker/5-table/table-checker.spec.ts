import { Browser, Page } from "puppeteer";
import * as path from "path";
import { A11yResultStatus } from "../../../src/lib/model";
import { injectUvvA11YAndLoadUrl } from "../../commons-test";
import { checkTest } from "../ExpectHelper";

describe("5-table", () => {
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

  it("5.1 should return results", async () => {
    await initA11yOnPage("table-with-header.html");
    const { result, summary } = await validateA11y(page.url(), ["5.1"]);
    expect(result.status).toEqual(A11yResultStatus.ERROR);
    const [_5_1_1_TAG, _5_1_1_ROLE] = result.rawResult.ruleResults;
    // Caption inside element different of table is not detected
    checkTest(_5_1_1_TAG, "5.1.1",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=table-complex]",
       "table[data-testid=table-complex-with-caption-empty]",
       "table[data-testid=table-complex-with-aria-describedby-not-existing]",
       "table[data-testid=table-complex-with-aria-labelledby-existing]",
       "table[data-testid=table-complex-with-aria-labelledby-not-existing]",
       "table[data-testid=table-complex-with-aria-label-empty]",
       "table[data-testid=table-complex-with-aria-label]"
     ]
    );
    checkTest(_5_1_1_ROLE, "5.1.1",
     A11yResultStatus.ERROR,
     [
       "div[data-testid=div-complex-with-role-table]",
       "div[data-testid=div-complex-with-role-table-and-caption]",
       "div[data-testid=div-complex-with-role-table-and-caption-empty]",
       "div[data-testid=div-complex-with-aria-describedby-not-existing]",
       "div[data-testid=div-complex-with-aria-labelledby-not-existing]",
       "div[data-testid=div-complex-with-aria-labelledby-existing]",
       "div[data-testid=div-complex-with-aria-label-empty]",
       "div[data-testid=div-complex-with-aria-label]"
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.ERROR,
      criteria: {
        "5.1": {
          status: A11yResultStatus.ERROR,
          tests: expect.objectContaining({
            "5.1.1": {
              status: A11yResultStatus.ERROR
            }
          })
        }
      }
    });
  });

  it("5.2 should return results", async () => {
    await initA11yOnPage("table-with-header.html");
    const { result, summary } = await validateA11y(page.url(), ["5.2"]);
    expect(result.status).toEqual(A11yResultStatus.MANUAL);
    const [_5_2_1] = result.rawResult.ruleResults;
    // Caption inside element different of table is not detected
    checkTest(_5_2_1, "5.2.1",
     A11yResultStatus.MANUAL,
     [],
     [
       "table[data-testid=first-table] > caption:nth-of-type(1)",
       "table[data-testid=table-complex-with-summary]",
       "table[data-testid=table-complex-with-caption] > caption:nth-of-type(1)",
       "table[data-testid=table-complex-with-aria-describedby-not-existing]",
       "table[data-testid=table-complex-with-aria-describedby-existing]",
       "table[data-testid=table-complex-with-summary-but-caption] > caption:nth-of-type(1)",
       "div[data-testid=div-complex-with-aria-describedby-not-existing]",
       "div[data-testid=div-complex-with-aria-describedby-existing]"

     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.MANUAL,
      criteria: {
        "5.2": {
          status: A11yResultStatus.MANUAL,
          tests: expect.objectContaining({
            "5.2.1": {
              status: A11yResultStatus.MANUAL
            }
          })
        }
      }
    });
  });

  it("5.3 should return results", async () => {
    await initA11yOnPage("table.html");
    const { result, summary } = await validateA11y(page.url(), ["5.3"]);
    expect(result.status).toEqual(A11yResultStatus.MANUAL);
    const [_5_3_1] = result.rawResult.ruleResults;
    checkTest(_5_3_1, "5.3.1",
     A11yResultStatus.MANUAL,
     [],
     [
       "table[data-testid=table-with-role-presentation]"
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.MANUAL,
      criteria: {
        "5.3": {
          status: A11yResultStatus.MANUAL,
          tests: expect.objectContaining({
            "5.3.1": {
              status: A11yResultStatus.MANUAL
            }
          })
        }
      }
    });
  });

  it("5.4 should return results", async () => {
    await initA11yOnPage("table.html");
    const { result, summary } = await validateA11y(page.url(), ["5.4"]);
    expect(result.status).toEqual(A11yResultStatus.ERROR);
    const [_5_4_1] = result.rawResult.ruleResults;
    checkTest(_5_4_1, "5.4.1",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=table]",
       "table[data-testid=table-with-summary]",
       "table[data-testid=table-with-caption-empty]",
       "table[data-testid=table-with-aria-describedby-not-existing]",
       "table[data-testid=table-with-aria-describedby-existing]",
       "table[data-testid=table-with-aria-labelledby-not-existing]",
       "table[data-testid=table-with-aria-label-empty]",
       "div[data-testid=div-with-role-table]",
       "div[data-testid=div-with-role-table-and-caption]",
       "div[data-testid=div-with-role-table-and-caption-empty]",
       "div[data-testid=div-with-aria-describedby-not-existing]",
       "div[data-testid=div-with-aria-describedby-existing]",
       "div[data-testid=div-with-aria-labelledby-not-existing]",
       "div[data-testid=div-with-aria-label-empty]"
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.ERROR,
      criteria: {
        "5.4": {
          status: A11yResultStatus.ERROR,
          tests: expect.objectContaining({
            "5.4.1": {
              status: A11yResultStatus.ERROR
            }
          })
        }
      }
    });
  });

  it("5.5 should return results", async () => {
    await initA11yOnPage("table.html");
    const { result, summary } = await validateA11y(page.url(), ["5.5"]);
    expect(result.status).toEqual(A11yResultStatus.MANUAL);
    const [_5_5_1] = result.rawResult.ruleResults;
    checkTest(_5_5_1, "5.5.1",
     A11yResultStatus.MANUAL,
     [],
     [
       "table[data-testid=table-with-caption] > caption:nth-of-type(1)",
       "table[data-testid=table-with-aria-labelledby-existing]",
       "table[data-testid=table-with-aria-labelledby-not-existing]",
       "table[data-testid=table-with-aria-label]",
       "table[data-testid=table-with-summary-but-caption] > caption:nth-of-type(1)",
       "div[data-testid=div-with-aria-labelledby-not-existing]",
       "div[data-testid=div-with-aria-labelledby-existing]",
       "div[data-testid=div-with-aria-label]"
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.MANUAL,
      criteria: {
        "5.5": {
          status: A11yResultStatus.MANUAL,
          tests: expect.objectContaining({
            "5.5.1": {
              status: A11yResultStatus.MANUAL
            }
          })
        }
      }
    });
  });

  it("5.6 should return results", async () => {
    await initA11yOnPage("table.html");
    const { result, summary } = await validateA11y(page.url(), ["5.6"]);
    expect(result.status).toEqual(A11yResultStatus.MANUAL);
    const [_5_6_1, _5_6_2, _5_6_3, _5_6_4] = result.rawResult.ruleResults;
    const allTablesOfContent = [
      "table[data-testid=table]",
      "table[data-testid=table-with-summary]",
      "table[data-testid=table-with-caption]",
      "table[data-testid=table-with-caption-empty]",
      "table[data-testid=table-with-aria-describedby-not-existing]",
      "table[data-testid=table-with-aria-describedby-existing]",
      "table[data-testid=table-with-aria-labelledby-existing]",
      "table[data-testid=table-with-aria-labelledby-not-existing]",
      "table[data-testid=table-with-aria-label-empty]",
      "table[data-testid=table-with-aria-label]",
      "table[data-testid=table-with-summary-but-caption]",
      "div[data-testid=div-with-role-table]",
      "div[data-testid=div-with-role-table-and-caption]",
      "div[data-testid=div-with-role-table-and-caption-empty]",
      "div[data-testid=div-with-aria-describedby-not-existing]",
      "div[data-testid=div-with-aria-describedby-existing]",
      "div[data-testid=div-with-aria-labelledby-not-existing]",
      "div[data-testid=div-with-aria-labelledby-existing]",
      "div[data-testid=div-with-aria-label-empty]",
      "div[data-testid=div-with-aria-label]"
    ];
    checkTest(_5_6_1, "5.6.1",
     A11yResultStatus.MANUAL,
     [],
     allTablesOfContent
    );
    checkTest(_5_6_2, "5.6.2",
     A11yResultStatus.MANUAL,
     [],
     allTablesOfContent
    );
    checkTest(_5_6_3, "5.6.3",
     A11yResultStatus.MANUAL,
     [],
     allTablesOfContent
    );
    checkTest(_5_6_4, "5.6.4",
     A11yResultStatus.MANUAL,
     [],
     allTablesOfContent
    );
    expect(summary).toEqual({
      status: A11yResultStatus.MANUAL,
      criteria: {
        "5.6": {
          status: A11yResultStatus.MANUAL,
          tests: expect.objectContaining({
            "5.6.1": {
              status: A11yResultStatus.MANUAL
            },
            "5.6.2": {
              status: A11yResultStatus.MANUAL
            },
            "5.6.3": {
              status: A11yResultStatus.MANUAL
            },
            "5.6.4": {
              status: A11yResultStatus.MANUAL
            }
          })
        }
      }
    });
  });

  it("5.7 should return results", async () => {
    await initA11yOnPage("table-with-header.html");
    const { result, summary } = await validateA11y(page.url(), ["5.7"]);
    expect(result.status).toEqual(A11yResultStatus.ERROR);
    const [_5_7_1_COLUMN, _5_7_1_ROW, _5_7_2_COLUMN, _5_7_2_ROW, _5_7_3, _5_7_5_COLUMN, _5_7_5_ROW, _5_7_4] = result.rawResult.ruleResults;
    checkTest(_5_7_1_COLUMN, "5.7.1",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=first-table] > tbody > tr:nth-of-type(1) > th:nth-of-type(2)",
       "th#an-id"
     ]
    );
    checkTest(_5_7_1_ROW, "5.7.1",
     A11yResultStatus.ERROR,
     [
       "th#an-id",
       "table[data-testid=first-table] > tbody > tr:nth-of-type(7) > th:nth-of-type(1)"
     ]
    );
    checkTest(_5_7_2_COLUMN, "5.7.2",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=first-table] > tbody > tr:nth-of-type(1) > th:nth-of-type(5)",
     ]
    );
    checkTest(_5_7_2_ROW, "5.7.2",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=first-table] > tbody > tr:nth-of-type(8) > th:nth-of-type(1)"
     ]
    );
    checkTest(_5_7_3, "5.7.3",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=first-table] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "th#an-id",
       "table[data-testid=first-table] > tbody > tr:nth-of-type(4) > th:nth-of-type(2)",
       "table[data-testid=first-table] > tbody > tr:nth-of-type(5) > th:nth-of-type(2)",
       "table[data-testid=first-table] > tbody > tr:nth-of-type(8) > th:nth-of-type(2)",
       "table[data-testid=table-complex] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-summary] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-caption] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-caption-empty] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-aria-describedby-not-existing] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-aria-describedby-existing] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-aria-labelledby-existing] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-aria-labelledby-not-existing] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-aria-label-empty] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-aria-label] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)",
       "table[data-testid=table-complex-with-summary-but-caption] > tbody > tr:nth-of-type(2) > th:nth-of-type(2)"
     ]
    );
    checkTest(_5_7_4, "5.7.4",
     A11yResultStatus.MANUAL,
     [],
     [
       "table[data-testid=first-table]",
       "table[data-testid=table-complex]",
       "table[data-testid=table-complex-with-summary]",
       "table[data-testid=table-complex-with-caption]",
       "table[data-testid=table-complex-with-caption-empty]",
       "table[data-testid=table-complex-with-aria-describedby-not-existing]",
       "table[data-testid=table-complex-with-aria-describedby-existing]",
       "table[data-testid=table-complex-with-aria-labelledby-existing]",
       "table[data-testid=table-complex-with-aria-labelledby-not-existing]",
       "table[data-testid=table-complex-with-aria-label-empty]",
       "table[data-testid=table-complex-with-aria-label]",
       "table[data-testid=table-complex-with-summary-but-caption]",
       "div[data-testid=div-complex-with-role-table]",
       "div[data-testid=div-complex-with-role-table-and-caption]",
       "div[data-testid=div-complex-with-role-table-and-caption-empty]",
       "div[data-testid=div-complex-with-aria-describedby-not-existing]",
       "div[data-testid=div-complex-with-aria-describedby-existing]",
       "div[data-testid=div-complex-with-aria-labelledby-not-existing]",
       "div[data-testid=div-complex-with-aria-labelledby-existing]",
       "div[data-testid=div-complex-with-aria-label-empty]",
       "div[data-testid=div-complex-with-aria-label]",

     ]
    );
    checkTest(_5_7_5_COLUMN, "5.7.5",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=first-table] > tbody > tr:nth-of-type(1) > th:nth-of-type(3)"
     ]
    );
    checkTest(_5_7_5_ROW, "5.7.5",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=first-table] > tbody > tr:nth-of-type(6) > th:nth-of-type(1)"
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.ERROR,
      criteria: {
        "5.7": {
          status: A11yResultStatus.ERROR,
          tests: expect.objectContaining({
            "5.7.1": {
              status: A11yResultStatus.ERROR
            },
            "5.7.2": {
              status: A11yResultStatus.ERROR
            },
            "5.7.3": {
              status: A11yResultStatus.ERROR
            },
            "5.7.4": {
              status: A11yResultStatus.MANUAL
            },
            "5.7.5": {
              status: A11yResultStatus.ERROR
            }
          })
        }
      }
    });
  });

  it("5.8 should return results", async () => {
    await initA11yOnPage("table-presentation.html");
    const { result, summary } = await validateA11y(page.url(), ["5.8"]);
    expect(result.status).toEqual(A11yResultStatus.ERROR);
    const [_5_8_1] = result.rawResult.ruleResults;
    checkTest(_5_8_1, "5.8.1",
     A11yResultStatus.ERROR,
     [
       "table[data-testid=table-with-summary]",
       "table[data-testid=table-with-caption]",
       "table[data-testid=table-with-thead]",
       "table[data-testid=table-with-th]",
       "table[data-testid=table-with-tfoot]",
       "table[data-testid=table-with-rowheader] > tbody > tr:nth-of-type(1)",
       "table[data-testid=table-with-columnheader] > tbody > tr:nth-of-type(1)",
       "table[data-testid=table-with-scope] > tbody > tr:nth-of-type(1) > td:nth-of-type(1)",
       "table[data-testid=table-with-headers] > tbody > tr:nth-of-type(1) > td:nth-of-type(1)",
       "table[data-testid=table-with-axis] > tbody > tr:nth-of-type(1) > td:nth-of-type(1)"
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.ERROR,
      criteria: {
        "5.8": {
          status: A11yResultStatus.ERROR,
          tests: expect.objectContaining({
            "5.8.1": {
              status: A11yResultStatus.ERROR
            }
          })
        }
      }
    });
  });
});
