import { ArchitectExplorerHelper } from "./architect-explorer.helper";

describe("ArchitectExplorerHelper", () => {
    describe("parseAriaLine", () => {
        it("should format textbox with value", () => {
            // eslint-disable-next-line dot-notation
            expect(ArchitectExplorerHelper["parseAriaLine"]("- textbox \"Town name\": New-York")).toEqual({
                accRole: "textbox",
                accName: "Town name",
                value: "New-York",
                otherAttrs: {},
                children: [],
            });
        });
    });

    describe("parseAriaSnapshot", () => {
        it("should format element with childen", () => {
            expect(
                ArchitectExplorerHelper.parseAriaSnapshot(
                    "- navigation:\n" +
                        "  - link \"Weather App's Logo\":\n" +
                        "    - /url: \"#\"\n" +
                        "    - img \"Weather App's Logo\"\n" +
                        "  - list:\n" +
                        "    - listitem:\n" +
                        "      - link \"Home\":\n" +
                        "        - /url: \"#\"\n" +
                        "- main:\n" +
                        "  - heading \"Add new town\" [level=1]\n" +
                        "  - 'alert \"Warning: Fields marked with an * are required\"':\n" +
                        "    - img \"Warning:\"\n" +
                        "    - text: Fields marked with an * are required\n" +
                        "  - paragraph\n" +
                        "  - text: Town name *\n" +
                        "  - textbox \"Town name\": New-York\n" +
                        "  - text: Town type *\n" +
                        "  - combobox \"Town type\":\n" +
                        "    - option \"Make your choice\"\n" +
                        "    - option \"Real\" [selected]\n" +
                        "    - option \"Unreal\"\n" +
                        "  - text: Latitude *\n" +
                        "  - spinbutton \"Latitude\": \"40.7128\"\n" +
                        "  - text: Longitude *\n" +
                        "  - spinbutton \"Longitude\": \"-74.0060\"\n" +
                        "  - text: Description\n" +
                        "  - textbox \"Description\"\n" +
                        "  - group \"Population *\":\n" +
                        "    - text: Population *\n" +
                        "    - radio \"Small (under 150000)\" [checked]\n" +
                        "    - text: Small (under 150000)\n" +
                        "    - radio \"Medium (150000 to 1 million)\"\n" +
                        "    - text: Medium (150000 to 1 million)\n" +
                        "    - radio \"Large (over 1 million)\"\n" +
                        "    - text: Large (over 1 million)\n" +
                        "  - checkbox \"Allow automatic update\"\n" +
                        "  - text: Allow automatic update\n" +
                        "  - button \"Back to town list\": Back\n" +
                        "  - button \"Submit new town form\": Submit"
                )
            ).toEqual([
                {
                    accName: null,
                    accRole: "navigation",
                    children: [
                        {
                            accName: "Weather App's Logo",
                            accRole: "link",
                            children: [
                                {
                                    accName: "#",
                                    accRole: "/url",
                                    children: [],
                                    otherAttrs: {},
                                    value: "\"#\"",
                                },
                                {
                                    accName: "Weather App's Logo",
                                    accRole: "img",
                                    children: [],
                                    otherAttrs: {},
                                    value: null,
                                },
                            ],
                            otherAttrs: {},
                            value: null,
                        },
                        {
                            accName: null,
                            accRole: "list",
                            children: [
                                {
                                    accName: null,
                                    accRole: "listitem",
                                    children: [
                                        {
                                            accName: "Home",
                                            accRole: "link",
                                            children: [
                                                {
                                                    accName: "#",
                                                    accRole: "/url",
                                                    children: [],
                                                    otherAttrs: {},
                                                    value: "\"#\"",
                                                },
                                            ],
                                            otherAttrs: {},
                                            value: null,
                                        },
                                    ],
                                    otherAttrs: {},
                                    value: null,
                                },
                            ],
                            otherAttrs: {},
                            value: null,
                        },
                    ],
                    otherAttrs: {},
                    value: null,
                },
                {
                    accName: null,
                    accRole: "main",
                    children: [
                        {
                            accName: "Add new town",
                            accRole: "heading",
                            children: [],
                            otherAttrs: {
                                level: "1",
                            },
                            value: null,
                        },
                        {
                            accName: "Warning: Fields marked with an * are required",
                            accRole: "alert",
                            children: [
                                {
                                    accName: "Warning:",
                                    accRole: "img",
                                    children: [],
                                    otherAttrs: {},
                                    value: null,
                                },
                                {
                                    accName: null,
                                    accRole: "text",
                                    children: [],
                                    otherAttrs: {},
                                    value: "Fields marked with an * are required",
                                },
                            ],
                            otherAttrs: {},
                            value: "Fields marked with an * are required\"':",
                        },
                        {
                            accName: null,
                            accRole: "paragraph",
                            children: [],
                            otherAttrs: {},
                            value: null,
                        },
                        {
                            accName: null,
                            accRole: "text",
                            children: [],
                            otherAttrs: {},
                            value: "Town name *",
                        },
                        {
                            accName: "Town name",
                            accRole: "textbox",
                            children: [],
                            otherAttrs: {},
                            value: "New-York",
                        },
                        {
                            accName: null,
                            accRole: "text",
                            children: [],
                            otherAttrs: {},
                            value: "Town type *",
                        },
                        {
                            accName: "Town type",
                            accRole: "combobox",
                            children: [
                                {
                                    accName: "Make your choice",
                                    accRole: "option",
                                    children: [],
                                    otherAttrs: {},
                                    value: null,
                                },
                                {
                                    accName: "Real",
                                    accRole: "option",
                                    children: [],
                                    otherAttrs: {
                                        selected: true,
                                    },
                                    value: null,
                                },
                                {
                                    accName: "Unreal",
                                    accRole: "option",
                                    children: [],
                                    otherAttrs: {},
                                    value: null,
                                },
                            ],
                            otherAttrs: {},
                            value: null,
                        },
                        {
                            accName: null,
                            accRole: "text",
                            children: [],
                            otherAttrs: {},
                            value: "Latitude *",
                        },
                        {
                            accName: "Latitude",
                            accRole: "spinbutton",
                            children: [],
                            otherAttrs: {},
                            value: "\"40.7128\"",
                        },
                        {
                            accName: null,
                            accRole: "text",
                            children: [],
                            otherAttrs: {},
                            value: "Longitude *",
                        },
                        {
                            accName: "Longitude",
                            accRole: "spinbutton",
                            children: [],
                            otherAttrs: {},
                            value: "\"-74.0060\"",
                        },
                        {
                            accName: null,
                            accRole: "text",
                            children: [],
                            otherAttrs: {},
                            value: "Description",
                        },
                        {
                            accName: "Description",
                            accRole: "textbox",
                            children: [],
                            otherAttrs: {},
                            value: null,
                        },
                        {
                            accName: "Population *",
                            accRole: "group",
                            children: [
                                {
                                    accName: null,
                                    accRole: "text",
                                    children: [],
                                    otherAttrs: {},
                                    value: "Population *",
                                },
                                {
                                    accName: "Small (under 150000)",
                                    accRole: "radio",
                                    children: [],
                                    otherAttrs: {
                                        checked: true,
                                    },
                                    value: null,
                                },
                                {
                                    accName: null,
                                    accRole: "text",
                                    children: [],
                                    otherAttrs: {},
                                    value: "Small (under 150000)",
                                },
                                {
                                    accName: "Medium (150000 to 1 million)",
                                    accRole: "radio",
                                    children: [],
                                    otherAttrs: {},
                                    value: null,
                                },
                                {
                                    accName: null,
                                    accRole: "text",
                                    children: [],
                                    otherAttrs: {},
                                    value: "Medium (150000 to 1 million)",
                                },
                                {
                                    accName: "Large (over 1 million)",
                                    accRole: "radio",
                                    children: [],
                                    otherAttrs: {},
                                    value: null,
                                },
                                {
                                    accName: null,
                                    accRole: "text",
                                    children: [],
                                    otherAttrs: {},
                                    value: "Large (over 1 million)",
                                },
                            ],
                            otherAttrs: {},
                            value: null,
                        },
                        {
                            accName: "Allow automatic update",
                            accRole: "checkbox",
                            children: [],
                            otherAttrs: {},
                            value: null,
                        },
                        {
                            accName: null,
                            accRole: "text",
                            children: [],
                            otherAttrs: {},
                            value: "Allow automatic update",
                        },
                        {
                            accName: "Back to town list",
                            accRole: "button",
                            children: [],
                            otherAttrs: {},
                            value: "Back",
                        },
                        {
                            accName: "Submit new town form",
                            accRole: "button",
                            children: [],
                            otherAttrs: {},
                            value: "Submit",
                        },
                    ],
                    otherAttrs: {},
                    value: null,
                },
            ]);
        });
    });
});
