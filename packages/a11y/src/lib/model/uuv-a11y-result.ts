import { A11yReferenceEnum } from "./reference";
import { A11yResultStatus } from "./result";

export enum IssueType {
    Warning = "warning",
    Error = "error",
    Notice = "notice"
}

export type UuvA11yResultApp = {
    name: string;
    description: string;
    usecases: UuvA11yResultUsecase[];
}

export type UuvA11yResultUsecase = {
    name: string;
    script: string;
    location: UuvA11yResultUsecaseLocation;
    result: UuvA11yResultExecution;
}

export type UuvA11yResultUsecaseLocation = {
    file: string;
    line: number;
    column: number;
}

export type UuvA11yResultExecution = {
    date: number;
    reference: A11yReferenceEnum;
    issues: AccessibilityIssue[];
    status: A11yResultStatus;
    rawResult?: any;
}

export type AccessibilityIssue = {
    type: IssueType;
    code: string;
    message: string;
    selector: string;
    htmlElement?: Element | null;
    runnerExtras: RunnerExtras | any;
}

export type RunnerExtras = {
    description: string;
    impact: IssueImpact;
    help: string;
    helpUrl: string;
}

export enum IssueImpact {
    Minor = "minor",
    Moderate = "moderate",
    Serious = "serious",
    Critical = "critical",
    Unknown = "unknown"
}

export type UuvA11yResult = {
    app: UuvA11yResultApp;
}
