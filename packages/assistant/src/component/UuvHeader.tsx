import React from "react";
import { Button, Flex, Tooltip, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface UuvHeaderProps {
  displayedResult: string;
  onClose: () => void;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvHeader: React.FC<UuvHeaderProps> = ({
  displayedResult,
  onClose,
  getAsideParentInHierarchy,
}) => (
  <header>
    <Flex justify="space-between" align="center">
      <Typography.Title level={2}>
        Result of <span className="secondary">{displayedResult}</span>
      </Typography.Title>
      <Tooltip
        placement="bottom"
        title="Close"
        getPopupContainer={(triggerNode) =>
          getAsideParentInHierarchy(triggerNode)
        }
      >
        <Button
          type="link"
          shape="circle"
          icon={<CloseOutlined />}
          className="primary"
          onClick={onClose}
        />
      </Tooltip>
    </Flex>
  </header>
);
