import React, {useEffect, useState} from "react";
import uuvLogoJson from "./assets/uuvLogo.json";
import mouseIcon from "./assets/mouse.json";
import keyboardIcon from "./assets/keyboard.json";
import formIcon from "./assets/form.json";
import datatableIcon from "./assets/datatable.json";
import modalIcon from "./assets/modal.json";
import {ConfigProvider, MenuProps, message, theme} from "antd";
import {StyleProvider} from "@ant-design/cssinjs";
import {CssHelper} from "./helper/CssHelper";
import {FocusableElement} from "tabbable";
import {Extension, gutter} from "@uiw/react-codemirror";
import {buildResultingScript, buildUuvGutter,} from "./helper/ResultScriptHelper";
import {
  ActionEnum,
  AdditionalLayerEnum,
  KeyboardNavigationModeEnum,
  PENDING_VALUE,
  ResultSentence,
  UuvAssistantResultAIAnalysisType,
  VisibilityEnum,
} from "./Commons";
import * as LayerHelper from "./helper/LayerHelper";
import {SelectionHelper} from "./helper/SelectionHelper";
import {TranslateSentences} from "./translator/model";
import {UuvAssistantResult} from "./component/result/UuvAssistantResult";
import {UuvAssistantSettings} from "./component/UuvAssistantSettings";
import {UuvAssistantSidebar} from "./component/sidebar/UuvAssistantSidebar";
import {UuvAssistantProps} from "./types/UuvTypes";
import {GroupOutlined} from "@ant-design/icons";
import * as KeyboardNavigationHelper from "./helper/KeyboardNavigationHelper";
import {DialogService} from "./service/DialogService";
import {TableAndGridService} from "./service/TableAndGridService";
import {FormCompletionService} from "./service/FormCompletionService";
import {Translator} from "./translator/abstract-translator";
import {InformativeNodesHelper} from "./helper/InformativeNodesHelper";

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
  const [selectedElement, setSelectedElement] = useState<HTMLElement | undefined>(undefined);
  const [aiResult, setAiResult] = useState<UuvAssistantResultAIAnalysisType | undefined>(undefined);

  const selectionHelper = new SelectionHelper(
    onElementSelection,
    reset,
    intelligentHighlight,
  );

  const dialogService = new DialogService();
  const tableAndGridService = new TableAndGridService();
  const formCompletionService = new FormCompletionService();

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
        setSelectedElement(undefined);
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
        formCompletionService.show(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.FORM_COMPLETION,
          [].slice.call(document.forms),
          buildFormCompletionResultSentence,
          reset,
        );
        break;
      case ActionEnum.TABLE_AND_GRID_EXPECT:
        tableAndGridService.show(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.ARRAY_COMPLETION,
          [].slice.call(
            document.querySelectorAll(
              "table, [role=table], [role=grid], [role=treegrid]",
            ),
          ),
          buildTableAndGridExpectResultSentence,
          reset,
        );
        break;
      case ActionEnum.DIALOG_EXPECT:
        dialogService.show(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.DIALOG_COMPLETION,
          [].slice.call(document.querySelectorAll("dialog, [role=dialog]")),
          buildDialogExpectResultSentence,
            () => {
              reset();
              Array.from(document.getElementsByClassName(dialogService.TRACKED_CLASS))
                .forEach(el => el.remove());
              },
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
      setSelectedElement(el);
      setAiResult(undefined);
      setSelectedAction(ActionEnum.NONE);
      endLoading();
    });
  }

  function reset() {
    setSelectedElement(undefined);
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

  const callAIForImage = async (imgElement: HTMLImageElement) => {
    try {
      let currentValue: UuvAssistantResultAIAnalysisType | undefined = {
        is_decorative: PENDING_VALUE,
        confidence: PENDING_VALUE,
        image_description: PENDING_VALUE,
        analysis_details: PENDING_VALUE
      };
      setAiResult(currentValue);

      const start = Date.now();
      const response = await fetch(imgElement.src);
      const imageBlob = await response.blob();
      const { htmlContext, parentElement } = new InformativeNodesHelper().extractContextForElement(imgElement);
      const cssSelector = parentElement ?
          Translator.getSelector(imgElement).replace(Translator.getSelector(parentElement) + " > ", "") :
          Translator.getSelector(imgElement);

      const formData = new FormData();
      formData.append("html_content", htmlContext);
      formData.append("target_img", imageBlob, "random_img.jpg");
      formData.append("css_selector", cssSelector);

      const uploadResponse = await fetch("http://localhost:5000/api/v1/image/classify", {
        method: "POST",
        body: formData
      });

      const reader = uploadResponse.body?.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      if (reader) {
        while (true) {
          const {done, value} = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, {stream: true});

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              try {
                currentValue = JSON.parse(line);
              } catch (e) {
                console.error('Erreur parsing JSON:', e);
                currentValue = undefined;
              }
            }
          }

          setAiResult(currentValue);
        }

        setAiResult({
          ...currentValue as any,
          duration: (Date.now() - start) / 1000
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setAiResult(undefined);
    }
  };

  const switchIntelligentHighlight = () => {
    clearAllAdditionalLayer();
    setIntelligentHighlight(!intelligentHighlight);
  };

  async function buildFormCompletionResultSentence(
    selectedForm: HTMLElement,
  ) {
    const sentences =
      await formCompletionService.buildResultSentence(selectedForm);
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
      await tableAndGridService.buildResultSentence(selectedArray);
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

  async function buildDialogExpectResultSentence(
    selectedArray: HTMLTableElement | HTMLElement,
  ) {
      Array.from(document.getElementsByClassName(dialogService.TRACKED_CLASS))
          .forEach(el => el.remove());
    const sentences = await dialogService.buildResultSentence(selectedArray);
    setGeneratedScript(
      buildResultingScript(
        "Your amazing feature name",
        `Action - ${selectedAction}`,
        sentences,
      ),
    );
    clearAllAdditionalLayer();
    setVisibility(VisibilityEnum.WITH_RESULT);
    setDisplayedResult(ActionEnum.DIALOG_EXPECT);
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

  function handleDialog() {
    setVisibility(VisibilityEnum.HIDE);
    setIsLoading(true);
    setSelectedAction(ActionEnum.DIALOG_EXPECT);
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
        alt={""}
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
    ]
  );

  const keyboardActions = getItem(
    "Keyboard actions",
    "keyboard-actions",
    false,
    undefined,
    <div className={"menu-custom-svg-container"}>
      <img
        src={CssHelper.getBase64File(keyboardIcon)}
        alt={""}
        className={"menu-custom-svg-from-black-to-white"}
      />
    </div>,
    [
      getItem("Keyboard navigation", "KeybNav", false, () => {
        handleKeyboardNavigationChoice();
      }),
    ]
  );


  const componentActions = getItem(
    "Components actions",
    "components-actions",
    false,
    undefined,
    <div id={"component-menu"} className={"menu-custom-svg-container"}>
      <GroupOutlined aria-label={""} className={"menu-native-svg-from-black-to-white"} />
    </div>,
    [
      getItem(
        <div className={"menu-custom-svg-container submenu"}>
          <img
            src={CssHelper.getBase64File(formIcon)}
            alt={""}
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
            alt={""}
          />
          <span>Table and Grid Expect</span>
        </div>,
        "TableAndGridExpected",
        false,
        () => {
          handleTableAndGridChoice();
        },
      ),
      getItem(
        <div className={"menu-custom-svg-container submenu"}>
          <img
            src={CssHelper.getBase64File(modalIcon)}
            className={"menu-custom-svg-from-black-to-white submenu"}
            alt={""}
          />
          <span>Dialog Expect (Experimental)</span>
        </div>,
        "DialogExpected",
        false,
        () => {
          handleDialog();
        },
      ),
    ],
  );

  const actionMenuItems: MenuItem[] = [
    mouseActions,
    keyboardActions,
    componentActions,
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
            <UuvAssistantResult
              displayedResult={displayedResult.toString()}
              generatedScript={generatedScript}
              uuvGutter={uuvGutter}
              copyResult={copyResult}
              onClose={handleCloseView}
              onAiClick={() => callAIForImage(selectedElement as HTMLImageElement)}
              selectedElement={selectedElement}
              aiResult={aiResult}
              getAsideParentInHierarchy={getAsideParentInHierarchy}
            />
          )}

          {visibility === VisibilityEnum.SETTINGS && (
            <UuvAssistantSettings
              intelligentHighlight={intelligentHighlight}
              switchIntelligentHighlight={switchIntelligentHighlight}
              onClose={handleCloseView}
              getAsideParentInHierarchy={getAsideParentInHierarchy}
            />
          )}

          {visibility !== VisibilityEnum.HIDE && (
            <UuvAssistantSidebar
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
