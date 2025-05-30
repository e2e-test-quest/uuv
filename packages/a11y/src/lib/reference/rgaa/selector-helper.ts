 class SelectorRule {
   constructor(readonly SELECTOR: string, readonly ATTRIBUTES: string[]) {
     this.SELECTOR = SELECTOR;
     this.ATTRIBUTES = ATTRIBUTES;
   }

   buildSelectorWithAttributes() {
     const result = this.ATTRIBUTES.map(value => `${this.SELECTOR}[${value}]`);
      if (result.length === 0) {
        return [this.SELECTOR];
      }
      return result;
   }
}

 export const informativeContent = {
  image: new SelectorRule("img", ["title", "aria-labelledby", "aria-label", "alt"]),
  area: new SelectorRule("area[href]", ["title", "aria-labelledby", "aria-label", "alt"]),
  input: new SelectorRule("input[type=image]", ["title", "aria-labelledby", "aria-label", "alt"]),
  object: new SelectorRule("object[type^=image]", ["title", "aria-labelledby", "aria-label"]),
  embed: new SelectorRule("embed[type^=image]", ["title", "aria-labelledby", "aria-label"]),
  svg: new SelectorRule("svg:not(a svg,button svg)", ["title", "aria-labelledby", "aria-label"]),
  canvas: new SelectorRule("canvas:not(:empty)", ["title", "aria-labelledby", "aria-label"]),
};
 export const siblingElement = {
  button: new SelectorRule("button", []),
  a: new SelectorRule("a[href]", []),
};

 /** CSS SELECTOR HELPER *******/
 class CssSelectorRule {
   constructor(readonly attributes: string[], readonly selector = "", readonly role: string = selector) {
     this.selector = selector;
     this.role = role;
     this.attributes = attributes;
   }

   buildSelector(overrideSelector : string[] = [], overrideRole: string | undefined = overrideSelector[0]): string[] {
     if (overrideSelector && overrideSelector.length === 0 && !overrideRole) {
       console.error("selector or role must be provided");
     }
     const selectors: string[] = [];
     if (overrideSelector.length > 0) {
       selectors.push(...overrideSelector);
     }
     if (overrideRole) {
       selectors.push(`[role=${overrideRole}]`);
     }
     if (this.attributes.length === 0) {
       return selectors;
     }
     const result: string[] = [];
     selectors.forEach(selector => {
       this.attributes.forEach(attribute => {
         result.push(`${selector}${attribute}`);
       });
     });
     return result;
   }
 }
 export const commonCssSelector = {
   ariaDescribedBy: ["[aria-describedby]:not([aria-describedby=''])"],
   title: ["[title]:not([title=''])"],
   ariaLabelledBy: ["[aria-labelledby]:not([aria-labelledby=''])"],
   ariaLabel: ["[aria-label]:not([aria-label=''])"]
 };

 export const tableCssSelector = {
   complexTh: [":has(tr:not(:first-child) th:first-child)"],
   complexRowHeader: [":has([role=row]:not(:first-child) [role=rowheader])"],
   complexColumnHeader: [":has([role=row]:not(:first-child) [role=columnheader])"],
 };

 export const table = {
   selector: {
     withFormatting: "table[role=presentation]",
     complex: [
      ...tableCssSelector.complexTh,
      ...tableCssSelector.complexRowHeader,
      ...tableCssSelector.complexColumnHeader
     ].map(value => `table:not([role=presentation])${value}`),
     withData: "table:not([role=presentation])"
   },
   noCaption: new CssSelectorRule([":not(:has(> caption))", ":has(> caption:empty)"]),
   caption: new CssSelectorRule(["> caption:not(:empty)"]),
   summary: new CssSelectorRule(["[summary]:not([summary=''])"]),
   ariaDescribedBy: new CssSelectorRule(commonCssSelector.ariaDescribedBy),
   title: new CssSelectorRule(commonCssSelector.title),
   ariaLabel: new CssSelectorRule(commonCssSelector.ariaLabel),
   ariaLabelledBy: new CssSelectorRule(commonCssSelector.ariaLabelledBy),
   thColumnHeader: new CssSelectorRule([" tr:first-child th"]),
   thRowHeader: new CssSelectorRule([" tr:not(:first-child) th:first-child"]),
   hasComplexHeader: new CssSelectorRule([
     ...tableCssSelector.complexTh,
     ...tableCssSelector.complexRowHeader,
     ...tableCssSelector.complexColumnHeader
   ])
 };
