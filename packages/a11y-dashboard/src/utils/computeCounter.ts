import type { Result, ResultCount } from "../models";
import { filterIssuesByType } from "./filterIssuesByType";

export function computeCounter(result: Result): ResultCount {
    return {
        error: filterIssuesByType(result.issues, 'error').length,
        warning: filterIssuesByType(result.issues, 'warning').length,
        notice: filterIssuesByType(result.issues, 'notice').length,
    };
}