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
import { Translator } from "../translator/abstract-translator";
import { TypeTranslator } from "../translator/type-translator";
import { ClickTranslator } from "../translator/click-translator";
import { getRole } from "dom-accessibility-api";
import { AbstractComponentService } from "./abstract-component-service";

export class FormCompletionService extends AbstractComponentService {

  private typeTranslator: Translator = new TypeTranslator();
  private clickTranslator: Translator = new ClickTranslator();

  async buildResultSentence(
    selectedForm: HTMLElement
  ): Promise<string[]> {
    const elementsForCompletion: FocusableElement[] = [].slice.call(selectedForm.getElementsByTagName("input"));
    elementsForCompletion.push(...[].slice.call(selectedForm.getElementsByTagName("button")));
    const sentences: string[] = [];
    let foundSubmitButton = false;
    const promises = elementsForCompletion
      .filter(element => !this.isDisabled(element) && !this.isHidden(element))
      .map(async formElement => {
        if (!this.isButton(formElement) || (this.isSubmitButton(formElement) && !foundSubmitButton)) {
          let translator = this.typeTranslator;
          if (this.isSubmitButton(formElement)) {
            translator = this.clickTranslator;
            foundSubmitButton = true;
          }
          const result = await translator.translate(formElement);
          sentences.push(...result.sentences);
        }
        return Promise.resolve("");
      });
    await Promise.all(promises);
    return sentences;
  }

  isButton(element: FocusableElement): boolean {
    return getRole(element) === "button";
  }

  isSubmitButton(element: FocusableElement): boolean {
    return this.isButton(element) && element.getAttribute("type") === "submit";
  }

  isDisabled(element: FocusableElement): boolean {
    return (element as HTMLInputElement).disabled;
  }
  isHidden(element: FocusableElement): boolean {
    return (element as HTMLInputElement).type === "hidden";
  }
}
