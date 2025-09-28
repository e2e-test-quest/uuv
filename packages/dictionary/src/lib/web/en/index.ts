import { Dictionary } from "../../dictionary";
import { default as enSentences } from "./en.json";
import { default as enBasedRoleSentences } from "./en-enriched-wordings.json";
import { EN_ROLES } from "./en-roles";

export class EnDictionary extends Dictionary {
    protected override baseSentences = enSentences;
    protected override roleBasedSentencesTemplate = enBasedRoleSentences.enriched;
    protected override roles = EN_ROLES;
}

export { EN_ROLES } from "./en-roles";

export { default as enSentences } from "./en.json";

export { default as enBasedRoleSentences } from "./en-enriched-wordings.json";
