import { ExpectTranslator } from "../src/translator/expect-translator";
import { WithinTranslator } from "../src/translator/within-translator";
import { ClickTranslator } from "../src/translator/click-translator";
import { KeyboardNavigationTranslator } from "../src/translator/keyboard-navigation-translator";
import { TypeTranslator } from "../src/translator/type-translator";
import { UUV_DISABLED_CLASS } from "../src/Commons";

describe("translator - Expected", () => {
    const { buttonWithRoleName, buttonWithRoleNameAndContent, selectorWithDataTestId, selectorWithNth, dialog, table, grid } = dom();
    const translator = new ExpectTranslator();

    test("translator - with role, name and content", async () => {
        expect(await translator.translate(buttonWithRoleNameAndContent)).toEqual({
            sentences: ["Then I should see a button named \"myButton\" and containing \"myTextButton\""],
        });
    });
    test("translator - with role, name", async () => {
        expect(await translator.translate(buttonWithRoleName)).toEqual({ sentences: ["Then I should see a button named \"myButton\""] });
    });
    test("translator - with role, name and content disabled", async () => {
        buttonWithRoleNameAndContent.className = `${buttonWithRoleNameAndContent.className} + ${UUV_DISABLED_CLASS}`;
        expect(await translator.translate(buttonWithRoleNameAndContent)).toEqual({
            sentences: ["Then I should see a button named \"myButton\" and containing \"myTextButton\" disabled"],
        });
    });
    test("translator - with selector- with Id", async () => {
        expect(await translator.translate(selectorWithDataTestId)).toEqual({
            sentences: ["Then I should see an element with selector \"span[data-testid=spanTestId]\""],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });
    test("translator - with selector- with nth", async () => {
        expect(await translator.translate(selectorWithNth)).toEqual({
            sentences: ["Then I should see an element with selector \"div#myDiv > span:nth-of-type(3)\""],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });
    test("translator - table with role and name", async () => {
        expect(await translator.translate(table)).toEqual({ sentences: ["Then I should see a table named \"myTable\""] });
    });
    test("translator - grid with role and name", async () => {
        expect(await translator.translate(grid)).toEqual({ sentences: ["Then I should see a grid named \"myGrid\""] });
    });
    test("translator - computeDialogSentenceFromKeyNameAndContent", async () => {
        const sentences = await translator.computeDialogSentenceFromKeyNameAndContent("key.when.withinElement.roleAndName", "myDialog", dialog);
        const expected = [
            "Then within a dialog named \"myDialog\"",
            "Then I should see a title named \"Dialog Title\" and containing \"Dialog Title\"",
            "Then I should see a button named \"Close\" and containing \"Close\"",
            "Then I should see an element with content \"This is a dialog content\"",
        ];
        expected.forEach(value => {
            expect(sentences).toContain(value);
        });
    });
    test("translator - computeTableSentenceFromKeyNameAndContent", () => {
        const thead = table.querySelector("thead tr") as HTMLElement;
        const tbody = Array.from(table.querySelectorAll("tbody tr")) as HTMLElement[];
        const sentence = translator.computeTableSentenceFromKeyNameAndContent("key.then.element.withRoleAndNameAndContent", "a",  "table", "myTable", thead, tbody, "cell");
        expect(sentence).toEqual(`Then I should see a table named "myTable" and containing 
| Header 1     | Header 2     | Header 3     |
| ------------ | ------------ | ------------ |
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |`);
    });
});

describe("translator - Within", () => {
    const { buttonWithRoleName, buttonWithRoleNameAndContent, selectorWithDataTestId, selectorWithNth } = dom();
    const translator = new WithinTranslator();

    test("translator - with role, name and content", async () => {
        expect(await translator.translate(buttonWithRoleNameAndContent)).toEqual({ sentences: ["When within a button named \"myButton\""] });
    });
    test("translator - with role, name", async () => {
        expect(await translator.translate(buttonWithRoleName)).toEqual({ sentences: ["When within a button named \"myButton\""] });
    });
    test("translator - with role, name and content disabled", async () => {
        expect(await translator.translate(buttonWithRoleNameAndContent)).toEqual({ sentences: ["When within a button named \"myButton\""] });
    });
    test("translator - with selector- with Id", async () => {
        expect(await translator.translate(selectorWithDataTestId)).toEqual({
            sentences: ["When within the element with selector \"span[data-testid=spanTestId]\""],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });
    test("translator - with selector- with nth", async () => {
        expect(await translator.translate(selectorWithNth)).toEqual({
            sentences: ["When within the element with selector \"div#myDiv > span:nth-of-type(3)\""],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });
});

describe("translator - Click", () => {
    const { buttonWithRoleName, buttonWithRoleNameAndContent, selectorWithDataTestId, selectorWithNth } = dom();
    const translator = new ClickTranslator();

    test("translator - with role, name and content", async () => {
        expect(await translator.translate(buttonWithRoleNameAndContent)).toEqual({ sentences: ["When I click on button named \"myButton\""] });
    });
    test("translator - with role, name", async () => {
        expect(await translator.translate(buttonWithRoleName)).toEqual({ sentences: ["When I click on button named \"myButton\""] });
    });
    test("translator - with role, name and content disabled", async () => {
        expect(await translator.translate(buttonWithRoleNameAndContent)).toEqual({ sentences: ["When I click on button named \"myButton\""] });
    });
    test("translator - with selector- with Id", async () => {
        expect(await translator.translate(selectorWithDataTestId)).toEqual({
            sentences: ["When within the element with selector \"span[data-testid=spanTestId]\"", "Then I click"],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });
    test("translator - with selector- with nth", async () => {
        expect(await translator.translate(selectorWithNth)).toEqual({
            sentences: ["When within the element with selector \"div#myDiv > span:nth-of-type(3)\"", "Then I click"],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });
});

describe("translator - keyboard", () => {
    const { selectorWithNth, buttonWithRoleName } = dom();
    const translator = new KeyboardNavigationTranslator();

    test("translator - focus - with selector", async () => {
        expect(await translator.translate(selectorWithNth)).toEqual({
            sentences: [
                "Then I go to next keyboard element",
                "And the element with selector \"div#myDiv > span:nth-of-type(3)\" should be keyboard focused",
            ],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });

    test("translator - focus - with role and name", async () => {
        expect(await translator.translate(buttonWithRoleName)).toEqual({
            sentences: ["Then the next keyboard element focused should be a button named \"myButton\""],
        });
    });
});

describe("translator - Type", () => {
    const { inputNumber, inputText, inputRange, inputHidden } = dom();
    const translator = new TypeTranslator();

    test("translator - with role, name for input type text", async () => {
        expect(await translator.translate(inputText)).toEqual({
            sentences: ["When I type the sentence \"Lorem ipsum\" in the text box named \"inputText\""],
        });
    });

    test("translator - with role, name for input type number", async () => {
        expect(await translator.translate(inputNumber)).toEqual({
            sentences: ["When I enter the value \"123\" in the spin button named \"inputNumber\""],
        });
    });

    test("translator - with selector - with Id", async () => {
        expect(await translator.translate(inputRange)).toEqual({
            sentences: ["When within the element with selector \"input#inputRange\"", "And I type the sentence \"50\"", "And I reset context"],
            suggestion: {
                accessibleAttribute: "",
                accessibleValue: "",
                code: "",
                sentenceAfterCorrection: [],
            },
        });
    });

    test("translator - with selector - with hidden", async () => {
        expect(await translator.translate(inputHidden)).toEqual({
            sentences: [],
            suggestion: undefined,
        });
    });
});

function dom() {
    const rootElement = document.createElement("div");
    rootElement.id = "myDiv";

    const buttonWithRoleName = document.createElement("button");
    buttonWithRoleName.id = "myButtonCustom";
    buttonWithRoleName.setAttribute("aria-label", "myButton");

    const buttonWithRoleNameAndContent = document.createElement("button");
    buttonWithRoleNameAndContent.id = "myButton";
    buttonWithRoleNameAndContent.textContent = "myTextButton";
    buttonWithRoleNameAndContent.setAttribute("aria-label", "myButton");

    const selectorWithId = document.createElement("span");
    selectorWithId.id = "mySpan";
    selectorWithId.textContent = "myTextSpan2";
    rootElement.appendChild(selectorWithId);

    const selectorWithDataTestId = document.createElement("span");
    selectorWithDataTestId.textContent = "myTextSpan";
    selectorWithDataTestId.setAttribute("data-testid", "spanTestId");
    rootElement.appendChild(selectorWithDataTestId);

    const selectorWithNth = document.createElement("span");
    selectorWithNth.textContent = "myTextSpan3";
    rootElement.appendChild(selectorWithNth);

    const inputText = document.createElement("input");
    inputText.setAttribute("aria-label", "inputText");
    inputText.setAttribute("type", "text");
    rootElement.appendChild(inputText);

    const inputNumber = document.createElement("input");
    inputNumber.setAttribute("aria-label", "inputNumber");
    inputNumber.setAttribute("type", "number");
    rootElement.appendChild(inputNumber);

    const inputRange = document.createElement("input");
    inputRange.setAttribute("id", "inputRange");
    inputRange.setAttribute("type", "range");
    rootElement.appendChild(inputRange);

    const inputHidden = document.createElement("input");
    inputHidden.setAttribute("name", "csrfmiddlewaretoken");
    inputHidden.setAttribute("value", "csrfdata");
    inputHidden.setAttribute("type", "hidden");
    rootElement.appendChild(inputHidden);

    const dialog = document.createElement("dialog");
    dialog.setAttribute("aria-labelledby", "myDialog");
    dialog.innerHTML = `
        <h2 id="dialog">Dialog Title</h2>
        <p>This is a dialog content</p>
        <button>Close</button>
    `;
    rootElement.appendChild(dialog);

    const table = document.createElement("table");
    table.setAttribute("aria-labelledby", "table");
    table.innerHTML = `
        <h2 id="table">myTable</h2>
        <thead>
            <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Row 1, Col 1</td>
                <td>Row 1, Col 2</td>
                <td>Row 1, Col 3</td>
            </tr>
            <tr>
                <td>Row 2, Col 1</td>
                <td>Row 2, Col 2</td>
                <td>Row 2, Col 3</td>
            </tr>
        </tbody>
    `;
    rootElement.appendChild(table);

    // Grid element (using div with role="grid")
    const grid = document.createElement("div");
    grid.id = "myGrid";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "myGrid");
    grid.innerHTML = `
        <div role="row">
            <div role="columnheader">Grid Header 1</div>
            <div role="columnheader">Grid Header 2</div>
            <div role="columnheader">Grid Header 3</div>
        </div>
        <div role="row">
            <div role="gridcell">Grid Cell 1,1</div>
            <div role="gridcell">Grid Cell 1,2</div>
            <div role="gridcell">Grid Cell 1,3</div>
        </div>
        <div role="row">
            <div role="gridcell">Grid Cell 2,1</div>
            <div role="gridcell">Grid Cell 2,2</div>
            <div role="gridcell">Grid Cell 2,3</div>
        </div>
    `;
    rootElement.appendChild(grid);

    document.body.appendChild(rootElement);

    return {
        buttonWithRoleName,
        buttonWithRoleNameAndContent,
        selectorWithDataTestId,
        selectorWithNth,
        inputText,
        inputNumber,
        inputRange,
        inputHidden,
        dialog,
        table,
        grid,
    };
}
