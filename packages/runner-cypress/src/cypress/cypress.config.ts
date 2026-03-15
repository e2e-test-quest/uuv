import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import fs from "fs";
import { UUVListenerHelper, UUVEventEmitter } from "@uuv/runner-commons/runner/event";
import path from "path";

export async function setupNodeEvents (
    cypressOn: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  const startedFile: string[] = [];

  // https://github.com/bahmutov/cypress-on-fix
  const on = require("cypress-on-fix")(cypressOn);

  await addCucumberPreprocessorPlugin(on, config);

  await UUVListenerHelper.build();

  on(
    "file:preprocessor",
    createBundler({
      plugins: [
        createEsbuildPlugin(config),
        {
          name: "ignore-fs",
          setup(build) {
            build.onResolve({ filter: /^(fs|child_process)$/ }, () => ({
              path: "fs",
              namespace: "ignore",
            }));
            build.onLoad({ filter: /.*/, namespace: "ignore" }, () => ({
              contents: "module.exports = {}",
              loader: "js",
            }));
          }
        }
      ],
      alias: {
        path: "path-browserify"
      }
    })
  );

  on("before:run", async () => {
    // eslint-disable-next-line dot-notation
    const a11yReportFilePath = config.env["uuvOptions"].report.a11y.outputFile;
    // eslint-disable-next-line dot-notation
    const generateA11yReport = config.env["uuvOptions"].report.a11y.enabled;
    clearA11yReport(a11yReportFilePath);
    if (generateA11yReport === true) {
      await initA11yReport(a11yReportFilePath);
    }
    UUVEventEmitter.getInstance().emitProgressStart();
  });

  on("after:run", async (results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult) => {
    UUVEventEmitter.getInstance().emitProgressFinish();
  });

  on("before:spec", async (spec: any) => {
    if (!startedFile.includes(spec.absolute)) {
      UUVEventEmitter.getInstance().emitTestSuiteStarted({
        testSuiteName: spec.name,
        testSuitelocation: spec.absolute
      });
      startedFile.push(spec.absolute);
    }
  });

  on("after:spec", async (spec: any, results: CypressCommandLine.RunResult) => {
    results?.tests?.forEach(test => {
      UUVEventEmitter.getInstance().emitTestStarted({
        testName: test.title[1],
        testSuiteName: spec.name,
        testSuitelocation: spec.absolute
      });
      if (test.state === "passed") {
        UUVEventEmitter.getInstance().emitTestFinished({
          testName: test.title[1],
          testSuiteName: spec.name,
          duration: test.duration
        });
      } else if (test.state === "failed") {
        UUVEventEmitter.getInstance().emitTestFailed({
          testName: test.title[1],
          testSuiteName: spec.name,
          duration: test.duration
        });
      } else {
        UUVEventEmitter.getInstance().emitTestIgnored({
          testName: test.title[1],
          testSuiteName: spec.name
        });
      }
    });
    UUVEventEmitter.getInstance().emitTestSuiteFinished({
      testSuiteName: spec.name
    });
  });

  function clearA11yReport(reportFilePath: string) {
    if (fs.existsSync(reportFilePath)) {
      fs.rmSync(reportFilePath);
    }
  }

  async function initA11yReport(reportFilePath: string) {
    // eslint-disable-next-line dot-notation
    const packageJson = await import(path.join(config.env["uuvOptions"].projectDir, "package.json"));

    const emptyReport = {
      app: {
        name: packageJson.name,
        description: packageJson.description,
        usecases: []
      }
    };
    fs.writeFileSync(reportFilePath, JSON.stringify(emptyReport, null, 4), { flag: "w" });
  }

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}
