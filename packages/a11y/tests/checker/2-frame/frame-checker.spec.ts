import { Browser, Page } from "puppeteer";
import * as path from "path";
import { A11yResultStatus } from "../../../src/lib/model";
import { injectUvvA11YAndLoadUrl } from "../../commons-test";
import { checkTest } from "../ExpectHelper";

describe("2-frame", () => {
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

  it("2.1 should return results for iframe", async () => {
    await initA11yOnPage("iframe.html");
    const { result, summary } = await validateA11y(page.url(), ["2.1"]);
    expect(result.status).toEqual(A11yResultStatus.ERROR);
    const [_2_1_1, _2_2_1] = result.rawResult.ruleResults;
    checkTest(_2_1_1, "2.1.1",
      A11yResultStatus.ERROR,
     [
       "iframe[data-testid=iframe-with-empty-title]",
       "iframe[data-testid=iframe-without-title]",
      ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.ERROR,
      criteria: {
        "2.1": {
          status: A11yResultStatus.ERROR,
          tests: expect.objectContaining({
              "2.1.1": {
                  status: A11yResultStatus.ERROR
              },
          })
        }
      }
    });
  });

  it("2.2 should return results for iframe", async () => {
    await initA11yOnPage("iframe.html");
    const { result, summary } = await validateA11y(page.url(), ["2.2"]);
    expect(result.status).toEqual(A11yResultStatus.MANUAL);
    const [_2_2_1] = result.rawResult.ruleResults;
    checkTest(_2_2_1, "2.2.1",
        A11yResultStatus.MANUAL,
        [],
        [
          "iframe[data-testid=iframe-with-title]",
        ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.MANUAL,
      criteria: {
        "2.2": {
          status: A11yResultStatus.MANUAL,
          tests: expect.objectContaining({
            "2.2.1": {
              status: A11yResultStatus.MANUAL
            },
          })
        }
      }
    });
  });

  it("2.1 should return results for frame", async () => {
    await initA11yOnPage("frame.html");
    const { result, summary } = await validateA11y(page.url(), ["2.1"]);
    expect(result.status).toEqual(A11yResultStatus.ERROR);
    const [_2_1_1, _2_2_1] = result.rawResult.ruleResults;
    checkTest(_2_1_1, "2.1.1",
     A11yResultStatus.ERROR,
     [
       "frame[data-testid=frame-with-empty-title]",
       "frame[data-testid=frame-without-title]",
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.ERROR,
      criteria: {
        "2.1": {
          status: A11yResultStatus.ERROR,
          tests: expect.objectContaining({
            "2.1.1": {
              status: A11yResultStatus.ERROR
            },
          })
        }
      }
    });
  });

  it("2.2 should return results for frame", async () => {
    await initA11yOnPage("frame.html");
    const { result, summary } = await validateA11y(page.url(), ["2.2"]);
    expect(result.status).toEqual(A11yResultStatus.MANUAL);
    const [_2_2_1] = result.rawResult.ruleResults;
    checkTest(_2_2_1, "2.2.1",
     A11yResultStatus.MANUAL,
     [],
     [
       "frame[data-testid=frame-with-title]"
     ]
    );
    expect(summary).toEqual({
      status: A11yResultStatus.MANUAL,
      criteria: {
        "2.2": {
          status: A11yResultStatus.MANUAL,
          tests: expect.objectContaining({
            "2.2.1": {
              status: A11yResultStatus.MANUAL
            },
          })
        }
      }
    });
  });
});
