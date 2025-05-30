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

import React from "react";
import "./index.css";
import UuvAssistant from "./UuvAssistant";
import { createRoot } from "react-dom/client";
import css from './UuvAssistant.css?inline';
import { UUV_ASSISTANT_BAR_WIDTH } from "./Commons";

/* eslint-disable  @typescript-eslint/no-explicit-any */
document.addEventListener("UUVAssistantReadyToLoad", (e: any) => {
    console.log("event listened: UUVAssistantReadyToLoad");
    document.body.style.marginRight = `${parseInt(window.getComputedStyle(document.body).marginRight) + UUV_ASSISTANT_BAR_WIDTH}px`;
    const assistantRoot = document.getElementById("uvv-assistant-root");
    const assistantAdditionalLayersRoot = document.getElementById("uvv-assistant-additional-layers");
    if (assistantRoot && assistantAdditionalLayersRoot) {
        assistantRoot.classList.add("react-container");
        const shadowAssistantRoot = assistantRoot.attachShadow({ mode: "open" });
        const root = createRoot(shadowAssistantRoot);

        const shadowAdditionalLayersRoot = assistantAdditionalLayersRoot.attachShadow({ mode: "open" });

        root.render(
            <>
                <style>{css.toString()}</style>
                <div>
                    <UuvAssistant
                        translator={e?.detail?.translator}
                        assistantRoot={shadowAssistantRoot}
                        assistantAdditionalLayersRoot={shadowAdditionalLayersRoot}/>
                </div>
            </>
        );
    }
});

