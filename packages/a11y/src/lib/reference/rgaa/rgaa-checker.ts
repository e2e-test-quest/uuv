import { Observable } from "rxjs";
import { Engine } from "../../engine/engine";
import { A11Y_RGAA_REFERENCE } from "./rgaa-reference";
import { A11yChecklistChecker } from "../../model/checklist-checker";

export class RgaaChecker extends A11yChecklistChecker {
    emitter: Observable<boolean> = new Observable();

    constructor(url: string, enabledRules?: string[]) {
        super(url, new Engine(url, A11Y_RGAA_REFERENCE), A11Y_RGAA_REFERENCE);
        if (enabledRules) {
            this.focusOnEnabledRules(enabledRules);
        }
    }

    private focusOnEnabledRules(enabledRules: string[]) {
        this.reference.rules = this.reference.rules.filter(rule => enabledRules?.includes(rule.criterion));
    }

    override rules() {
        return [...this.reference.rules].sort((a, b) => {
            if (a.check > b.check) {
                return 1;
            }
            if (a.check < b.check) {
                return -1;
            }
            return 0;
        });
    }
}
