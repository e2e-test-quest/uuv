import { UUVCliEngine } from "@uuv/runner-commons";
import { UUVCliCypressRunner } from "./runner-cypress";
import { expect, test } from "@jest/globals";
import chalk from "chalk";
import path from "path";

describe("UUV Cli Cypress", () => {
  const projectDir = ".";
  const initialArgs = process.argv;
  let mockOpen;
  let mockE2e;
  let mockExit;
  let mockConsoleError;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {
      // Not empty
    });
    jest.spyOn(console, "debug").mockImplementation(() => {
      // Not empty
    });
    jest.spyOn(console, "info").mockImplementation(() => {
      // Not empty
    });
    jest.spyOn(console, "warn").mockImplementation(() => {
      // Not empty
    });
    mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {
      // Not empty
    });
    // eslint-disable-next-line dot-notation
    delete process.env["UUV_BASE_URL"];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error when uuv is called without args", async () => {
    setProcessArguments([]);
    await getMockedRunner(projectDir);
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(chalk.red("Error: No command specified"));
  });

  test("should open cypress when uuv open is called without args", async () => {
    setProcessArguments(["open"]);
    await getMockedRunner(projectDir);
    expect(mockOpen).toHaveBeenCalledWith(
      {
        project: projectDir,
        env: {
          uuvOptions: {
            command: "open",
            browser: "chrome",
            baseUrl: undefined,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
  });

  test("should open cypress when uuv open is called with args", async () => {
    setProcessArguments(["open", "--env={'a': 'valueA', 'b': 'valueB'}"]);
    await getMockedRunner(projectDir);
    expect(mockOpen).toHaveBeenCalledWith(
      {
        project: projectDir,
        env: {
          a: "valueA",
          b: "valueB",
          uuvOptions: {
            command: "open",
            browser: "chrome",
            baseUrl: undefined,
            extraArgs: {
              a: "valueA",
              b: "valueB",
            },
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
  });

  test("should execute e2e run cypress when uuv e2e is called without args", async () => {
    setProcessArguments(["e2e"]);
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: "chrome",
        env: {
          uuvOptions: {
            command: "e2e",
            browser: "chrome",
            baseUrl: undefined,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute e2e run cypress when uuv e2e is called with targetUrl", async () => {
    setProcessArguments(["e2e"]);
    const targetUrl = "amazingTargetUrl";
    // eslint-disable-next-line dot-notation
    process.env["UUV_BASE_URL"] = targetUrl;
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: "chrome",
        env: {
          uuvOptions: {
            command: "e2e",
            browser: "chrome",
            baseUrl: targetUrl,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute e2e run cypress when uuv e2e is called with generateHtmlReport option", async () => {
    setProcessArguments(["e2e", "--generateHtmlReport"]);
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: "chrome",
        env: {
          uuvOptions: {
            command: "e2e",
            browser: "chrome",
            baseUrl: undefined,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: true,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute e2e run cypress when uuv e2e is called with generateJunitReport option", async () => {
    setProcessArguments(["e2e", "--generateJunitReport"]);
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: "chrome",
        env: {
          uuvOptions: {
            command: "e2e",
            browser: "chrome",
            baseUrl: undefined,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: true,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        },
        reporter: "junit",
        reporterOptions: {
          mochaFile: "reports/e2e/junit-report-[hash].xml"
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute e2e run cypress when uuv e2e is called with generateA11yReport option", async () => {
    setProcessArguments(["e2e", "--generateA11yReport"]);
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: "chrome",
        env: {
          uuvOptions: {
            command: "e2e",
            browser: "chrome",
            baseUrl: undefined,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: true,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute e2e run cypress when uuv e2e is called with browser option", async () => {
    const browser = "amazingBrowser";
    setProcessArguments(["e2e", `--browser=${browser}`]);
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: browser,
        env: {
          uuvOptions: {
            command: "e2e",
            browser: browser,
            baseUrl: undefined,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute e2e run cypress when uuv e2e is called with targetTestFile option", async () => {
    const targetTestFile = "uuv/e2e/custom.*.feature";
    setProcessArguments(["e2e", `--targetTestFile=${targetTestFile}`]);
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: "chrome",
        spec: targetTestFile,
        env: {
          uuvOptions: {
            command: "e2e",
            browser: "chrome",
            baseUrl: undefined,
            extraArgs: {},
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: targetTestFile
          }
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute e2e run cypress when uuv e2e is called with extraArgs option", async () => {
    const extraArgs = { a: "aValue" };
    setProcessArguments(["e2e", `--env=${JSON.stringify(extraArgs)}`]);
    await getMockedRunner(projectDir, {} as any);
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockE2e.mock.calls[0][0]).toEqual(
      {
        project: projectDir,
        browser: "chrome",
        env: {
          ...extraArgs,
          uuvOptions: {
            extraArgs: {
              ...extraArgs
            },
            command: "e2e",
            browser: "chrome",
            baseUrl: undefined,
            projectDir: process.cwd(),
            report: {
              outputDir: "reports",
              a11y: {
                  enabled: undefined,
                  outputFile: path.join(process.cwd(), "reports", "a11y-report.json"),
                  relativePath: path.join("reports", "a11y-report.json")
              },
              html: {
                  enabled: undefined,
                  outputDir: path.join("reports", "e2e/html")
              },
              junit: {
                  enabled: undefined,
                  outputFile: "reports/e2e/junit-report.xml"
              }
            },
            targetTestFile: null
          }
        }
      }
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  function setProcessArguments(mockedArgv: string[]) {
    jest.replaceProperty(process, "argv", [
      ...initialArgs,
      ...mockedArgv
    ]);
  }

  async function getMockedRunner(projectDir: string, result ?: CypressCommandLine.CypressRunResult) {
    const runnerInstance = new UUVCliCypressRunner(projectDir);
    mockOpen = jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, 0);
      });
    });
    // eslint-disable-next-line dot-notation
    runnerInstance["getCypress"]().open = mockOpen;
    if (result) {
      mockE2e = jest.fn(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(result);
          }, 0);
        });
      });
      // eslint-disable-next-line dot-notation
      runnerInstance["getCypress"]().run = mockE2e;
      // eslint-disable-next-line dot-notation
      runnerInstance["mergeJunitReport"] = jest.fn().mockImplementation(() => {
        // Not empty
      });
      // eslint-disable-next-line dot-notation
      runnerInstance["generateHtmlReport"] = jest.fn().mockImplementation(() => {
        // Not empty
      });
    }
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    const engine = new UUVCliEngine(
      runnerInstance
    );

    await engine.execute();
    return runnerInstance;
  }
});

