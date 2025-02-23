import {
    UUVEvent,
    UUVEventTestFailed,
    UUVEventTestFinished,
    UUVEventTestIgnored,
    UUVEventTestStarted,
    UUVEventTestSuiteFinished,
    UUVEventTestSuiteStarted,
    UUVEventType,
    UUV_IPC_SERVER_NAME
} from "../model";

/**
 * Listener that write teamcity log
 */
export class TeamCityUUVEventListener {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ipc = require("node-ipc").default;
        ipc.config.id = "uuvIpcTeamcity";
        ipc.config.retry = 1500;
        ipc.config.silent = true;

        ipc.connectTo(UUV_IPC_SERVER_NAME, () => {
            ipc.of[UUV_IPC_SERVER_NAME].on("connect", () => {
                console.log("Teamcity connected to UUV Server");
            });
            ipc.of[UUV_IPC_SERVER_NAME].on("message", (message: UUVEvent) => {
                let data;
                switch (message.type) {
                    case UUVEventType.PROGRESS_START:
                        this.logTeamCity("##teamcity[progressStart 'Running UUV Tests']");
                        break;
                    case UUVEventType.TEST_SUITE_STARTED:
                        data = message.data as UUVEventTestSuiteStarted;
                        this.logTeamCity(`##teamcity[testSuiteStarted ${this.teamcityAddName(data.testSuiteName)} ${this.teamcityFlowId(data.testSuiteName)}  ${this.teamcityAddCustomField("locationHint", "suite://" + data.testSuitelocation)} ]`);
                        break;
                    case UUVEventType.TEST_STARTED:
                        data = message.data as UUVEventTestStarted;
                        this.logTeamCity(`##teamcity[testStarted ${this.teamcityAddName(data.testName)} ${this.teamcityFlowIdAndParentFlowId(data.testName, data.testSuiteName)} ${this.teamcityAddCustomField("locationHint", "test://" + data.testSuitelocation)} ]`);
                        break;
                    case UUVEventType.TEST_FINISHED:
                        data = message.data as UUVEventTestFinished;
                        // eslint-disable-next-line max-len
                        this.logTeamCity(`##teamcity[testFinished ${this.teamcityAddName(data.testName)} ${this.teamcityFlowIdAndParentFlowId(data.testName, data.testSuiteName)} ${this.teamcityAddDuration(data.duration)} ]`);
                        break;
                    case UUVEventType.TEST_FAILED:
                        data = message.data as UUVEventTestFailed;
                        // eslint-disable-next-line max-len
                        this.logTeamCity(`##teamcity[testFailed ${this.teamcityAddName(data.testName)} ${this.teamcityFlowIdAndParentFlowId(data.testName, data.testSuiteName)} type='comparisonFailure' message='Test failed' ]`);
                        // eslint-disable-next-line max-len
                        this.logTeamCity(`##teamcity[testFinished ${this.teamcityAddName(data.testName)} ${this.teamcityFlowIdAndParentFlowId(data.testName, data.testSuiteName)} ${this.teamcityAddDuration(data.duration)} ]`);
                        break;
                    case UUVEventType.TEST_IGNORED:
                        data = message.data as UUVEventTestIgnored;
                        // eslint-disable-next-line max-len
                        this.logTeamCity(`##teamcity[testIgnored ${this.teamcityAddName(data.testName)} ${this.teamcityFlowIdAndParentFlowId(data.testName, data.testSuiteName)} ]`);
                        break;
                    case UUVEventType.TEST_SUITE_FINISHED:
                        data = message.data as UUVEventTestSuiteFinished;
                        // eslint-disable-next-line max-len
                        this.logTeamCity(`##teamcity[testSuiteFinished ${this.teamcityAddName(data.testSuiteName)} ${this.teamcityFlowId(data.testSuiteName)}]`);
                        break;
                    case UUVEventType.PROGRESS_FINISH:
                        this.logTeamCity("##teamcity[progressFinish 'Running UUV Tests']");
                        break;
                }
            });
        });
    }

    logTeamCity(line) {
        console.log(line);
    }

    teamcityFlowId(name) {
        return "flowId='" + name.replaceAll("'", "|'") + "'";
    }

    teamcityFlowIdAndParentFlowId(name, parentName) {
        return "flowId='" + name.replaceAll("'", "|'") + "' parent='" + parentName.replaceAll("'", "|'") + "'";
    }

    teamcityAddName(name) {
        return "name='" + name.replaceAll("'", "|'") + "'";
    }

    teamcityAddDuration(duration) {
        return `duration='${duration}'`;
    }

    teamcityAddCustomField(fieldName, value) {
        return `${fieldName}='${value}'`;
    }
}
