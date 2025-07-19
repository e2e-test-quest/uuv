let tooltipEl = null;

export function showTooltip(el, content, state) {
  removeTooltip();

  tooltipEl = document.createElement("div");
  tooltipEl.className = "tooltip-highlight";
  tooltipEl.innerHTML = content;
  tooltipEl.style.position = "absolute";
  tooltipEl.style.border = "2px solid black";
  switch (state) {
    case "good":
      tooltipEl.style.background = "rgba(23,62,23,0.85)";
      tooltipEl.style.border = "2px solid rgb(23,62,23)";
      break;
    case "warning":
      tooltipEl.style.background = "rgba(87,65,18,0.85)";
      tooltipEl.style.border = "2px solid rgb(87,65,18)";
      break;
    case "danger":
      tooltipEl.style.background = "rgba(78,11,11,0.85)";
      tooltipEl.style.border = "2px solid rgb(78,11,11)";
      break;
    default:
      tooltipEl.style.background = "rgba(0,0,0, 0.85)";
      tooltipEl.style.border = "2px solid black";
  }
  tooltipEl.style.color = "#fff";
  tooltipEl.style.padding = "6px 10px";
  tooltipEl.style.borderRadius = "4px";
  tooltipEl.style.fontSize = "14px";
  tooltipEl.style.maxWidth = "500px";
  tooltipEl.style.zIndex = "9999999";
  tooltipEl.style.whiteSpace = "nowrap";
  tooltipEl.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";
  tooltipEl.style.pointerEvents = "none";
  tooltipEl.style.transition = "opacity 0.2s";

  document.body.appendChild(tooltipEl);

  positionTooltip(el);
}

export function removeTooltip() {
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
  }
}

function positionTooltip(targetElement) {
  const elRect = targetElement.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();

  let y = elRect.top + window.scrollY - tooltipRect.height; // Above
  let x = elRect.left + window.scrollX + (elRect.width - tooltipRect.width) / 2;

  if (y < window.scrollY) {
    y = elRect.bottom + window.scrollY;
  }

  if (x < 8) {
    x = 8;
  }

  const maxLeft = window.scrollX + document.documentElement.clientWidth - tooltipRect.width;
  if (x > maxLeft) {
    x = maxLeft;
  }

  tooltipEl.style.left = `${x}px`;
  tooltipEl.style.top = `${y}px`;
}
