export const DEFAULT_DATE_FORMAT = 'ddd MMM DD YYYY - HH:mm:ssZ';

export type App = {
    id: string;
    name: string,
    description: string,
    usecases: Usecase[]
};

export type Usecase = {
    id: string;
    name: string,
    app: string,
    script: string,
    lastResult: Result
    lastResultCounter: ResultCount
};

export type ResultCount = {
    error: number,
    warning: number,
    notice: number
};

export type Result = {
    id: string;
    app: string,
    usecase: string,
    date: number,
    reference: A11yReferenceEnum,
    issues: AccessibilityIssue[];
};

export type RunnerExtras = {
    description: string;
    impact: IssueImpact;
    help: string;
    helpUrl: string;
};

export type AccessibilityIssue = {
    type: IssueType;
    code: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selector: any | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    domElement: any | null;
    runnerExtras: RunnerExtras;
};

export enum IssueImpact {
    Minor = 'minor',
    Moderate = 'moderate',
    Serious = 'serious',
    Critical = 'critical',
    Unknown = 'unknown'
}

export enum IssueType {
    Warning = 'warning',
    Error = 'error',
    Notice = 'notice'
}

export enum A11yReferenceEnum {
    RGAA = "RGAA",
    WCAG_WEB = "WCAG-WEB",
    WCAG_ANDROID = "WCAG-ANDROID",
    WCAG_IOS = "WCAG-IOS"
}
