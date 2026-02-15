import React from "react";
import {
    Button,
    Divider,
    Flex,
    Form,
    Input,
    Switch,
    Tooltip,
    Typography,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { FieldType } from "../types/UuvTypes";

const { Title } = Typography;

interface UuvAssistantSettingsProps {
  intelligentHighlight: boolean;
  switchIntelligentHighlight: () => void;
  onClose: () => void;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
  aiServerUrl: string;
  setAiServerUrl: (newValue: string) => void
}

export const UuvAssistantSettings: React.FC<UuvAssistantSettingsProps> = ({
  intelligentHighlight,
  switchIntelligentHighlight,
  onClose,
  getAsideParentInHierarchy,
  aiServerUrl,
  setAiServerUrl
}) => {
  return (
    <Flex id="uuvAssistantResultZone" vertical={true}>
      <header>
        <Flex justify="space-between" align="center">
          <Title level={2}>Settings</Title>
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
      <div>
        <Flex justify="space-between" align="center">
          <Form
            name="basic"
            className="settings"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 50 }}
            style={{ maxWidth: 600 }}
            size="large"
            initialValues={{ remember: true }}
          >
              <Form.Item<FieldType>
                  label="Intelligent Highlighter"
                  labelAlign="left"
                  extra="This intelligent highlighter help you to find only informative elements"
              >
                  <Switch
                      title={`${intelligentHighlight ? "disable" : "active"} intelligent highlight`}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      checked={intelligentHighlight}
                      onClick={switchIntelligentHighlight}
                  />
              </Form.Item>
              <Divider></Divider>
              <Form.Item<FieldType>
                  label="AI Server URL"
                  labelAlign="left"
                  extra="Base URL of the AI server (default: http://localhost:8000)"
              >
                  <Input
                      value={aiServerUrl}
                      onChange={(e) => setAiServerUrl(e.target.value)}
                      placeholder="Enter AI server URL"
                  />
                  <p className="ant-input-hint"></p>
              </Form.Item>
          </Form>
        </Flex>
      </div>
    </Flex>
  );
};
