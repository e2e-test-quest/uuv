import React from "react";
import { Avatar, Flex, Tooltip, Typography } from "antd";
import { CssHelper } from "../helper/CssHelper";

interface AvatarProps {
  uuvLogoJson: any;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAvatar: React.FC<AvatarProps> = ({
  uuvLogoJson,
  getAsideParentInHierarchy,
}) => (
  <Flex align="center" vertical={true} className="uuvAssistantAvatarContainer">
    <Avatar className="uuvAssistantAvatar" size="large">
      <Tooltip
        placement="top"
        title="Go to steps definition"
        getPopupContainer={(triggerNode) =>
          getAsideParentInHierarchy(triggerNode)
        }
      >
        <a href="https://e2e-test-quest.github.io/uuv/docs/category/description-of-sentences">
          <img
            src={CssHelper.getBase64File(uuvLogoJson)}
            alt="UUV logo"
            className="uuvAssistantIcon"
          />
        </a>
      </Tooltip>
    </Avatar>
    <Typography.Text className="uuvAssistantTitle">UUV</Typography.Text>
  </Flex>
);
