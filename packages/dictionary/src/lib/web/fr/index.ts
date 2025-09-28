import { Dictionary } from "../../dictionary";
import { default as frSentences } from "./fr.json";
import { default as frBasedRoleSentences } from "./fr-enriched-wordings.json";
import { FR_ROLES } from "./fr-roles";

export class FrDictionary extends Dictionary {
    protected override baseSentences = frSentences;
    protected override roleBasedSentencesTemplate = frBasedRoleSentences.enriched;
    protected override roles = FR_ROLES;
}
