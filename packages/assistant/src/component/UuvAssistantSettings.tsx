import React from "react";
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Row,
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
}

export const UuvAssistantSettings: React.FC<UuvAssistantSettingsProps> = ({
  intelligentHighlight,
  switchIntelligentHighlight,
  onClose,
  getAsideParentInHierarchy,
}) => (
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
          labelCol={{ span: 20 }}
          wrapperCol={{ span: 50 }}
          style={{ maxWidth: 600 }}
          size="large"
          initialValues={{ remember: true }}
        >
          <Row>
            <Card
              size="small"
              className="settings"
              variant="borderless"
              title="General"
              style={{ width: "100%" }}
            >
              <Card.Meta
                title={
                  <Form.Item<FieldType>
                    label="Intelligent Highlighter"
                    labelAlign="left"
                    colon={false}
                  >
                    <Switch
                      title={`${intelligentHighlight ? "disable" : "active"} intelligent highlight`}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      checked={intelligentHighlight}
                      onClick={switchIntelligentHighlight}
                    />
                  </Form.Item>
                }
                description={
                  <span>
                    This intelligent highlighter help you to find only
                    informative elements
                  </span>
                }
              />
            </Card>
            <Divider />
          </Row>
        </Form>
      </Flex>
    </div>
  </Flex>
);
