import React from "react";

export const UUV_ASSISTANT_BAR_WIDTH = 60;

export type ResultSentence = {
  key: React.Key;
  result: string
}

export class Suggestion {
  constructor(public accessibleAttribute: string = "", public accessibleValue = "", public code = "", public sentenceAfterCorrection: string[] = []) {
  }
}

export enum VisibilityEnum {
  HIDE = "hide", WITH_RESULT = "withResult", WITHOUT_RESULT = "withoutResult", SETTINGS = "settings",
}

export enum ActionEnum {
  NONE = "No action",
  WITHIN = "Within",
  EXPECT = "Expect",
  CLICK = "Click",
  TYPE = "Type",
  KEYBOARD_GLOBAL_NAVIGATION = "Keyboard Navigation",
  FORM_COMPLETION_MOUSE = "Form Mouse Completion",
  TABLE_AND_GRID_EXPECT = "Table and Grid Expect",
  DIALOG_EXPECT = "Dialog Expect",
  FORM_COMPLETION_KEYBOARD = "Form Keyboard Completion",
  RECORD = "Record"
}

export enum KeyboardNavigationModeEnum {
  NONE = "No navigation",
  CURRENT_NAVIGATION = "currentNavigation",
  EXPECTED_NAVIGATION = "expectedNavigation",
}

export enum AdditionalLayerEnum {
  CURRENT_NAVIGATION = "keyboard-layer-current-navigation",
  EXPECTED_NAVIGATION = "keyboard-layer-expected-navigation",
  FORM_COMPLETION = "form-layer-completion",
  DIALOG_COMPLETION = "dialog-layer-completion",
  ARRAY_COMPLETION = "array-layer-completion",
}

export const UUV_DISABLED_CLASS = "uuv-is-disabled";

export const PENDING_VALUE = "pending";

export type UuvAssistantResultAIAnalysisType = {
  mode: AIAnalysisModeEnum,
  available_image_descriptions?: string[] | typeof PENDING_VALUE;
  onDescriptionSelected?: (selectedImageDescription: string) => void;
  is_decorative: boolean | typeof PENDING_VALUE;
  confidence: number | typeof PENDING_VALUE;
  image_description: string | typeof PENDING_VALUE;
  analysis_details: string | typeof PENDING_VALUE;
  duration?: number;
}

export enum AIAnalysisModeEnum {
  UNIFIED,
  STEP_BY_STEP,
}
