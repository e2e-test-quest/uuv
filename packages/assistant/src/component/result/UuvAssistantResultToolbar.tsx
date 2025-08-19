import React from "react";
import { Button, Flex, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import {CssHelper} from "../../helper/CssHelper";
import aiIcon from "../../assets/ai.json";
import chatbotAiIcon from "../../assets/chatbot-ai.json";

interface UuvAssistantResultToolbarProps {
  generatedScript: string;
  copyResult: () => void;
  onAiUnifiedClick: () => void;
  onAiStepByStepClick: () => void;
  selectedElement: HTMLElement | undefined;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAssistantResultToolbar: React.FC<UuvAssistantResultToolbarProps> = ({
  generatedScript,
  copyResult,
  onAiUnifiedClick,
  onAiStepByStepClick,
  selectedElement,
  getAsideParentInHierarchy,
}) => (
  <div id="toolbar">
    <Flex justify={"start"} align={"center"} gap={20}>
      <Tooltip
        placement="bottom"
        title="Copy"
        getPopupContainer={(triggerNode) =>
          getAsideParentInHierarchy(triggerNode)
        }
      >
        <Button
          type="link"
          shape="circle"
          icon={<CopyOutlined />}
          className="primary"
          disabled={generatedScript.length === 0}
          onClick={copyResult}
        />
      </Tooltip>
      { selectedElement instanceof HTMLImageElement &&
          <Tooltip
              placement="bottom"
              title="Unified AI analysis"
              getPopupContainer={(triggerNode) =>
                  getAsideParentInHierarchy(triggerNode)
              }
          >
            <Button
                type="link"
                shape="circle"
                className="primary"
                onClick={onAiUnifiedClick}
            ><img
                src={CssHelper.getBase64File(aiIcon)}
                alt={""}
                className={"aiIcon"}
            /></Button>
          </Tooltip>
      }
      { selectedElement instanceof HTMLImageElement &&
          <Tooltip
              placement="bottom"
              title="Step by step AI analysis"
              getPopupContainer={(triggerNode) =>
                  getAsideParentInHierarchy(triggerNode)
              }
          >
            <Button
                type="link"
                shape="circle"
                className="primary"
                onClick={onAiStepByStepClick}
            ><img
                src={CssHelper.getBase64File(chatbotAiIcon)}
                alt={""}
                className={"aiIcon"}
            /></Button>
          </Tooltip>
      }
    </Flex>
  </div>
);
