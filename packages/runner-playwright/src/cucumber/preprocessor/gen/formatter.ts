/**
 * Helpers to format Playwright test file.
 */

import { PickleStepArgument } from "@cucumber/messages";

export function fileHeader(uri?: string) {
  // prettier-ignore
  return [
    `/** Generated from: ${uri} */`,
    "import { test } from \"@uuv/playwright\";",
    "",
  ];
}

export function suite(title: string, children: string[]) {
  // prettier-ignore
  return [
    `test.describe(${JSON.stringify(title)}, () => {`,
    "",
    ...children.map(indent),
    "});",
    "",
  ];
}

export function beforeEach(keywords: Set<string>, children: string[]) {
  const fixtures = [...keywords].join(", ");
  // prettier-ignore
  return [
    `test.beforeEach(async ({ ${fixtures} }) => {`,
    ...children.map(indent),
    "});",
    "",
  ];
}

export function test(title: string, keywords: Set<string>, children: string[]) {
  const fixtures = [...keywords].join(", ");
  // prettier-ignore
  return [
    `test(${JSON.stringify(title)}, async ({ ${fixtures} }) => {`,
    ...children.map(indent),
    "});",
    "",
  ];
}

export function step(keyword: string, text: string, argument?: PickleStepArgument) {
  const args = [text, argument]
    .filter(Boolean)
    .map((arg) => JSON.stringify(arg))
    .join(", ");
  return `await test.step('${keyword} ${text.replaceAll("'", "\\'")}', async () => {\n\t\tawait ${keyword}(${args});\n\t});`;
}

function indent(value: string) {
  return value ? `${"  "}${value}` : value;
}
