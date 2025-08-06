import React from "react";
import { Button, Divider, Flex, Layout, MenuProps, Spin, Tooltip } from "antd";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { VisibilityEnum } from "../../Commons";
import { UuvAssistantSidebarAvatar } from "./UuvAssistantSidebarAvatar";
import { UuvAssistantSidebarMenu } from "./UuvAssistantSidebarMenu";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

interface UuvAssistantSidebarProps {
  visibility: VisibilityEnum;
  isLoading: boolean;
  uuvLogoJson: any;
  actionMenuItems: MenuItem[];
  switchShowSettings: () => void;
  getBottomButtonLabel: () => string;
  onVisibilityChange: (newVisibility: VisibilityEnum) => void;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAssistantSidebar: React.FC<UuvAssistantSidebarProps> = ({
  visibility,
  isLoading,
  uuvLogoJson,
  actionMenuItems,
  switchShowSettings,
  getBottomButtonLabel,
  onVisibilityChange,
  getAsideParentInHierarchy,
}) => (
  <Sider
    reverseArrow={true}
    defaultCollapsed={true}
    id="uuvAssistantMainBar"
    onCollapse={(value) => {
      if (value) {
        onVisibilityChange(VisibilityEnum.WITHOUT_RESULT);
      } else {
        onVisibilityChange(VisibilityEnum.WITH_RESULT);
      }
    }}
  >
    <Flex align="center" vertical={true}>
      <UuvAssistantSidebarAvatar
        uuvLogoJson={uuvLogoJson}
        getAsideParentInHierarchy={getAsideParentInHierarchy}
      />
      <Divider />
      {!isLoading ? (
        <React.Fragment>
          <UuvAssistantSidebarMenu
            actionMenuItems={actionMenuItems}
            getAsideParentInHierarchy={getAsideParentInHierarchy}
          />
          <Divider />
          <Tooltip
            placement="bottom"
            title={`${visibility === VisibilityEnum.SETTINGS ? "Close" : "Open"} settings module`}
            getPopupContainer={(triggerNode) =>
              getAsideParentInHierarchy(triggerNode)
            }
          >
            <Button
              type={visibility === VisibilityEnum.SETTINGS ? "primary" : "link"}
              onClick={switchShowSettings}
              icon={<SettingOutlined className="primary"/>}
              shape="circle"
              className="primary"
              aria-pressed={visibility === VisibilityEnum.SETTINGS}
            />
          </Tooltip>
          <Divider />
          <Tooltip
            placement="left"
            title={getBottomButtonLabel()}
            getPopupContainer={(triggerNode) =>
              getAsideParentInHierarchy(triggerNode)
            }
          >
            <Button
              size="large"
              type="link"
              block={true}
              style={{ background: "#001529", bottom: 0 }}
              icon={
                visibility === VisibilityEnum.WITH_RESULT ? (
                  <DoubleRightOutlined aria-hidden={true} />
                ) : (
                  <DoubleLeftOutlined aria-hidden={true} />
                )
              }
              onClick={() =>
                onVisibilityChange(
                  visibility === VisibilityEnum.WITH_RESULT
                    ? VisibilityEnum.WITHOUT_RESULT
                    : VisibilityEnum.WITH_RESULT,
                )
              }
              aria-label={getBottomButtonLabel()}
            />
          </Tooltip>
        </React.Fragment>
      ) : (
        <Spin tip="Loading" size="large" spinning={isLoading} />
      )}
    </Flex>
  </Sider>
);
