export class InformativeNodesHelper {
  private readonly TAGS_WITH_NATIVE_ACCESSIBILITY_DATA: string[] = [
    "article",
    "aside",
    "button",
    "details",
    "dialog",
    "fieldset",
    "figure",
    "form",
    "footer",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "img",
    "input",
    "label",
    "li",
    "main",
    "menu",
    "nav",
    "ol",
    "ul",
    "option",
    "progress",
    "section",
    "select",
    "summary",
    "table",
    "textarea",
    "tbody",
    "thead",
    "tfoot",
    "td",
    "th",
    "tr",
  ];

  private readonly candidatesWithNativeAccessibleData: NodeListOf<Element>;
  private readonly candidatesWithCustomAccessibleData: Element[];

  constructor() {
    const tagsWithAccessibilityData =
      this.TAGS_WITH_NATIVE_ACCESSIBILITY_DATA.join(",");
    this.candidatesWithNativeAccessibleData =
      document.querySelectorAll(tagsWithAccessibilityData);
    const querySelectorWithoutAccessibleData = `*${this.TAGS_WITH_NATIVE_ACCESSIBILITY_DATA.map(
      (value) => `:not(${value})`,
    ).join("")}`;
    const nodesWithoutCustomAccessibleData = document.querySelectorAll(querySelectorWithoutAccessibleData);

    const informativeElements = [...nodesWithoutCustomAccessibleData]
      .filter((el) => this.hasInformativeAttributes(el));

    const childrenOfCandidates = [...nodesWithoutCustomAccessibleData]
      .flatMap((el) => Array.from(el.children));
    this.candidatesWithCustomAccessibleData = [
      ...informativeElements,
      ...childrenOfCandidates,
    ];
  }

  getAvailableNodes(): Element[] {
    return [
      ...this.candidatesWithNativeAccessibleData,
      ...this.candidatesWithCustomAccessibleData,
    ];
  }

  private hasInformativeAttributes(node) {
    const attrs = node.attributes;
    if (attrs) {
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const isWithAccessibilityAttributes =
          name === "role" ||
          name === "alt" ||
          name === "title" ||
          name === "tabindex" ||
          name === "lang" ||
          name === "scope" ||
          name === "for" ||
          name.startsWith("aria-");
        const isWithTechnicalAttributes = name === "data-testid";
        if (isWithAccessibilityAttributes || isWithTechnicalAttributes) {
          return true;
        }
      }
    }
    return false;
  }
}
