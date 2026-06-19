import { Formatter } from "cucumber-json-report-formatter";

// FIXME remove this class when the PR https://github.com/vrymar/cucumber-json-report-formatter/pull/20 will be merged
export class UuvCustomFormatter extends Formatter {
  constructor() {
    super();
  }

  override async parseCucumberJson(sourceFile, outputFile) {
    console.info(`Start formatting file '${sourceFile}' into '${outputFile}'`);
    const report = await this.helper.readFileIntoJson(sourceFile);
    const gherkinDocumentJson = this.helper.getJsonFromArray(report, "gherkinDocument");
    const cucumberReport: Json[] = [];
    gherkinDocumentJson.forEach(gherkinJson => {
      let gherkinDocument;
      try {
        gherkinDocument = JSON.parse(gherkinJson).gherkinDocument;
      } catch (err) {
        console.error("Error parsing JSON string.", err);
      }
      const feature = gherkinDocument.feature;
      const featureChildren = feature.children;
      const scenariosJson = [];
      const background = {};
      featureChildren.forEach(featureChild => {
        if (featureChild.rule) {
          featureChild.rule.steps = [];
          featureChild.rule.children.forEach(ruleChildren => {
            this.buildAndAddScenario(ruleChildren, report, background, feature, scenariosJson, featureChild.rule);
          });
        } else {
          this.buildAndAddScenario(featureChild, report, background, feature, scenariosJson, undefined);
        }
      });
      const rootJson: Json  = {
        comments: this.getComments(gherkinDocument.comments),
        description: gherkinDocument.feature.description,
        elements: scenariosJson,
        id: feature.name,
        keyword: feature.keyword,
        line: feature.location.line,
        name: feature.name,
        uri: gherkinDocument.uri,
        tags: this.getTags(gherkinDocument.feature.tags)
      };
      cucumberReport.push(rootJson);
    });
    await this.validateReportSchema(report);
    const reportString = JSON.stringify(cucumberReport);
    console.info(`Finished formatting file '${sourceFile}'`);
    this.helper.writeFile(outputFile, reportString);
  }

  private buildAndAddScenario(child, report: string[], background: object, feature, scenariosJson: any[], rule) {
    let steps: any[] = [];
    let stepJson = {};
    // Background
    if (child.scenario === undefined) {
      child.background.steps.forEach(step => {
        stepJson = this.createStepJson(step, report, 0);
        steps.push(stepJson);
      });
      background = this.createScenarioJson(feature, child.background, steps, "background");
      // eslint-disable-next-line brace-style
    }
    // Normal Scenario
    else if (!child.scenario.keyword.includes("Outline")) {
      child.scenario.steps.forEach(step => {
        stepJson = this.createStepJson(step, report, 0);
        steps.push(stepJson);
      });
      const scenario = this.createScenarioJson(feature, child.scenario, steps, "scenario");
      if (rule) {
        scenario.id = `${feature.name};${rule.name};${scenario.name}`;
      }
      if (Object.keys(background).length !== 0 && background !== undefined) {
        scenariosJson.push(background);
      }
      scenariosJson.push(scenario);
    } /* Scenario Outline */ else if (child.scenario.examples[0].tableBody !== undefined) {
      const numberOfExecutions = child.scenario.examples[0].tableBody.length;
      const numberOfStepsEachExecution = child.scenario.steps.length;
      let scenarioIndex = 0;
      while (scenarioIndex < numberOfExecutions) {
        let currentStep = 0;
        steps = [];
        while (currentStep < numberOfStepsEachExecution) {
          stepJson = this.createStepJson(child.scenario.steps[currentStep], report, scenarioIndex);
          currentStep++;
          steps.push(stepJson);
        }
        const scenario = this.createScenarioJson(feature, child.scenario, steps, "scenario", scenarioIndex);
        if (rule) {
          scenario.id = `${feature.name};${rule.name};${scenario.name}`;
        }
        if (Object.keys(background).length !== 0 && background !== undefined) {
          scenariosJson.push(background);
        }
        scenariosJson.push(scenario);
        scenarioIndex++;
      }
    }
  }
}

interface Json { comments: any[] | undefined; line: any; elements: any[]; name: any; description: any; id: any; keyword: any; uri: any; tags: any[] | undefined}
