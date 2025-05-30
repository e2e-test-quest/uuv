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


import Inspector from "inspector-dom";
import { FocusableElement } from "tabbable";
import { TranslateSentences } from "../translator/model";
import { ActionEnum, UUV_DISABLED_CLASS } from "../Commons";
import { Translator } from "../translator/abstract-translator";
import { ClickTranslator } from "../translator/click-translator";
import { ExpectTranslator } from "../translator/expect-translator";
import { WithinTranslator } from "../translator/within-translator";
import { TypeTranslator } from "../translator/type-translator";

export class SelectionHelper {
    private inspector!: Inspector;
    private onReset!: () => void;

    constructor(onSelect: (el: HTMLElement) => void, onReset: () => void) {
        this.inspector = Inspector({
            root: "body",
            outlineStyle: "2px solid red",
            onClick: (el: HTMLElement) => {
                this.inspector.cancel();
                onSelect(el);
                this.revertDisabledField();
            }
        });
        this.onReset = onReset;
    }

    public startSelect(enableDisabledField: boolean) {
        if (enableDisabledField) {
            this.enableDisabledField();
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                this.onReset();
                this.inspector.cancel();
                document.removeEventListener("keydown", onKeyDown);
                this.revertDisabledField();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        this.inspector.enable();
    }

    public async buildResultSentence(
        el: FocusableElement,
        action: ActionEnum.EXPECT | ActionEnum.CLICK | ActionEnum.WITHIN  | ActionEnum.TYPE,
        isDisabled: boolean
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
        disabledElement.forEach(elem => {
            elem.className = `${elem.className} ${UUV_DISABLED_CLASS}`;
            elem.removeAttribute("disabled");
        });
    }

    private revertDisabledField() {
        const disabledElement = document.querySelectorAll(`.${UUV_DISABLED_CLASS}`);
        disabledElement.forEach(elem => {
            elem.className = elem.className.replaceAll(UUV_DISABLED_CLASS, "");
            elem.setAttribute("disabled", "true");
        });
    }
}
