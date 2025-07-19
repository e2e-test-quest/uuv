import Inspector from "../inspector-dom";
import { InformativeNodesHelper } from "./InformativeNodesHelper";

export const HIGHLIGHT_ORANGE_PROPS = {
  width: 4,
  borderColor: "orange"
};

export class HighLightHelper {
  private inspector!: Inspector;
  constructor(private onSelect: (el: HTMLElement) => void) {}

  private createInspector(
    onMouseOver: (el: HTMLElement) => void,
    onMouseOut: (el: HTMLElement) => void
  ) {
    this.inspector = Inspector({
      root: "body",
      outlineStyle: "2px solid red",
      onClick: (el: HTMLElement) => {
        this.onSelect(el);
        this.inspector.cancel();
      },
      onMouseOver,
      onMouseOut
    });
  }

  enableBasicHighlight() {
    this.createInspector(
      el => this.inspector.highlight(el),
      el => this.inspector.removeHighlight(el)
    );
    this.inspector.enable();
  }

  enableRefinedHighlight() {
    const informativeNodesHelper = new InformativeNodesHelper();
    const nodesWithInfo = informativeNodesHelper.getAvailableNodes();

    this.createInspector(
      el => {
        if (nodesWithInfo.includes(el)) {
          this.inspector.highlight(el);
        }
      },
      el => {
        if (nodesWithInfo.includes(el)) {
          this.inspector.removeHighlight(el);
        }
      }
    );
    this.inspector.enable();
  }

  cancel() {
    this.inspector.cancel();
  }
}
