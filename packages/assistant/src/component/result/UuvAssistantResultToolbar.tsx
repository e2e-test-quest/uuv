import React from "react";
import { Button, Flex, Tooltip } from "antd";
import { BulbOutlined, CopyOutlined } from "@ant-design/icons";

interface UuvAssistantResultToolbarProps {
  generatedScript: string;
  copyResult: () => void;
  onAiClick: () => void;
  selectedElement: HTMLElement | undefined;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAssistantResultToolbar: React.FC<UuvAssistantResultToolbarProps> = ({
  generatedScript,
  copyResult,
  onAiClick,
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
              title="AI analysis"
              getPopupContainer={(triggerNode) =>
                  getAsideParentInHierarchy(triggerNode)
              }
          >
            <Button
                type="link"
                shape="circle"
                icon={<BulbOutlined />}
                className="primary"
                onClick={onAiClick}
            />
          </Tooltip>
      }
    </Flex>
  </div>
);
