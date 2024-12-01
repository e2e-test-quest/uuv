import { A11yReference, A11yReferenceEnum } from "./reference";
import { forkJoin, map, Observable, tap } from "rxjs";
import { A11yResult, A11yRuleResult } from "./result";
import { A11yRule } from "./rule";
import { Engine } from "../engine/engine";
import { A11yChecker } from "./checker";
import { IssueType, UuvA11yResultUsecase, UuvA11yResultUsecaseLocation } from "./uuv-a11y-result";

export abstract class A11yChecklistChecker implements A11yChecker {
    protected constructor(readonly url: string, readonly engine: Engine, readonly reference: A11yReference) {
    }

    abstract rules(): A11yRule[];

    validate(name: string, script: string, location: UuvA11yResultUsecaseLocation): Observable<UuvA11yResultUsecase> {
        const result = new A11yResult(this.url, this.reference);
        const rules: Array<A11yRule> = this.rules();
        const checkList = this.buildCheckList(rules);
        return forkJoin(checkList)
            .pipe(
                map((ruleResults) => {
                    result.ruleResults = ruleResults;
                    result.computeStatus();
                    const issues = ruleResults.map(ruleResult => {
                        return {
                            type: IssueType.Error,
                            code: ruleResult.rule.id,
                            message: ruleResult.rule.description || "",
                            selector: ruleResult.getErrorNodes().map(error => error.selector).join(", "),
                            runnerExtras: {
                                rule: ruleResult.rule,
                                validations: ruleResult.validations,
                                errorNodes: ruleResult.getErrorNodes()
                            }
                        };
                    });
                    return {
                        name,
                        script,
                        location,
                        result: {
                            date: (new Date()).getTime(),
                            reference: A11yReferenceEnum.WCAG_WEB,
                            issues,
                            rawResult: result,
                            status: result.status
                        },
                    };
                }),
                tap(result => {
                    console.debug("result");
                    console.debug(result);
                })
            );
    }

    private buildCheckList(rules: Array<A11yRule>): Observable<A11yRuleResult>[] {
        const checkList: Observable<A11yRuleResult>[] = [];
        rules.forEach(rule => checkList.push(this.engine.buildCheckListItemFromRule(rule)));
        return checkList;
    }
}
