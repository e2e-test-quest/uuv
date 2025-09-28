import fs from "fs";
import { Common, STEP_DEFINITION_FILE_NAME, TEST_RUNNER_ENUM } from "../step-definition-generator/common";
import { BaseStepDefinition } from "../step-definition-generator/generate-base-step-definitions";
import * as path from "path";
import { getDefinedDictionary } from "@uuv/dictionary";

describe("tester la classe BaseStepDefinition", () => {
  const dirPath = "tests";
  const filePath = "step-definition.txt";
  const data = `
    import { fr } from "../i18n/template.json";
      import { Context } from "./_context";
      import { command } from "../../../cypress/commands";
      import { chrome } from "../../../playwright/chromium";
      import { Method } from "cypress/types/net-stubbing";
      import { key } from "@uuv/dictionary";
      import {key} from "@uuv/dictionary";
      import { data } from "_.common";
      import { data2 } from "../_constant";
      import {
          withinRoleAndName
      } from "./core-engine";
      
      When(\${key.when.visit}, function(siteUrl: string) {
          return cy.visit(\${siteUrl});
      });
    `;
  let stepDef: BaseStepDefinition;

  beforeEach(() => {
    stepDef = new BaseStepDefinition(dirPath, TEST_RUNNER_ENUM.CYPRESS, STEP_DEFINITION_FILE_NAME.BASE, "../assets/i18n/web");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("classe - les attributs sont bien alimentés", () => {
    expect(stepDef.generatedDir).toEqual(path.join("tests/src/cucumber/step_definitions/cypress/generated"));
    expect(stepDef.stepDefinitionFile).toEqual(path.join("tests/src/cucumber/step_definitions/cypress/base-check-engine.ts"));
    expect(stepDef.baseDir).toEqual(dirPath);
  });

  test("runGenerate Base - les attributs sont bien alimentés", () => {
    const spyBuildDir = jest.spyOn(Common, "buildDirIfNotExists").mockImplementation();
    const spyClean = jest.spyOn(Common, "cleanGeneratedFilesIfExists").mockImplementation();
    const spyGenerate = jest.spyOn(stepDef, "generateWordingFiles").mockImplementation();
    stepDef.runGenerate();

    const generateDir = "tests/src/cucumber/step_definitions/cypress/generated";
    expect(spyBuildDir).toHaveBeenCalledWith(path.join(generateDir));
    expect(spyClean).toHaveBeenCalledWith(path.join(generateDir, "_fr-generated-cucumber-steps-definition.ts"));
    expect(spyClean).toHaveBeenCalledWith(path.join(generateDir, "_en-generated-cucumber-steps-definition.ts"));
    expect(spyGenerate).toHaveBeenCalled();
  });
  test("computeWordingFile - les attributs sont bien alimentés", () => {
    const dictionary = getDefinedDictionary("en");
    const result = stepDef.computeWordingFile(data, dictionary);

    expect(result).toContain("NE PAS MODIFIER, FICHIER GENERE");
    expect(result).not.toContain("import {key} from \"@uuv/dictionary\"");
    expect(result).not.toContain("import { key } from \"@uuv/dictionary\"");
    expect(result).toContain("../../_constant");
    expect(result).toContain("../_context");
    expect(result).toContain("../../../../cypress/commands");
    expect(result).toContain("../../../../playwright/chromium");
    expect(result).toContain("../../i18n/template.json");
    expect(result).toContain("I visit");
  });

  test("generateWordingFiles - le fichier doit être généré", () => {
    const spyReadFile = jest.spyOn(fs, "readFileSync").mockImplementation(() => data);
    const spyCompute = jest.spyOn(stepDef, "computeWordingFile").mockImplementation(() => data);
    const spyWrite = jest.spyOn(Common, "writeWordingFile").mockImplementation();

    stepDef.generateWordingFiles(filePath, "en");

    expect(spyReadFile).toHaveBeenCalledWith(path.join("tests/src/cucumber/step_definitions/cypress/base-check-engine.ts"), { encoding: "utf8" });
    expect(spyCompute).toHaveBeenCalled();
    expect(spyWrite).toHaveBeenCalled();
  });
});
