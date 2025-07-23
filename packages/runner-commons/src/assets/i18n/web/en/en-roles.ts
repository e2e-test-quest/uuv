import { AccessibleRole } from "../../../../step-definition-generator/accessible-role";

enum DEFINITE_ARTICLE {
    THE = "the"
}

enum INDEFINITE_ARTICLE {
    A = "a",
    AN = "an"
}


class EnAccessibleRole extends AccessibleRole {
    constructor(
        override id: string,
        override name: string,
        private definiteArticle: DEFINITE_ARTICLE = DEFINITE_ARTICLE.THE,
        private indefiniteArticle: INDEFINITE_ARTICLE = INDEFINITE_ARTICLE.A,
        override shouldGenerateClickSentence = false,
        override shouldGenerateTypeSentence = true,
        override shouldGenerateContainsSentence = true,
        override shouldGenerateKeyboardSentence = false,
        override shouldGenerateCheckedSentence = false
    ) {
        super();
    }

    public static from(input: any) : AccessibleRole {
        return new EnAccessibleRole(
            input.id,
            input.name,
            input.definiteArticle,
            input.indefiniteArticle,
            input.shouldGenerateClickSentence,
            input.shouldGenerateTypeSentence,
            input.shouldGenerateContainsSentence,
            input.shouldGenerateKeyboardSentence,
            input.shouldGenerateCheckedSentence
        );
    }

    override getDefiniteArticle(): string {
        return this.definiteArticle.toString();
    }

    override getIndefiniteArticle(): string {
        return this.indefiniteArticle.toString();
    }

    override getOfDefiniteArticle(): string {
        return `of ${this.definiteArticle}`;
    }

    override namedAdjective(): string {
        return "named";
    }
}

export const EN_ROLES: AccessibleRole[] = [
    { id: "alert", name: "alert", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "alertdialog", name: "alert dialog", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "application", name: "application", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "article", name: "article", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "banner", name: "banner" },
    { id: "button", name: "button", shouldGenerateKeyboardSentence: true, shouldGenerateClickSentence: true },
    { id: "cell", name: "cell" },
    { id: "checkbox", name: "checkbox", shouldGenerateKeyboardSentence: true, shouldGenerateCheckedSentence: true, shouldGenerateClickSentence: true  },
    { id: "columnheader", name: "column header" },
    { id: "combobox", name: "combo box", shouldGenerateTypeSentence: false, shouldGenerateKeyboardSentence: true, shouldGenerateClickSentence: true },
    { id: "command", name: "command" },
    { id: "comment", name: "comment" },
    { id: "complementary", name: "complementary" },
    { id: "composite", name: "composite" },
    { id: "contentinfo", name: "contentinfo" },
    { id: "definition", name: "definition" },
    { id: "dialog", name: "dialog" },
    { id: "directory", name: "directory" },
    { id: "document", name: "document" },
    { id: "feed", name: "flow" },
    { id: "figure", name: "figure" },
    { id: "form", name: "form" },
    { id: "generic", name: "generic" },
    { id: "grid", name: "grid" },
    { id: "gridcell", name: "grid cell" },
    { id: "group", name: "group" },
    { id: "heading", name: "title" },
    { id: "img", name: "image", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "landmark", name: "landmark" },
    { id: "link", name: "link", shouldGenerateKeyboardSentence: true, shouldGenerateClickSentence: true },
    { id: "list", name: "list", shouldGenerateContainsSentence: false, shouldGenerateTypeSentence: false },
    { id: "listbox", name: "list box", shouldGenerateKeyboardSentence: true },
    { id: "listitem", name: "list item", shouldGenerateKeyboardSentence: true, shouldGenerateClickSentence: true },
    { id: "log", name: "log" },
    { id: "main", name: "main" },
    { id: "mark", name: "mark" },
    { id: "math", name: "math" },
    { id: "menu", name: "menu" },
    { id: "menubar", name: "menubar" },
    { id: "menuitem", name: "menuitem", shouldGenerateKeyboardSentence: true, shouldGenerateClickSentence: true },
    { id: "menuitemcheckbox", name: "menuitemcheckbox", shouldGenerateKeyboardSentence: true },
    { id: "menuitemradio", name: "menuitemradio", shouldGenerateKeyboardSentence: true, shouldGenerateCheckedSentence: true },
    { id: "meter", name: "counter" },
    { id: "navigation", name: "navigation" },
    { id: "none", name: "no" },
    { id: "note", name: "note" },
    { id: "option", name: "option", indefiniteArticle: INDEFINITE_ARTICLE.AN, shouldGenerateKeyboardSentence: true, shouldGenerateClickSentence: true },
    { id: "presentation", name: "presentation" },
    { id: "progressbar", name: "progress bar" },
    { id: "radio", name: "radio", shouldGenerateKeyboardSentence: true, shouldGenerateCheckedSentence: true, shouldGenerateClickSentence: true  },
    { id: "radiogroup", name: "radio group" },
    { id: "range", name: "range" },
    { id: "region", name: "region" },
    { id: "roletype", name: "role type" },
    { id: "row", name: "row" },
    { id: "rowgroup", name: "row group" },
    { id: "rowheader", name: "row header" },
    { id: "scrollbar", name: "scroll bar" },
    { id: "search", name: "search", shouldGenerateKeyboardSentence: true },
    { id: "searchbox", name: "search box", shouldGenerateKeyboardSentence: true },
    { id: "section", name: "section" },
    { id: "sectionhead", name: "section header" },
    { id: "select", name: "select", shouldGenerateKeyboardSentence: true },
    { id: "separator", name: "separator" },
    { id: "slider", name: "slider", shouldGenerateKeyboardSentence: true },
    { id: "spinbutton", name: "spin button", shouldGenerateKeyboardSentence: true },
    { id: "status", name: "status" },
    { id: "structure", name: "structure" },
    { id: "suggestion", name: "suggestion" },
    { id: "switch", name: "switch", shouldGenerateKeyboardSentence: true },
    { id: "tab", name: "tab", shouldGenerateKeyboardSentence: true },
    { id: "table", name: "table" },
    { id: "tablist", name: "tablist" },
    { id: "tabpanel", name: "tabpanel" },
    { id: "term", name: "term" },
    { id: "textbox", name: "text box", shouldGenerateKeyboardSentence: true },
    { id: "timer", name: "timer" },
    { id: "toolbar", name: "toolbar" },
    { id: "tooltip", name: "tooltip" },
    { id: "tree", name: "tree" },
    { id: "treegrid", name: "tree grid" },
    { id: "treeitem", name: "tree item" },
    { id: "widget", name: "widget", shouldGenerateKeyboardSentence: true },
    { id: "window", name: "window" }
].map(role => EnAccessibleRole.from(role));
