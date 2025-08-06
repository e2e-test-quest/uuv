import React from "react";
import { Menu, MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

interface UuvAssistantSidebarMenuProps {
  actionMenuItems: MenuItem[];
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAssistantSidebarMenu: React.FC<UuvAssistantSidebarMenuProps> = ({
  actionMenuItems,
  getAsideParentInHierarchy,
}) => (
  <Menu
    mode="inline"
    id={"uuv-action-menu"}
    items={actionMenuItems}
    getPopupContainer={(triggerNode) => getAsideParentInHierarchy(triggerNode)}
  />
);
