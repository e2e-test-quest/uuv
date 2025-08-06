import React, { useEffect, useState } from "react";
import uuvLogoJson from "./assets/uuvLogo.json";
import mouseIcon from "./assets/mouse.json";
import keyboardIcon from "./assets/keyboard.json";
import formIcon from "./assets/form.json";
import datatableIcon from "./assets/datatable.json";
import modalIcon from "./assets/modal.json";
import { ConfigProvider, MenuProps, message, theme } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { CssHelper } from "./helper/CssHelper";
import { FocusableElement } from "tabbable";
import { Extension, gutter } from "@uiw/react-codemirror";
import * as KeyboardNavigationHelper from "./helper/KeyboardNavigationHelper";
import * as FormCompletionHelper from "./helper/FormCompletionHelper";
import * as TableAndGridHelper from "./helper/TableAndGridHelper";
import {
  buildResultingScript,
  buildUuvGutter,
} from "./helper/ResultScriptHelper";
import {
  ActionEnum,
  AdditionalLayerEnum,
  KeyboardNavigationModeEnum,
  ResultSentence,
  VisibilityEnum,
} from "./Commons";
import * as LayerHelper from "./helper/LayerHelper";
import { SelectionHelper } from "./helper/SelectionHelper";
import { TranslateSentences } from "./translator/model";
import { UuvResultView } from "./components/UuvResultView";
import { UuvSettings } from "./components/UuvSettings";
import { UuvSidebar } from "./components/UuvSidebar";
import { UuvAssistantProps } from "./types/UuvTypes";
import { CloseOutlined, GroupOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

function UuvAssistant(props: UuvAssistantProps) {
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [disabledElement, setDisabledElement] = useState("");
  const [selectedAction, setSelectedAction] = useState(ActionEnum.NONE);
  const [displayedResult, setDisplayedResult] = useState(ActionEnum.NONE);
  const [visibility, setVisibility] = useState(VisibilityEnum.WITHOUT_RESULT);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uuvGutter, setUuvGutter] = useState<Extension>(gutter({}));
  const [currentKeyboardNavigation, setCurrentKeyboardNavigation] = useState<
    FocusableElement[]
  >([]);
  const [expectedKeyboardNavigation, setExpectedKeyboardNavigation] = useState<
    FocusableElement[]
  >([]);
  const [displayedKeyboardNavigation, setDisplayedKeyboardNavigation] =
    useState<KeyboardNavigationModeEnum>(KeyboardNavigationModeEnum.NONE);
  const [intelligentHighlight, setIntelligentHighlight] =
    useState<boolean>(true);

  const selectionHelper = new SelectionHelper(
    onElementSelection,
    reset,
    intelligentHighlight,
  );

  // Fonction pour nettoyer toutes les couches additionnelles
  function clearAllAdditionalLayer() {
    for (const additionalLayerKey in AdditionalLayerEnum) {
      const value =
        AdditionalLayerEnum[
          additionalLayerKey as keyof typeof AdditionalLayerEnum
        ];
      LayerHelper.removeLayerToShadowDom(
        props.assistantAdditionalLayersRoot,
        value,
      );
    }
  }

  // Fonction utilitaire pour fermer les vues
  const handleCloseView = () => {
    clearAllAdditionalLayer();
    setVisibility(VisibilityEnum.WITHOUT_RESULT);
  };

  // Toutes les autres fonctions du composant original
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    setUuvGutter(buildUuvGutter());
  }, [generatedScript]);

  useEffect(() => {
    clearAllAdditionalLayer();
    switch (selectedAction) {
      case ActionEnum.WITHIN:
      case ActionEnum.EXPECT:
      case ActionEnum.CLICK:
        selectionHelper.startSelect(true);
        break;
      case ActionEnum.TYPE:
        selectionHelper.startSelect(false);
        break;
      case ActionEnum.KEYBOARD_GLOBAL_NAVIGATION:
        setDisplayedKeyboardNavigation(KeyboardNavigationModeEnum.NONE);
        KeyboardNavigationHelper.getKeyboardNavigation().then(
          (keyboardNavigation) => {
            setExpectedKeyboardNavigation(keyboardNavigation.expected);
            setCurrentKeyboardNavigation(keyboardNavigation.current);
            setDisplayedKeyboardNavigation(
              KeyboardNavigationModeEnum.CURRENT_NAVIGATION,
            );
            setVisibility(VisibilityEnum.WITH_RESULT);
            setDisplayedResult(ActionEnum.KEYBOARD_GLOBAL_NAVIGATION);
            setSelectedAction(ActionEnum.NONE);
          },
        );
        break;
      case ActionEnum.FORM_COMPLETION_MOUSE:
        FormCompletionHelper.show(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.FORM_COMPLETION,
          [].slice.call(document.forms),
          buildFormCompletionResultSentence,
          reset,
        );
        break;
      case ActionEnum.TABLE_AND_GRID_EXPECT:
        TableAndGridHelper.show(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.ARRAY_COMPLETION,
          [].slice.call(
            document.querySelectorAll("table, [role=grid], [role=treegrid]"),
          ),
          buildTableAndGridExpectResultSentence,
          reset,
        );
        break;
      case ActionEnum.NONE:
      default:
        break;
    }
  }, [selectedAction]);

  useEffect(() => {
    if (displayedKeyboardNavigation !== KeyboardNavigationModeEnum.NONE) {
      let keyboardNavigationElement;
      if (
        displayedKeyboardNavigation ===
        KeyboardNavigationModeEnum.CURRENT_NAVIGATION
      ) {
        KeyboardNavigationHelper.switchKeyboardLayer(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.CURRENT_NAVIGATION,
          currentKeyboardNavigation,
        );
        keyboardNavigationElement = currentKeyboardNavigation;
      } else {
        KeyboardNavigationHelper.switchKeyboardLayer(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.EXPECTED_NAVIGATION,
          expectedKeyboardNavigation,
        );
        keyboardNavigationElement = expectedKeyboardNavigation;
      }
      KeyboardNavigationHelper.buildResultSentence(
        keyboardNavigationElement,
      ).then((resultSentences) => {
        setGeneratedScript(
          buildResultingScript(
            "Your amazing feature name",
            "Keyboard Navigation",
            resultSentences.map((sentence) => sentence.result),
          ),
        );
        endLoading();
      });
    }
  }, [displayedKeyboardNavigation]);

  function onElementSelection(el: HTMLElement) {
    console.debug("customTranslator", props.translator);
    let translator;
    if (props.translator) {
      translator = Promise.resolve({
        sentences: [props.translator(el)],
      } as TranslateSentences);
    } else {
      translator = selectionHelper.buildResultSentence(
        el,
        selectedAction as any,
        disabledElement !== "",
      );
    }

    translator.then((translateSentences) => {
      setVisibility(VisibilityEnum.WITH_RESULT);
      const data = translateSentences.sentences.map((elem, key) => {
        return {
          key: key as React.Key,
          result: elem,
        } as ResultSentence;
      });
      setGeneratedScript(
        buildResultingScript(
          "Your amazing feature name",
          `Action - ${selectedAction}`,
          data.map((sentence) => sentence.result),
        ),
      );
      setDisplayedResult(selectedAction);
      setSelectedAction(ActionEnum.NONE);
      endLoading();
    });
  }

  function reset() {
    setDisplayedResult(selectedAction);
    setSelectedAction(ActionEnum.NONE);
    setDisabledElement("");
    setIsDark(true);
    setVisibility(VisibilityEnum.WITHOUT_RESULT);
    endLoading();
  }

  const copyResult = () => {
    if (generatedScript.length > 0) {
      navigator.clipboard.writeText(generatedScript);
      message.success({
        content: "Result copied to the clipboard",
      });
    }
  };

  const switchIntelligentHighlight = () => {
    clearAllAdditionalLayer();
    setIntelligentHighlight(!intelligentHighlight);
  };

  async function buildFormCompletionResultSentence(
    selectedForm: HTMLFormElement,
  ) {
    const sentences =
      await FormCompletionHelper.buildResultSentence(selectedForm);
    setGeneratedScript(
      buildResultingScript(
        "Your amazing feature name",
        `Action - ${selectedAction}`,
        sentences,
      ),
    );
    clearAllAdditionalLayer();
    setVisibility(VisibilityEnum.WITH_RESULT);
    setDisplayedResult(ActionEnum.FORM_COMPLETION_MOUSE);
    setSelectedAction(ActionEnum.NONE);
    endLoading();
  }

  async function buildTableAndGridExpectResultSentence(
    selectedArray: HTMLTableElement | HTMLElement,
  ) {
    const sentences =
      await TableAndGridHelper.buildResultSentence(selectedArray);
    setGeneratedScript(
      buildResultingScript(
        "Your amazing feature name",
        `Action - ${selectedAction}`,
        sentences,
      ),
    );
    clearAllAdditionalLayer();
    setVisibility(VisibilityEnum.WITH_RESULT);
    setDisplayedResult(ActionEnum.TABLE_AND_GRID_EXPECT);
    setSelectedAction(ActionEnum.NONE);
    endLoading();
  }

  const handleMouseNavigationChoice = (newValue: ActionEnum) => {
    setVisibility(VisibilityEnum.HIDE);
    setIsLoading(true);
    setSelectedAction(newValue);
  };

  function handleKeyboardNavigationChoice() {
    setIsLoading(true);
    setDisplayedKeyboardNavigation(KeyboardNavigationModeEnum.NONE);
    setSelectedAction(ActionEnum.KEYBOARD_GLOBAL_NAVIGATION);
  }

  function handleFormCompletionChoice() {
    setVisibility(VisibilityEnum.HIDE);
    setIsLoading(true);
    setSelectedAction(ActionEnum.FORM_COMPLETION_MOUSE);
  }

  function handleTableAndGridChoice() {
    setVisibility(VisibilityEnum.HIDE);
    setIsLoading(true);
    setSelectedAction(ActionEnum.TABLE_AND_GRID_EXPECT);
  }

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    disabled: boolean,
    onClick?: () => void,
    icon?: React.ReactNode,
    children?: MenuItem[],
    onTitleClick?: () => void,
  ): MenuItem {
    return {
      key,
      icon,
      disabled,
      children,
      label,
      onClick,
      onTitleClick,
    } as MenuItem;
  }

  function getAsideParentInHierarchy(triggerNode: HTMLElement) {
    let parent = triggerNode.parentElement;
    while (parent !== null) {
      if (parent.id === "uuvAssistantMenu") {
        return parent;
      }
      parent = parent.parentElement;
    }
    return document.body;
  }

  const switchShowSettings = () => {
    if (visibility === VisibilityEnum.SETTINGS) {
      setVisibility(VisibilityEnum.WITHOUT_RESULT);
    } else {
      setVisibility(VisibilityEnum.SETTINGS);
    }
  };

  const mouseActions = getItem(
    "Mouse actions",
    "mouse-actions",
    false,
    undefined,
    <div className={"menu-custom-svg-container"}>
      <img
        src={CssHelper.getBase64File(mouseIcon)}
        alt={"mouse selection"}
        className={"menu-custom-svg-from-black-to-white"}
      />
    </div>,
    [
      getItem(ActionEnum.EXPECT.toString(), ActionEnum.EXPECT, false, () => {
        handleMouseNavigationChoice(ActionEnum.EXPECT);
      }),
      getItem(ActionEnum.CLICK.toString(), ActionEnum.CLICK, false, () => {
        handleMouseNavigationChoice(ActionEnum.CLICK);
      }),
      getItem(ActionEnum.WITHIN.toString(), ActionEnum.WITHIN, false, () => {
        handleMouseNavigationChoice(ActionEnum.WITHIN);
      }),
      getItem(ActionEnum.TYPE.toString(), ActionEnum.TYPE, false, () => {
        handleMouseNavigationChoice(ActionEnum.TYPE);
      }),
    ],
    () => handleMouseNavigationChoice(ActionEnum.EXPECT),
  );
  const keyboardActions = getItem(
    "Keyboard actions",
    "keyboard-actions",
    false,
    undefined,
    <div className={"menu-custom-svg-container"}>
      <img
        src={CssHelper.getBase64File(keyboardIcon)}
        alt={"keyboard selection"}
        className={"menu-custom-svg-from-black-to-white"}
      />
    </div>,
    [
      getItem("Keyboard navigation", "KeybNav", false, () => {
        handleKeyboardNavigationChoice();
      }),
    ],
    () => handleKeyboardNavigationChoice(),
  );

  const componentActions = getItem(
    "Components",
    "components",
    false,
    undefined,
    <div className={"menu-custom-svg-container"}>
      <GroupOutlined />
    </div>,
    [
      getItem(
        <div className={"menu-custom-svg-container submenu"}>
          <img
            src={CssHelper.getBase64File(formIcon)}
            alt={"array selection"}
            className={"menu-custom-svg-from-black-to-white submenu"}
          />
          <span>Form completion (mouse)</span>
        </div>,
        "FormCompletionMouse",
        false,
        () => {
          handleFormCompletionChoice();
        },
      ),
      getItem(
        <div className={"menu-custom-svg-container submenu"}>
          <img
            src={CssHelper.getBase64File(datatableIcon)}
            className={"menu-custom-svg-from-black-to-white submenu"}
            alt={"array selection"}
          />
          <span>Table and Grid Expect</span>
        </div>, "TableAndGridExpected", false, () => {
        handleTableAndGridChoice();
      })
    ]
  );

  const actionMenuItems: MenuItem[] = [
    mouseActions,
    keyboardActions,
    componentActions
  ];

  function endLoading() {
    setTimeout(() => setIsLoading(false), 100);
  }

  function getBottomButtonLabel() {
    return visibility === VisibilityEnum.WITH_RESULT
      ? "Close result view"
      : "Open result view";
  }

  return (
    <div id="uuvAssistantMenu">
      <StyleProvider container={props.assistantRoot}>
        <ConfigProvider
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              fontSize: 18,
              zIndexBase: 9999999989,
              zIndexPopupBase: 9999999999,
            },
          }}
        >
          {visibility === VisibilityEnum.WITH_RESULT && (
            <UuvResultView
              displayedResult={displayedResult.toString()}
              generatedScript={generatedScript}
              uuvGutter={uuvGutter}
              copyResult={copyResult}
              onClose={handleCloseView}
              getAsideParentInHierarchy={getAsideParentInHierarchy}
            />
          )}

          {visibility === VisibilityEnum.SETTINGS && (
            <UuvSettings
              intelligentHighlight={intelligentHighlight}
              switchIntelligentHighlight={switchIntelligentHighlight}
              onClose={handleCloseView}
              getAsideParentInHierarchy={getAsideParentInHierarchy}
            />
          )}

          {visibility !== VisibilityEnum.HIDE && (
            <UuvSidebar
              visibility={visibility}
              isLoading={isLoading}
              uuvLogoJson={uuvLogoJson}
              actionMenuItems={actionMenuItems}
              switchShowSettings={switchShowSettings}
              getBottomButtonLabel={getBottomButtonLabel}
              onVisibilityChange={setVisibility}
              getAsideParentInHierarchy={getAsideParentInHierarchy}
            />
          )}
        </ConfigProvider>
      </StyleProvider>
    </div>
  );
}

export default UuvAssistant;
