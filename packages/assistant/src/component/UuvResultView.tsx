import React from "react";
import { Flex } from "antd";
import { UuvHeader } from "./UuvHeader";
import { UuvToolbar } from "./UuvToolbar";
import { UuvCodeEditor } from "./UuvCodeEditor";
import { Extension } from "@uiw/react-codemirror";

interface UuvResultViewProps {
  displayedResult: string;
  generatedScript: string;
  uuvGutter: Extension;
  copyResult: () => void;
  onClose: () => void;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvResultView: React.FC<UuvResultViewProps> = ({
  displayedResult,
  generatedScript,
  uuvGutter,
  copyResult,
  onClose,
  getAsideParentInHierarchy,
}) => (
  <Flex id="uuvAssistantResultZone" vertical={true}>
    <UuvHeader
      displayedResult={displayedResult}
      onClose={onClose}
      getAsideParentInHierarchy={getAsideParentInHierarchy}
    />
    <UuvToolbar
      generatedScript={generatedScript}
      copyResult={copyResult}
      getAsideParentInHierarchy={getAsideParentInHierarchy}
    />
    <UuvCodeEditor generatedScript={generatedScript} uuvGutter={uuvGutter} />
  </Flex>
);
