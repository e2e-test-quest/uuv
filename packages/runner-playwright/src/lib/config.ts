import { defineBddConfig } from "playwright-bdd";

export function buildConfig(
    features: string[],
    steps = [
        "../node_modules/@uuv/playwright/dist/cucumber/preprocessor/index.js",
        "cucumber/step_definitions/**/*.{js,ts}",
        "../node_modules/@uuv/playwright/dist/cucumber/step_definitions/playwright/**/*.js"
    ],
    output = ".uuv-features-gen",
    featuresRoot: "uuv/e2e") {
    return defineBddConfig({
        features: features,
        steps: steps,
        outputDir: output,
        featuresRoot: featuresRoot
    });
}
