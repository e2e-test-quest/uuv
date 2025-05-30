import type { AccessibilityIssue } from "../models";

export function filterIssuesByType(issues: AccessibilityIssue[], type: string): AccessibilityIssue[] {
    return issues.filter(issue => issue.type === type);
}
