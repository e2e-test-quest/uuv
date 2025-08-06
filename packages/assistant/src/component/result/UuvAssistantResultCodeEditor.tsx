import React from "react";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { gherkin } from "@codemirror/legacy-modes/mode/gherkin";
import { githubDark } from "@uiw/codemirror-theme-github";

interface UuvAssistantResultCodeEditorProps {
  generatedScript: string;
  uuvGutter: Extension;
}

export const UuvAssistantResultCodeEditor: React.FC<UuvAssistantResultCodeEditorProps> = ({
  generatedScript,
  uuvGutter,
}) => (
  <CodeMirror
    readOnly={true}
    indentWithTab={true}
    value={generatedScript}
    height="100%"
    extensions={[
      StreamLanguage.define(gherkin),
      EditorView.lineWrapping,
      uuvGutter,
      EditorView.contentAttributes.of({
        "aria-label": "Generated UUV Script",
      }),
    ]}
    theme={githubDark}
    aria-label="Generated UUV Script"
  />
);
