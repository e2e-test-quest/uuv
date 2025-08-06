import React from "react";
import { Button, Flex, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";

interface UuvAssistantResultToolbarProps {
  generatedScript: string;
  copyResult: () => void;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAssistantResultToolbar: React.FC<UuvAssistantResultToolbarProps> = ({
  generatedScript,
  copyResult,
  getAsideParentInHierarchy,
}) => (
  <div id="toolbar">
    <Flex justify="space-between" align="center">
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
    </Flex>
  </div>
);
