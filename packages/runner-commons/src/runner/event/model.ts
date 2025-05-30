export const UUV_IPC_SERVER_NAME = "uuvIpcServer";
export const UUV_IPC_PUBLISHER = "uuvIpcPublisher";

export type UUVEvent = {
    type: UUVEventType;
    data: UUVEventProgressStart |
        UUVEventTestSuiteStarted |
        UUVEventTestStarted |
        UUVEventTestFinished |
        UUVEventTestFailed |
        UUVEventTestIgnored |
        UUVEventTestSuiteFinished |
        UUVEventProgressFinish;
}

export enum UUVEventType {
    PROGRESS_START = "progressStart",
    TEST_SUITE_STARTED = "testSuiteStarted",
    TEST_STARTED = "testStarted",
    TEST_FINISHED = "testFinished",
    TEST_FAILED = "testFailed",
    TEST_IGNORED = "testIgnored",
    TEST_SUITE_FINISHED = "testSuiteFinished",
    PROGRESS_FINISH = "progressFinish",
}

export type UUVEventProgressStart = object;

export type UUVEventTestSuiteStarted = {
    testSuiteName: string;
    testSuitelocation: string;
}

export type UUVEventTestStarted = {
    testName: string;
    testSuiteName: string;
    testSuitelocation: string;
}

export type UUVEventTestFinished = {
    testName: string;
    testSuiteName: string;
    duration: number;
}

export type UUVEventTestFailed = {
    testName: string;
    testSuiteName: string;
    duration: number;
}

export type UUVEventTestIgnored = {
    testName: string;
    testSuiteName: string;
    duration?: number;
}

export type UUVEventTestSuiteFinished = {
    testSuiteName: string;
}

export type UUVEventProgressFinish = object
