/**
 * Software Name : UUV
 *
 * SPDX-License-Identifier: MIT
 *
 * This software is distributed under the MIT License,
 * see the "LICENSE" file for more details
 *
 * Authors: NJAKO MOLOM Louis Fredice & SERVICAL Stanley
 * Software description: Make test writing fast, understandable by any human
 * understanding English or French.
 */

import React, { useEffect, useState } from "react";
import uuvLogoJson from "./assets/uuvLogo.json";
import mouseIcon from "./assets/mouse.json";
import keyboardIcon from "./assets/keyboard.json";
import formIcon from "./assets/form.json";
import {
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Layout,
  Menu,
  MenuProps,
  message,
  Spin,
  theme,
  Tooltip,
  Typography
} from "antd";
import { CloseOutlined, CopyOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { StyleProvider } from "@ant-design/cssinjs";
import { CssHelper } from "./helper/CssHelper";
import { FocusableElement } from "tabbable";

import CodeMirror, { EditorView, Extension, gutter } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { gherkin } from "@codemirror/legacy-modes/mode/gherkin";
import { githubDark } from "@uiw/codemirror-theme-github";

import * as KeyboardNavigationHelper from "./helper/KeyboardNavigationHelper";
import * as FormCompletionHelper from "./helper/FormCompletionHelper";
import { buildResultingScript, buildUuvGutter } from "./helper/ResultScriptHelper";
import { ActionEnum, AdditionalLayerEnum, KeyboardNavigationModeEnum, ResultSentence, VisibilityEnum } from "./Commons";
import * as LayerHelper from "./helper/LayerHelper";
import { SelectionHelper } from "./helper/SelectionHelper";
import { TranslateSentences } from "./translator/model";

const { Sider } = Layout;
const { Text } = Typography;
type MenuItem = Required<MenuProps>["items"][number];

type UuvAssistantProps = {
  translator?: (el: FocusableElement) => string;
  assistantRoot: ShadowRoot;
  assistantAdditionalLayersRoot: ShadowRoot;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
function UuvAssistant(props: UuvAssistantProps) {
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [disabledElement, setDisabledElement] = useState("");
  const [selectedAction, setSelectedAction] = useState(ActionEnum.NONE);
  const [displayedResult, setDisplayedResult] = useState(ActionEnum.NONE);
  const [visibility, setVisibility] = useState(VisibilityEnum.WITHOUT_RESULT);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uuvGutter, setUuvGutter] = useState<Extension>(gutter({}));
  const [currentKeyboardNavigation, setCurrentKeyboardNavigation] = useState<FocusableElement[]>([]);
  const [expectedKeyboardNavigation, setExpectedKeyboardNavigation] = useState<FocusableElement[]>([]);
  const [displayedKeyboardNavigation, setDisplayedKeyboardNavigation] = useState<KeyboardNavigationModeEnum>(KeyboardNavigationModeEnum.NONE);


  const selectionHelper = new SelectionHelper(onElementSelection, reset);

  useEffect(() => {
    return () => {
      reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUuvGutter(
     buildUuvGutter()
    );
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
        KeyboardNavigationHelper.getKeyboardNavigation().then(keyboardNavigation => {
          setExpectedKeyboardNavigation(keyboardNavigation.expected);
          setCurrentKeyboardNavigation(keyboardNavigation.current);
          setDisplayedKeyboardNavigation(KeyboardNavigationModeEnum.CURRENT_NAVIGATION);
          setVisibility(VisibilityEnum.WITH_RESULT);
          setDisplayedResult(ActionEnum.KEYBOARD_GLOBAL_NAVIGATION);
          setSelectedAction(ActionEnum.NONE);
        });
        break;
      case ActionEnum.FORM_COMPLETION_MOUSE:
        FormCompletionHelper.show(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.FORM_COMPLETION,
          [].slice.call(document.forms),
          buildFormCompletionResultSentence,
          reset
        );
        break;
      case ActionEnum.NONE:
      default:
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAction]);

  useEffect(() => {
    if (displayedKeyboardNavigation !== KeyboardNavigationModeEnum.NONE) {
      let keyboardNavigationElement;
      if (displayedKeyboardNavigation === KeyboardNavigationModeEnum.CURRENT_NAVIGATION) {
        KeyboardNavigationHelper.switchKeyboardLayer(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.CURRENT_NAVIGATION,
          currentKeyboardNavigation
        );
        keyboardNavigationElement = currentKeyboardNavigation;
      } else {
        KeyboardNavigationHelper.switchKeyboardLayer(
          props.assistantAdditionalLayersRoot,
          AdditionalLayerEnum.EXPECTED_NAVIGATION,
          expectedKeyboardNavigation
        );
        keyboardNavigationElement = expectedKeyboardNavigation;
      }
      KeyboardNavigationHelper.buildResultSentence(keyboardNavigationElement).then(resultSentences => {
        setGeneratedScript(
            buildResultingScript(
                "Your amazing feature name",
                "Keyboard Navigation",
                resultSentences.map(sentence => sentence.result)
            )
        );
        endLoading();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedKeyboardNavigation]);

  function onElementSelection(el: HTMLElement) {
    console.debug("customTranslator", props.translator);
    let translator;
    if (props.translator) {
      translator = Promise.resolve({ sentences: [props.translator(el)] } as TranslateSentences);
    } else {
      translator = selectionHelper.buildResultSentence(el, selectedAction as any, disabledElement !== "");
    }

    translator.then((translateSentences) => {
      setVisibility(VisibilityEnum.WITH_RESULT);
      const data = translateSentences.sentences.map((elem, key) => {
        return {
          key: key as React.Key,
          result: elem
        } as ResultSentence;
      });
      setGeneratedScript(
          buildResultingScript(
              "Your amazing feature name",
              `Action - ${selectedAction}`,
              data.map(sentence => sentence.result)
          )
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
        content: "Result copied to the clipboard"
      });
    }
  };

  async function buildFormCompletionResultSentence(selectedForm: HTMLFormElement) {
    const sentences = await FormCompletionHelper.buildResultSentence(selectedForm);
    setGeneratedScript(
      buildResultingScript(
          "Your amazing feature name",
          `Action - ${selectedAction}`,
          sentences
      )
    );
    clearAllAdditionalLayer();
    setVisibility(VisibilityEnum.WITH_RESULT);
    setDisplayedResult(ActionEnum.FORM_COMPLETION_MOUSE);
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

  function getItem(
   label: React.ReactNode,
   key: React.Key,
   disabled: boolean,
   onClick?: () => void,
   icon?: React.ReactNode,
   children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      disabled,
      children,
      label,
      onClick
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

  const actionMenuItems: MenuItem[] = [
    getItem(
      "Mouse actions",
      "mouse-actions",
      false,
      undefined,
        <div className={"menu-custom-svg-container"}>
          <img src={CssHelper.getBase64File(mouseIcon)} aria-hidden={true} alt="" className={"menu-custom-svg-from-black-to-white"}/>
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
        })
      ]
    ),
    getItem(
      "Keyboard actions",
      "keyboard-actions",
      false,
      undefined,
      <div className={"menu-custom-svg-container"}>
        <img src={CssHelper.getBase64File(keyboardIcon)} aria-hidden={true} alt="" className={"menu-custom-svg-from-black-to-white"}/>
      </div>,
      [
        getItem("Keyboard navigation", "KeybNav", false, () => {
          handleKeyboardNavigationChoice();
        })
      ]
    ),
    getItem(
      "Form actions",
      "form-actions",
      false,
      undefined,
      <div className={"menu-custom-svg-container"}>
        <img src={CssHelper.getBase64File(formIcon)} aria-hidden={true} alt="" className={"menu-custom-svg-from-black-to-white"}/>
      </div>,
      [
        getItem("Form completion with mouse", "FormCompletionMouse", false, () => {
          handleFormCompletionChoice();
        })
      ]
    )
  ];

  function endLoading() {
    setTimeout(() => setIsLoading(false), 100);
  }

  // function switchKeyboardNavigationMode({ target: { value } }: RadioChangeEvent): void {
  //   setIsLoading(true);
  //   setGeneratedScript("");
  //   setTimeout(() => setDisplayedKeyboardNavigation(value as KeyboardNavigationModeEnum));
  // }

  function getBottomButtonLabel() {
    return visibility === VisibilityEnum.WITH_RESULT ? "Close result view" : "Open result view";
  }

  function clearAllAdditionalLayer() {
    for (const additionalLayerKey in AdditionalLayerEnum) {
      const value = AdditionalLayerEnum[additionalLayerKey];
      LayerHelper.removeLayerToShadowDom(props.assistantAdditionalLayersRoot, value);
    }
  }

  return (
   <div id='uuvAssistantMenu'>
     <StyleProvider container={props.assistantRoot}>
       <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            fontSize: 18,
            zIndexBase: 9999999989,
            zIndexPopupBase: 9999999999
          }
        }}
       >
       {visibility === VisibilityEnum.WITH_RESULT ?
          <Flex id='uuvAssistantResultZone' vertical={true}>
            <header>
              <Flex justify={"space-between"} align={"center"}>
                <Typography.Title level={2}>Result of <span className={"secondary"}>{displayedResult.toString()}</span></Typography.Title>
                <Tooltip placement='bottom' title='Close' getPopupContainer={(triggerNode) => getAsideParentInHierarchy(triggerNode)}>
                  <Button type='link' shape='circle' icon={<CloseOutlined />} className='primary' onClick={() => {
                    clearAllAdditionalLayer();
                    setVisibility(VisibilityEnum.WITHOUT_RESULT);
                  }} />
                </Tooltip>
              </Flex>
            </header>
            <div id={"toolbar"}>
              <Flex justify={"space-between"} align={"center"}>
                <Tooltip placement='bottom' title='Copy' getPopupContainer={(triggerNode) => getAsideParentInHierarchy(triggerNode)}>
                  <Button type='link'
                          shape='circle'
                          icon={<CopyOutlined />}
                          className='primary'
                          disabled={generatedScript.length === 0}
                          onClick={copyResult}
                  />
                </Tooltip>
                {/*{displayedResult === ActionEnum.KEYBOARD_GLOBAL_NAVIGATION ?*/}
                {/*  <Radio.Group*/}
                {/*     options={[*/}
                {/*       { label: 'Current', title: "Current navigation", value: KeyboardNavigationModeEnum.CURRENT_NAVIGATION },*/}
                {/*       { label: 'Expected', title: "Navigation based on element position", value: KeyboardNavigationModeEnum.EXPECTED_NAVIGATION }*/}
                {/*     ]}*/}
                {/*     optionType="button"*/}
                {/*     buttonStyle="solid"*/}
                {/*     value={displayedKeyboardNavigation}*/}
                {/*     onChange={switchKeyboardNavigationMode}*/}
                {/*  />*/}
                {/*  : ""}*/}
              </Flex>
            </div>
            <CodeMirror
             readOnly={true}
             indentWithTab={true}
             value={generatedScript}
             height='100%'
             extensions={[
               StreamLanguage.define(gherkin),
               EditorView.lineWrapping,
               uuvGutter,
               EditorView.contentAttributes.of({ "aria-label": "Generated UUV Script" })
             ]}
             theme={githubDark}
             aria-label={"tot"}
            />
          </Flex>
          : ""}
         {visibility !== VisibilityEnum.HIDE ?
          <Sider
           reverseArrow={true}
           defaultCollapsed={true}
           id={"uuvAssistantMainBar"}
           onCollapse={(value) => {
             if (value) {
              setVisibility(VisibilityEnum.WITHOUT_RESULT);
             } else {
              setVisibility(VisibilityEnum.WITH_RESULT);
             }
           }}>
            <Flex align={"center"} vertical={true}>
              <Flex align={"center"} vertical={true} className={"uuvAssistantAvatarContainer"}>
                <Avatar className={"uuvAssistantAvatar"} size='large'>
                  <Tooltip placement='top' title='Go to steps definition'
                           getPopupContainer={(triggerNode) => getAsideParentInHierarchy(triggerNode)}>
                    <a href='https://e2e-test-quest.github.io/uuv/docs/category/description-of-sentences'>
                      <img
                       src={CssHelper.getBase64File(uuvLogoJson)}
                       alt='UUV logo'
                       className={"uuvAssistantIcon"}
                      />
                    </a>
                  </Tooltip>
                </Avatar>
                <Text className='uuvAssistantTitle'>UUV</Text>
              </Flex>
              <Divider />
                {!isLoading ?
                    <React.Fragment>
                      <Menu
                        mode="inline"
                        items={actionMenuItems}
                        getPopupContainer={(triggerNode) => getAsideParentInHierarchy(triggerNode)}
                      />
                      <Divider/>
                      <Tooltip placement="left" title={getBottomButtonLabel()}
                               getPopupContainer={(triggerNode) => getAsideParentInHierarchy(triggerNode)}>
                        <Button
                            size={"large"}
                            type={"link"}
                            block={true}
                            style={{ background: "#001529", bottom: 0 }}
                            icon={
                              visibility === VisibilityEnum.WITH_RESULT
                                ? <DoubleRightOutlined aria-hidden={true}/>
                                : <DoubleLeftOutlined aria-hidden={true}/>
                            }
                            onClick={() => setVisibility(
                                visibility === VisibilityEnum.WITH_RESULT ?
                                    VisibilityEnum.WITHOUT_RESULT :
                                    VisibilityEnum.WITH_RESULT
                            )}
                            aria-label={getBottomButtonLabel()}
                        />
                      </Tooltip>
                    </React.Fragment>
                : <Spin tip='Loading' size='large' spinning={isLoading} /> }
            </Flex>
          </Sider>
          : ""}
       </ConfigProvider>
     </StyleProvider>
   </div>
  );
}

export default UuvAssistant;
