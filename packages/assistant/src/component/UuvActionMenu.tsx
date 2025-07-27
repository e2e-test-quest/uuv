import React from "react";
import { Menu, MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

interface UuvActionMenuProps {
  actionMenuItems: MenuItem[];
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvActionMenu: React.FC<UuvActionMenuProps> = ({
  actionMenuItems,
  getAsideParentInHierarchy,
}) => (
  <Menu
    mode="inline"
    items={actionMenuItems}
    getPopupContainer={(triggerNode) => getAsideParentInHierarchy(triggerNode)}
  />
);
