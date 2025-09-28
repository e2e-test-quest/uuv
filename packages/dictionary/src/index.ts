import { Dictionary, LANG } from "./lib/dictionary";
import { FrDictionary } from "./lib/web/fr";
import { EnDictionary } from "./lib/web/en";

export * from "./lib/dictionary";
export * from "./lib/accessible-role";
export * from "./lib/web";
export * from "./lib/web/en";
export * from "./lib/web/fr";

export function getDefinedDictionary(lang: string): Dictionary {
    switch (lang) {
        case LANG.FR.toString():
            return new FrDictionary();
        default:
            return new EnDictionary();
    }
}
