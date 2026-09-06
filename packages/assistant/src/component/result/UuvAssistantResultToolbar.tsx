import React from "react";
import { Button, Flex, message, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { CssHelper } from "../../helper/css-helper";
import aiIcon from "../../assets/ai.json";
import chatbotAiIcon from "../../assets/chatbot-ai.json";

interface UuvAssistantResultToolbarProps {
  generatedScript: string;
  enableCopy: boolean;
  onAiUnifiedClick: () => void;
  onAiStepByStepClick: () => void;
  selectedElement: HTMLElement | undefined;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

const copyResult = (generatedScript: string) => {
    if (generatedScript.length > 0) {
        navigator.clipboard.writeText(generatedScript);
        message.success({
            content: "Result copied to the clipboard",
        });
    }
};

export const UuvAssistantResultToolbar: React.FC<UuvAssistantResultToolbarProps> = ({
    generatedScript,
    enableCopy,
    onAiUnifiedClick,
    onAiStepByStepClick,
    selectedElement,
    getAsideParentInHierarchy,
}) => (
    <div id="toolbar">
        <Flex justify={"start"} align={"center"} gap={20}>
            { enableCopy &&
                <Tooltip placement="bottom" title="Copy" getPopupContainer={triggerNode => getAsideParentInHierarchy(triggerNode)}>
                    <Button
                        type="link"
                        shape="circle"
                        icon={<CopyOutlined />}
                        className="primary"
                        disabled={generatedScript.length === 0}
                        onClick={() => copyResult(generatedScript)}
                    />
                </Tooltip>
            }
            {selectedElement instanceof HTMLImageElement && (
                <Tooltip placement="bottom" title="Unified AI analysis" getPopupContainer={triggerNode => getAsideParentInHierarchy(triggerNode)}>
                    <Button type="link" shape="circle" className="primary" onClick={onAiUnifiedClick}>
                        <img src={CssHelper.getBase64File(aiIcon)} alt={""} className={"aiIcon"} />
                    </Button>
                </Tooltip>
            )}
            {selectedElement instanceof HTMLImageElement && (
                <Tooltip
                    placement="bottom"
                    title="Step by step AI analysis"
                    getPopupContainer={triggerNode => getAsideParentInHierarchy(triggerNode)}
                >
                    <Button type="link" shape="circle" className="primary" onClick={onAiStepByStepClick}>
                        <img src={CssHelper.getBase64File(chatbotAiIcon)} alt={""} className={"aiIcon"} />
                    </Button>
                </Tooltip>
            )}
        </Flex>
    </div>
);
