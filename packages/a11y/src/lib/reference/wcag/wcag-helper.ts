import axe from "axe-core";
import { AccessibilityIssue, IssueImpact, IssueType } from "../../model/uuv-a11y-result";

/**
     * Convert an aXe selector array to a selector string. Copied from
     * https://github.com/dequelabs/axe-cli/blob/develop/lib/utils.js
     * for now, wonder if we can share or move out.
     * @private
     * @param {Array} selectors - The selector parts.
     * @returns {String} Returns the selector string.
     */
function selectorToString(selectors): string {
    return selectors
        .reduce((selectorParts, selector) => selectorParts.concat(selector), [])
        .join(" ");
}

/**
 * Convert a axe violation impact to a pa11y level
 * @private
 * @param {string} impact axe level
 * @returns {string} pa11y level
 */
function axeImpactToPa11yLevel(impact): IssueType {
    switch (impact) {
        case "moderate":
            return IssueType.Warning;
        case "minor":
            return IssueType.Notice;
        case "critical":
        case "serious":
        default:
            return IssueType.Error;
    }
}

function axeImpactToPa11yImpact(impact): IssueImpact {
    switch (impact) {
        case "critical":
            return IssueImpact.Critical;
        case "serious":
            return IssueImpact.Serious;
        case "moderate":
            return IssueImpact.Moderate;
        case "minor":
            return IssueImpact.Minor;
        default:
            return IssueImpact.Unknown;
    }
}

/**
   * Process an aXe issue.
   * @private
   * @param {Object} axeIssue - An aXe issue to process.
   * @returns {Object[]} Returns an array of processed issues.
   */
export function fromAxeToUvvA11yIssue(axeIssue: axe.Result): AccessibilityIssue[] {
    // See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#results-object for a description
    // of an axe issue

    const selectors: string[] = axeIssue.nodes.map(node => selectorToString(node.target));

    return selectors.map(selector => ({
        type: axeImpactToPa11yLevel(axeIssue.impact),
        code: axeIssue.id,
        message: `${axeIssue.help} (${axeIssue.helpUrl})`,
        selector,
        htmlElement: window.document.querySelector(selector),
        runnerExtras: {
            description: axeIssue.description,
            impact: axeImpactToPa11yImpact(axeIssue.impact),
            help: axeIssue.help,
            helpUrl: axeIssue.helpUrl
        }
    }));
}
