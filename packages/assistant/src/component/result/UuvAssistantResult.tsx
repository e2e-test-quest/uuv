import React from "react";
import { Flex } from "antd";
import { UuvAssistantResultHeader } from "./UuvAssistantResultHeader";
import { UuvAssistantResultToolbar } from "./UuvAssistantResultToolbar";
import { UuvAssistantResultCodeEditor } from "./UuvAssistantResultCodeEditor";
import { Extension } from "@uiw/react-codemirror";

interface UuvAssistantResultProps {
  displayedResult: string;
  generatedScript: string;
  uuvGutter: Extension;
  copyResult: () => void;
  onClose: () => void;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAssistantResult: React.FC<UuvAssistantResultProps> = ({
  displayedResult,
  generatedScript,
  uuvGutter,
  copyResult,
  onClose,
  getAsideParentInHierarchy,
}) => (
  <Flex id="uuvAssistantResultZone" vertical={true}>
    <UuvAssistantResultHeader
      displayedResult={displayedResult}
      onClose={onClose}
      getAsideParentInHierarchy={getAsideParentInHierarchy}
    />
    <UuvAssistantResultToolbar
      generatedScript={generatedScript}
      copyResult={copyResult}
      getAsideParentInHierarchy={getAsideParentInHierarchy}
    />
    <UuvAssistantResultCodeEditor generatedScript={generatedScript} uuvGutter={uuvGutter} />
  </Flex>
);
