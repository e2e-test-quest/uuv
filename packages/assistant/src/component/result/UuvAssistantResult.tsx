import React from "react";
import { Flex } from "antd";
import { UuvAssistantResultHeader } from "./UuvAssistantResultHeader";
import { UuvAssistantResultToolbar } from "./UuvAssistantResultToolbar";
import { UuvAssistantResultCodeEditor } from "./UuvAssistantResultCodeEditor";
import { Extension } from "@uiw/react-codemirror";
import { UuvAssistantResultAIAnalysis } from "./UuvAssistantResultAIAnalysis";

interface UuvAssistantResultProps {
  displayedResult: string;
  generatedScript: string;
  uuvGutter: Extension;
  copyResult: () => void;
  onClose: () => void;
  onAiClick: () => void;
  selectedElement: HTMLElement | undefined;
  aiResult: any | "pending" | undefined;
  getAsideParentInHierarchy: (triggerNode: HTMLElement) => HTMLElement;
}

export const UuvAssistantResult: React.FC<UuvAssistantResultProps> = ({
  displayedResult,
  generatedScript,
  uuvGutter,
  copyResult,
  onClose,
  onAiClick,
  selectedElement,
  aiResult,
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
      onAiClick={onAiClick}
      selectedElement={selectedElement}
      getAsideParentInHierarchy={getAsideParentInHierarchy}
    />
    <UuvAssistantResultCodeEditor generatedScript={generatedScript} uuvGutter={uuvGutter} />
    { aiResult != undefined && <UuvAssistantResultAIAnalysis aiResult={aiResult} /> }
  </Flex>
);
