import React, { useState } from "react";
import { Button, Checkbox, Flex, Form, Input, Skeleton, Tooltip, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { ArchitectService } from "../service";
import { useAiServerUrl } from "../hooks/useAiServerUrl";
import { HelperService } from "../service/helper-service";
import { buildUuvGutter } from "../helper/result-display-helper";
import { Extension } from "@uiw/react-codemirror";
import { UuvAssistantResultCodeEditor } from "./result/UuvAssistantResultCodeEditor";
import { UuvAssistantResultToolbar } from "./result/UuvAssistantResultToolbar";

const { Title } = Typography;

interface UuvAssistantArchitectProps {
    onClose: () => void;
    getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
    helperService: HelperService;
}

export const UuvAssistantArchitect: React.FC<UuvAssistantArchitectProps> = ({ onClose, getAsideParentInHierarchy, helperService }) => {
    const [aiServerUrl] = useAiServerUrl();
    const [scenario, setScenario] = useState<string>("");
    const [showBrowser, setShowBrowser] = useState<boolean>(false);
    const [aiGeneratedScript, setAiGeneratedScript] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uuvGutter] = useState<Extension>(buildUuvGutter());
    const architectService = new ArchitectService();

    const handleGenerate = async () => {
        if (!scenario) {
            return;
        }
        setIsLoading(true);
        try {
            const targetUrl = window.location.href;
            const response = await architectService.generateNominalCase(aiServerUrl, scenario, targetUrl, !showBrowser);
            setAiGeneratedScript("Feature: Your amazing feature name" + response.result);
            console.log(response);
        } catch (error) {
            console.error("Failed to generate nominal case:", error);
            helperService.openNotification("topLeft", "An error occured", `Failed to generate nominal case: ${error?.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex id="uuvAssistantResultZone" vertical={true} justify="space-between">
            <div>
                <header>
                    <Flex justify="space-between" align="center">
                        <Title level={2}>Architect</Title>
                        <Tooltip placement="bottom" title="Close" getPopupContainer={triggerNode => getAsideParentInHierarchy(triggerNode)}>
                            <Button type="link" shape="circle" icon={<CloseOutlined />} className="primary" onClick={onClose} />
                        </Tooltip>
                    </Flex>
                </header>
                <div style={{ padding: "20px" }}>
                    <Form name="architect" size="large" onFinish={handleGenerate}>
                        <Form.Item
                            label="Scenario"
                            name="scenario"
                            rules={[
                                { required: true, message: "Please enter a scenario !" },
                                { min: 10, message: "Scenario description should be longer than 10 characters !" },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Describe a scenario to generate: « Verify homepage », ex: « Login into app with user1 and pwd1 » or « Add the first article into basket »"
                                value={scenario}
                                onChange={e => setScenario(e.target.value)}
                                rows={4}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Flex justify={"end"}>
                                <Checkbox onChange={e => setShowBrowser(e.target.checked)}>Show the automated browser</Checkbox>
                            </Flex>
                        </Form.Item>
                        <Form.Item>
                            <Flex justify={"end"}>
                                <Button type="primary" htmlType="submit" loading={isLoading}>
                                    Generate
                                </Button>
                            </Flex>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            {isLoading && (
                <div style={{ padding: "20px" }}>
                    <Skeleton active={true} />
                </div>
            )}
            {!isLoading && aiGeneratedScript && (
                <Flex vertical={true} id="nestedResult">
                    <header>
                        <Flex justify="space-between" align="center">
                            <Typography.Title level={3}>Generated Script</Typography.Title>
                        </Flex>
                    </header>
                    <UuvAssistantResultToolbar
                        generatedScript={aiGeneratedScript}
                        enableCopy={true}
                        getAsideParentInHierarchy={getAsideParentInHierarchy}
                    />
                    <UuvAssistantResultCodeEditor generatedScript={aiGeneratedScript} uuvGutter={uuvGutter} />
                </Flex>
            )}
        </Flex>
    );
};
