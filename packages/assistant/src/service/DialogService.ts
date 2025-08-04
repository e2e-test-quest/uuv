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

import { AdditionalLayerEnum } from "../Commons";
import { InformativeNodesHelper } from "../helper/InformativeNodesHelper";
import { AbstractComponentService } from "./AbstractComponentService";

export class DialogService extends AbstractComponentService {
    TRACKED_CLASS = "uuv-dialog-clone";
    show(dom: ShadowRoot, layer: AdditionalLayerEnum, elements: HTMLElement[], onSelect: (el: HTMLElement) => void, onReset: () => void) {
        const clones: HTMLElement[] = [];
        let currentTop = 0;
        elements.forEach((dialog, index) => {
            const clone = document.createElement("div");
            this.clone(clone, dialog);
            this.overrideStyles(currentTop, dialog, clone);
            const onClick = () => {
                onSelect(clone);
                clone.removeEventListener("click", onClick);
                document.body.removeChild(clone);
                Array.from(document.getElementsByClassName(this.TRACKED_CLASS)).forEach(el => el.remove());
            };
            clone.addEventListener("click", onClick);
            document.body.appendChild(clone);
            clones.push(clone);
        });
        super.show(dom, layer, clones, onSelect, onReset);
    }

    private overrideStyles(currentTop: number, dialog: HTMLElement, clone: HTMLDivElement) {
        currentTop = this.computeTopPosition(dialog, currentTop);
        clone.classList.add(this.TRACKED_CLASS);
        clone.style.position = "fixed";
        clone.style.top = `${currentTop}px`;
        clone.style.left = "2rem";
        clone.style.right = "2rem";
        clone.style.zIndex = "9999";
        clone.style.display = "block";
    }

    private computeTopPosition(dialog: HTMLElement, currentTop: number) {
        const style = getComputedStyle(dialog);
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const marginTop = parseFloat(style.marginTop) || 0;
        const height = dialog.getBoundingClientRect().height + marginTop + marginBottom;
        currentTop += height + 30;
        return currentTop;
    }

    private clone(clone: HTMLDivElement, dialog: HTMLElement) {
        clone.innerHTML = dialog.innerHTML;
        const styles = getComputedStyle(dialog);
        for (let i = 0; i < styles.length; i++) {
            const prop = styles[i];
            clone.style.setProperty(prop, styles.getPropertyValue(prop));
        }
        for (let i = 0; i < dialog.attributes.length; i++) {
            const attr = dialog.attributes[i];
            clone.setAttribute(attr.name, attr.value);
        }
    }

    async buildResultSentence(selectedArray: HTMLElement): Promise<string[]> {
        const name = new InformativeNodesHelper().getDialogName(selectedArray) ?? "";
        const sentenceKey = "key.when.withinElement.roleAndName";
        return this.expectTranslator.computeDialogSentenceFromKeyNameAndContent(sentenceKey, name, selectedArray);
    }
}
