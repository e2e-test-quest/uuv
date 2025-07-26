export type UuvAssistantProps = {
  translator?: (el: FocusableElement) => string;
  assistantRoot: ShadowRoot;
  assistantAdditionalLayersRoot: ShadowRoot;
}

export type FieldType = {
  intelligentHighlight?: boolean;
};
