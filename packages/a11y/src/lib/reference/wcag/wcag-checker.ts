import { from, map, Observable } from "rxjs";
import { A11yChecker, A11yReferenceEnum, A11yResultStatus } from "../../model";
import { AccessibilityIssue, IssueType, UuvA11yResultUsecase, UuvA11yResultUsecaseLocation } from "../../model/uuv-a11y-result";
import axe from "axe-core";
import * as WcagHelper from "./wcag-helper";

export type WcagCheckerOptions = axe.RunOptions & {
    includedImpacts?: string[];
}

export class WcagChecker implements A11yChecker {
    protected constructor(readonly url: string, readonly options?: WcagCheckerOptions) { }

    validate(name: string, script: string, location: UuvA11yResultUsecaseLocation): Observable<UuvA11yResultUsecase> {
        return from(axe.run({
            ...this.options
        }))
            .pipe(
                map(axeResult => {
                    const violations = this.options?.includedImpacts ?
                        axeResult.violations.filter(issue => issue?.impact && this.options?.includedImpacts?.includes(issue.impact)) :
                        axeResult.violations;
                    let issues: AccessibilityIssue[] = [];
                    [
                        ...violations
                    ].forEach(violation => {
                        issues = issues.concat(WcagHelper.fromAxeToUvvA11yIssue(violation));
                    });
                    return {
                        name,
                        script,
                        location,
                        result: {
                            date: (new Date()).getTime(),
                            reference: A11yReferenceEnum.WCAG_WEB,
                            issues,
                            status: this.computeStatus(issues)
                        }
                    };
                })
            );
    }

    computeStatus(issues: AccessibilityIssue[]): A11yResultStatus {
        if (issues.find(issue => issue.type === IssueType.Error)) {
            return A11yResultStatus.ERROR;
        }
        return A11yResultStatus.SUCCESS;
    }

}
