import { Extension, gutter, GutterMarker } from "@uiw/react-codemirror";

const uuvA11yWarningMarker = new class extends GutterMarker {
    override toDOM() {
        const marker = document.createElement("div");
        marker.innerHTML = "<div class='uuv-gutter-warning'>⚠️</div>";
        marker.setAttribute("title", "Accessibility role and name must be defined");
        return marker;
    }
}();

export function buildUuvGutter(): Extension {
    return gutter({
            lineMarker(view, line) {
                const value = view.state.doc.lineAt(line.from).text;
                return value.includes("selector") ? uuvA11yWarningMarker : null;
            }
        }
    );
}
