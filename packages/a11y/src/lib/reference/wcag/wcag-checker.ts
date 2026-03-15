import { from, map, Observable } from "rxjs";
import { A11yChecker, A11yReferenceEnum, A11yResultStatus } from "../../model";
import { AccessibilityIssue, IssueType, UuvA11yResultUsecase, UuvA11yResultUsecaseLocation } from "../../model/uuv-a11y-result";
import axe, { ElementContext } from "axe-core";
import * as WcagHelper from "./wcag-helper";

export type WcagCheckerAxeCoreOptions = axe.RunOptions & {
    includedImpacts?: string[];
}

export type WcagCheckerConfig = axe.RunOptions & {
    context?: ElementContext;
    options: WcagCheckerAxeCoreOptions;
}

export class WcagChecker implements A11yChecker {
    protected constructor(readonly url: string, readonly config: WcagCheckerConfig = { options: {} }) { }

    validate(name: string, script: string, location: UuvA11yResultUsecaseLocation): Observable<UuvA11yResultUsecase> {
        const execution = this.config?.context ?
                            axe.run(
                                this.config.context!,
                                this.config.options as axe.RunOptions
                            ) :
                            axe.run(
                                this.config.options
                            );

        return from(execution)
            .pipe(
                map(axeResult => {
                    const violations = this.config?.options?.includedImpacts ?
                        axeResult.violations.filter(issue => issue?.impact && this.config?.options?.includedImpacts?.includes(issue.impact)) :
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
