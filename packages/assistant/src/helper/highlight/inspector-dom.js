import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { removeTooltip, showTooltip } from "./tooltip-helper";

const VALID_CLASSNAME = /^[_a-zA-Z\- ]*$/;

const constructCssPath = (el) => {
  if (!(el instanceof Element)) {
    return;
  }

  let path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
      path.unshift(selector);
      break;
    } else if (el.className && VALID_CLASSNAME.test(el.className)) {
      selector += `.${el.className.trim().replace(/\s+/g, ".")}`;
    } else {
      let sib = el,
        nth = 1;
      while ((sib = sib.previousElementSibling)) {
        if (sib.nodeName.toLowerCase() === selector) {
          nth++;
        }
      }
      if (nth !== 1) {
        selector += ":nth-of-type(" + nth + ")";
      }
    }

    path.unshift(selector);

    el = el.parentNode;
  }

  return path.join(" > ");
};

var defaultProps = {
  root: "body",
  outlineStyle: "5px solid rgba(204, 146, 62, 0.3)",
  onClick: (el) => console.log("Element was clicked:", constructCssPath(el)),
};

var Inspector = (props = {}) => {
  const { root, excluded, outlineStyle } = {
    ...defaultProps,
    ...props,
  };

  let onClick = props.onClick || defaultProps.onClick;
  let onMouseOver = props.onMouseOver;
  let onMouseOut = props.onMouseOut;
  let selected, excludedElements, activeOverlay;

  const highlight = (el) => {
    el.style.outline = outlineStyle;
    el.style.outlineOffset = `-${el.style.outlineWidth}`;
    if (activeOverlay) {
      removeHighlightOverlay(activeOverlay);
    }
    activeOverlay = applyHighlightOverlay(el);
    const name = computeAccessibleName(el);
    const role = getRole(el);
    const content = [];
    let state;
    if (name && role) {
      content.push("✅ Good");
      state = "good";
    } else if (name || role) {
      content.push("⚠️ Warning");
      state = "warning";
    } else {
      content.push("❌ Danger");
      state = "danger";
    }
    content.push();
    content.push(`<b>Name: </b>${name}`);
    content.push(`<b>Role: </b>${role || ""}`);
    showTooltip(
      el,
      content.join("<br />"),
      state
    );
  };

  const removeHighlight = (el) => {
    if (el) {
      el.style.outline = "none";
      if (activeOverlay) {
        removeHighlightOverlay(activeOverlay);
        activeOverlay = null;
      }
    }
    removeTooltip();
  };

  const shouldBeExcluded = (ev) => {
    if (
      excludedElements &&
      excludedElements.length &&
      excludedElements.some(
        (parent) => parent === ev.target || parent.contains(ev.target),
      )
    ) {
      return true;
    }
  };

  let handleMouseOver = (ev) => {
    if (shouldBeExcluded(ev)) {
      return;
    }
    selected = ev.target;
    onMouseOver(ev.target);
  };

  let handleMouseOut = (ev) => {
    if (shouldBeExcluded(ev)) {
      return;
    }
    onMouseOut(ev.target);
  };

  const handleClick = (ev) => {
    if (shouldBeExcluded(ev)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    onClick(ev.target);
    return false;
  };

  const prepareExcluded = (rootEl) => {
    if (!excluded.length) {
      return [];
    }

    const excludedNested = excluded.flatMap((element) => {
      if (typeof element === "string" || element instanceof String) {
        return Array.from(rootEl.querySelectorAll(element));
      } else if (element instanceof Element) {
        return [element];
      } else if (element.length > 0 && element[0] instanceof Element) {
        return Array.from(element);
      }
    });
    return Array.from(excludedNested).flat();
  };

  const enable = (onClickCallback) => {
    const rootEl = document.querySelector(root);

    if (!rootEl) {
      return;
    }

    if (excluded) {
      excludedElements = prepareExcluded(rootEl);
    }

    rootEl.addEventListener("mouseover", handleMouseOver, true);
    rootEl.addEventListener("mouseout", handleMouseOut, true);
    rootEl.addEventListener("click", handleClick, true);

    if (onClickCallback) {
      onClick = onClickCallback;
    }
  };

  const cancel = () => {
    const rootEl = document.querySelector(root);

    if (!rootEl) {
      return;
    }

    rootEl.removeEventListener("mouseover", handleMouseOver, true);
    rootEl.removeEventListener("mouseout", handleMouseOut, true);
    rootEl.removeEventListener("click", handleClick, true);
    removeHighlight(selected);
  };

  return {
    enable,
    cancel,
    removeHighlight,
    highlight,
  };
};

function applyHighlightOverlay(target) {
  const rect = target.getBoundingClientRect();
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.background = "rgba(255, 0, 0, 0.05)";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "9999998";

  document.body.appendChild(overlay);
  return overlay;
}

function removeHighlightOverlay(overlay) {
  if (overlay) {
overlay.remove();
}
}

export default Inspector;
