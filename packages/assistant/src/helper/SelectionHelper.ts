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


import { FocusableElement } from "tabbable";
import { TranslateSentences } from "../translator/model";
import { ActionEnum, UUV_DISABLED_CLASS } from "../Commons";
import { Translator } from "../translator/abstract-translator";
import { ClickTranslator } from "../translator/click-translator";
import { ExpectTranslator } from "../translator/expect-translator";
import { WithinTranslator } from "../translator/within-translator";
import { TypeTranslator } from "../translator/type-translator";
import { HighLightHelper } from "./highlight/HighlightHelper";

export class SelectionHelper {
  private onReset!: () => void;
  private highLightHelper: HighLightHelper;
  private intelligentHighlight: boolean;
  constructor(
    onSelect: (el: HTMLElement) => void,
    onReset: () => void,
    intelligentHighlight: boolean
  ) {
    this.highLightHelper = new HighLightHelper(onSelect);
    this.onReset = onReset;
    this.intelligentHighlight = intelligentHighlight;
  }

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.onReset();
      this.highLightHelper.cancel();
      this.revertDisabledField();
      document.removeEventListener("keydown", this.onKeyDown);
    }
  };

  public startSelect(enableDisabledField: boolean) {
    if (enableDisabledField) {
      this.enableDisabledField();
    }
    document.addEventListener("keydown", this.onKeyDown);

    if (this.intelligentHighlight) {
      this.highLightHelper.enableRefinedHighlight()
    } else {
      this.highLightHelper.enableBasicHighlight();
    }
  }

  public async buildResultSentence(
    el: FocusableElement,
    action:
      | ActionEnum.EXPECT
      | ActionEnum.CLICK
      | ActionEnum.WITHIN
      | ActionEnum.TYPE,
    isDisabled: boolean,
  ): Promise<TranslateSentences> {
    let translator: Translator;
    switch (action) {
      case ActionEnum.WITHIN:
        translator = new WithinTranslator();
        break;
      case ActionEnum.EXPECT:
        translator = new ExpectTranslator();
        break;
      case ActionEnum.CLICK:
        translator = new ClickTranslator();
        break;
      case ActionEnum.TYPE:
        translator = new TypeTranslator();
        break;
    }
    return translator.translate(el);
  }

  private enableDisabledField() {
    const disabledElement = document.querySelectorAll(":disabled");
    disabledElement.forEach((elem) => {
      elem.className = `${elem.className} ${UUV_DISABLED_CLASS}`;
      elem.removeAttribute("disabled");
    });
  }

  private revertDisabledField() {
    const disabledElement = document.querySelectorAll(`.${UUV_DISABLED_CLASS}`);
    disabledElement.forEach((elem) => {
      elem.className = elem.className.replaceAll(UUV_DISABLED_CLASS, "");
      elem.setAttribute("disabled", "true");
    });
  }

}
