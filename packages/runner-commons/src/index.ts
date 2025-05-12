export * from "./step-definition-generator/common";
export * from "./step-definition-generator/generate-step-definitions";
export * from "./step-definition-generator/generate-step-definitions-documentation";
import key from "./assets/i18n/web/template.json";
export { key };
export { AccessibleRole } from "./step-definition-generator/accessible-role";
export * from "./assets/i18n/web/en";
export * from "./cli";

import { KEY_PRESS } from "./step-definition-generator/common";
import { DEFAULT_TIMEOUT } from "./runner/step-definitions/_constant";
import { IContext } from "./runner/step-definitions/_i-context";
