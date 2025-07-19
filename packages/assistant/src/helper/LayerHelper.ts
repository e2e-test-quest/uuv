import { FocusableElement } from "tabbable";
import { AdditionalLayerEnum, UUV_ASSISTANT_BAR_WIDTH } from "../Commons";
import { HIGHLIGHT_ORANGE_PROPS } from "./highlight/HighlightHelper";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export interface Point {
    x: number;
    y: number;
}

export const ORDER_PROPS = {
    radius: 12,
    linkWith: 4
};

function buildBasicLayerStyle(isFullWith: boolean): string {
    const remaningWidth = isFullWith ? 0 : UUV_ASSISTANT_BAR_WIDTH;
    return `
    .uvv-assistant-additional-layer-svg {
      z-index: 9000;
      position: absolute;
      top: 0;
      min-width: calc(100vw - ${remaningWidth}px);
      width: ${document.body.getBoundingClientRect().width - remaningWidth}px;
      min-height: 100vh;
      height: ${document.body.getBoundingClientRect().height + 50}px;
      background-color: rgba(128, 128, 128, 0.65);
    }
    
    .element-border {
      fill: transparent;
    }
    
    .order {
      fill: black;
      cursor: pointer;
    }
    
    .order-content {
      fill: white;
      cursor: pointer;
    }
    
    .line {
      stroke: black;
      stroke-width: ${ORDER_PROPS.linkWith};
    }
  `;
}

function buildCompleteStyle(additionalStyle: string, isFullWith: boolean) {
    return `${buildBasicLayerStyle(isFullWith)}
        ${additionalStyle}
    `;
}

function drawHighlight(layerContainer: Element, targetElement: FocusableElement, order: number) {
    const highlightArea = document.createElementNS(SVG_NAMESPACE, "rect");
    highlightArea.setAttribute("class", "element-border");
    highlightArea.setAttribute("id", `element-border-${order}`);
    highlightArea.setAttribute("width", `${targetElement.getBoundingClientRect().width + (HIGHLIGHT_ORANGE_PROPS.width * 2)}`);
    highlightArea.setAttribute("height", `${targetElement.getBoundingClientRect().height + (HIGHLIGHT_ORANGE_PROPS.width * 2)}`);
    highlightArea.setAttribute("x", `${window.scrollX + targetElement.getBoundingClientRect().x - HIGHLIGHT_ORANGE_PROPS.width}`);
    highlightArea.setAttribute("y", `${window.scrollY + targetElement.getBoundingClientRect().y - HIGHLIGHT_ORANGE_PROPS.width}`);
    layerContainer.append(highlightArea);
}

function drawNavigationOrder(layerContainer: Element, targetElement: FocusableElement, order: number) {
    const x = window.scrollX + targetElement.getBoundingClientRect().x + targetElement.getBoundingClientRect().width;
    const y = window.scrollY + targetElement.getBoundingClientRect().y;

    const orderIndicatorContainer = document.createElementNS(SVG_NAMESPACE, "circle");
    orderIndicatorContainer.setAttribute("class", "order");
    orderIndicatorContainer.setAttribute("id", `order-${order}`);
    orderIndicatorContainer.setAttribute("r", `${ORDER_PROPS.radius}`);
    orderIndicatorContainer.setAttribute("cx", `${x}`);
    orderIndicatorContainer.setAttribute("cy", `${y}`);

    const orderIndicatorContent = document.createElementNS(SVG_NAMESPACE, "text");
    orderIndicatorContent.innerHTML = `${order + 1}`;
    orderIndicatorContent.setAttribute("class", "order-content");
    orderIndicatorContent.setAttribute("id", `order-content-${order}`);
    orderIndicatorContent.setAttribute("text-anchor", "middle");
    orderIndicatorContent.setAttribute("alignment-baseline", "central");
    orderIndicatorContent.setAttribute("x", `${x}`);
    orderIndicatorContent.setAttribute("y", `${y}`);

    layerContainer.append(orderIndicatorContainer);
    layerContainer.append(orderIndicatorContent);
}

function drawLinkBetweenElement(layerContainer: Element, startPoint: Point, endPoint: Point) {
    const linkBetweenNode = document.createElementNS(SVG_NAMESPACE, "line");
    linkBetweenNode.setAttribute("class", "line");
    linkBetweenNode.setAttribute("x1", `${startPoint.x}`);
    linkBetweenNode.setAttribute("y1", `${startPoint.y}`);
    linkBetweenNode.setAttribute("x2", `${endPoint.x}`);
    linkBetweenNode.setAttribute("y2", `${endPoint.y}`);

    layerContainer.append(linkBetweenNode);
}

function getMiddlePoint(previousElement): Point {
    return {
        x: window.scrollX + previousElement.getBoundingClientRect().x + previousElement.getBoundingClientRect().width,
        y: window.scrollY + previousElement.getBoundingClientRect().y
    };
}

function initSvgElement(layerShadowRoot: ShadowRoot, layer: AdditionalLayerEnum, additionalStyle: string, isFullWith: boolean) {
    const completeStyle = buildCompleteStyle(additionalStyle, isFullWith);
    const layerShadowRootElement = layerShadowRoot.querySelector(`#${layer.toString()}`);
    if (layerShadowRootElement) {
        layerShadowRootElement.innerHTML = `
      <style>
        ${completeStyle}
      </style>
      <svg xmlns="http://www.w3.org/2000/svg" id="${layer.toString()}-svg" class="uvv-assistant-additional-layer-svg">
      </svg>
    `;
    }
}

export function buildLayer(
    layerShadowRoot: ShadowRoot,
    layer: AdditionalLayerEnum,
    elements: HTMLElement[],
    additionalStyle: string,
    isFullWith: boolean,
    displayLinkBetweenElements: boolean,
    displayNavigationOrder = true
) {
    initSvgElement(layerShadowRoot, layer, additionalStyle, isFullWith);
    const layerContainer = layerShadowRoot.querySelector(`#${layer.toString()}-svg`);
    if (layerContainer) {
        if (displayLinkBetweenElements) {
            elements.forEach((currentElement, index, allElements) => {
                if (index > 0) {
                    const startPoint = getMiddlePoint(allElements[index - 1]);
                    const endPoint = getMiddlePoint(currentElement);
                    drawLinkBetweenElement(layerContainer, startPoint, endPoint);
                }
            });
        }
        elements.forEach((currentElement, index) => {
            drawHighlight(layerContainer, currentElement, index);
            if (displayNavigationOrder) {
              drawNavigationOrder(layerContainer, currentElement, index);
            }
        });
    }
}

export function addLayerToShadowDom(dom: ShadowRoot, layer: AdditionalLayerEnum) {
    const newLayer = document.createElement("div");
    newLayer.setAttribute("id", layer.toString());
    newLayer.setAttribute("class", "uvv-assistant-additional-layer");
    if (!dom.getElementById(layer.toString())) {
      dom.appendChild(newLayer);
    }
}

export function removeLayerToShadowDom(dom: ShadowRoot, layer: AdditionalLayerEnum) {
    const layerToRemove = dom.getElementById(layer.toString());
    if (layerToRemove) {
        dom.removeChild(layerToRemove);
    }
}
