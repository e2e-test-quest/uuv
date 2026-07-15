import { Page } from "playwright-chromium";
import { AriaElement, Step, StepResult } from "../architect.model";
import { logger } from "../../utils";

export class ArchitectExplorerHelper {
    static async navigateToUrl(page: Page, targetUrl: string): Promise<string> {
        await page.goto(targetUrl);
        return await page.ariaSnapshot();
    }

    static async executeStep(page: Page, step: Step): Promise<StepResult> {
        page.setDefaultTimeout(2000);

        if (step.action !== "stop") {
            try {
                if (!step.targetElement) {
                    throw new Error("targetElement should not be null or undefined");
                } else if (step.action === "type" && !step.valueToType) {
                    throw new Error("step.valueToType can't be null or undefined for select action");
                }

                switch (step.action) {
                    case "expect":
                        await page.getByRole(step.targetElement?.accessibleRole as any, {
                            name: step.targetElement.accessibleName,
                            exact: true,
                        });
                        break;
                    case "click":
                        await page
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .getByRole(step.targetElement?.accessibleRole as any, {
                                name: step.targetElement.accessibleName,
                                exact: true,
                            })
                            .click();
                        break;
                    case "select":
                        await page
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .getByRole(step.targetElement.accessibleRole as any, {
                                name: step.targetElement.accessibleName,
                                exact: true,
                            })
                            .selectOption(step.valueToSelect);
                        break;
                    case "type":
                        await page
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .getByRole(step.targetElement.accessibleRole as any, {
                                name: step.targetElement.accessibleName,
                                exact: true,
                            })
                            .fill(step.valueToType as string);
                        break;
                    default:
                        throw new Error(`Action ${step.action} is not implemented yet`);
                }
            } catch (e: unknown) {
                return {
                    type: "error",
                    error: (e as Error).message,
                    pageSnapshot: null,
                };
            }
        }

        await page.waitForTimeout(1000);
        const rawPageSnapshot = await page.ariaSnapshot();
        const parsedPageSnapshot = this.parseAriaSnapshot(rawPageSnapshot);
        logger.debug("rawPageSnapshot");
        logger.debug(JSON.stringify(rawPageSnapshot, null, 4));
        logger.debug("parsedPageSnapshot");
        logger.debug(JSON.stringify(parsedPageSnapshot, null, 4));
        return {
            type: "success",
            error: null,
            pageSnapshot: parsedPageSnapshot,
        };
    }

    private static isSimilar(step1: Step, step2: Step) {
        return (
            step1.action === step2.action &&
            step1.targetElement?.accessibleName === step2.targetElement?.accessibleName &&
            step1.targetElement?.accessibleRole === step2.targetElement?.accessibleRole
        );
    }

    static refactorNextStep(actionHistory: Step[], nextStep: Step): Step {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (actionHistory.length >= 2 && this.isSimilar(nextStep, actionHistory.at(-1)!) && this.isSimilar(nextStep, actionHistory.at(-2)!)) {
            return {
                stepNumber: actionHistory.length,
                action: "stop",
                targetElement: null,
                valueToType: null,
                valueToSelect: null,
                targetUrl: null,
                stepComment: "Loop interrupted because of max retries",
                result: {
                    type: "success",
                    error: null,
                    pageSnapshot: null,
                },
            };
        } else if (nextStep.action === "stop") {
            return {
                ...nextStep,
                targetElement: null,
                valueToType: null,
                valueToSelect: null,
                targetUrl: null,
                result: {
                    type: "success",
                    error: null,
                    pageSnapshot: null,
                },
            };
        } else if (nextStep.action === "navigation" && nextStep.targetElement?.accessibleName && nextStep.targetElement?.accessibleRole) {
            return {
                ...nextStep,
                action: "click",
            };
        }
        return nextStep;
    }

    /**
     * Converts an entire aria snapshot (Playwright page.ariaSnapshot()) into a tree of structured elements.
     * @param snapshot - the raw text returned by playwright's page.ariaSnapshot()
     * @returns array of root AriaElement nodes
     */
    static parseAriaSnapshot(snapshot: string): AriaElement[] {
        if (!snapshot || !snapshot.trim()) {
            return [];
        }

        const lines = snapshot.split("\n");
        const roots: AriaElement[] = [];

        // La "pile parentale" conserve une référence vers les éléments parents potentiels
        // (et leur indentation) afin qu'on puisse lui injecter directement des `children` !
        const parentStack: { indent: number; element: AriaElement }[] = [];

        for (const line of lines) {
            if (!line.trim()) {
                continue;
            }

            const currentIndent = this.getBaseIndent(line);
            const currentElement = this.parseAriaLine(line);

            if (!currentElement || !currentElement.accRole) {
                continue;
            }

            // Règle clé des arbres : si l'indentation du parent est égale ou INFÉRIEURE au nœud actuel,
            // c'est que le parent ne peut plus contenir d'enfant (la liste `<ul>` est fermée).
            // On retourne en arrière pour trouver un parent valide.
            while (parentStack.length > 0 && parentStack[parentStack.length - 1].indent >= currentIndent) {
                parentStack.pop();
            }

            if (parentStack.length === 0) {
                // Aucun parent valide trouvé, le noeud est à la racine du snapshot
                roots.push(currentElement);
                parentStack.push({ indent: currentIndent, element: currentElement });
            } else {
                // Attachement au dernier parent valide de la pile
                const lastParent = parentStack[parentStack.length - 1].element;
                lastParent.children.push(currentElement);

                // Empilement pour traiter ses propres enfants futurs
                parentStack.push({ indent: currentIndent, element: currentElement });
            }
        }

        return roots;
    }

    /**
     * Parses a single snapshot line (after removing leading "- " and spaces) into an AriaElement.
     */
    private static parseAriaLine(rawLine: string): AriaElement {
        // Nettoyage des tirelets et espaces de tête "- "
        let content = rawLine.replace(/^ *- */, "");

        let accessibleName: string | null = null;
        let rawRole = "";
        let value: string | null = null;
        const attributes: Record<string, string | boolean> = {};

        // Cas spécial : les rôles contenant des caractères spéciaux sont entre guillemets simples '- 'alert "Warning:"'-'
        if (content.startsWith("'")) {
            content = content.slice(1); // on retire le `'` ouvrant pour simplifier le parsing suivant
        }

        // Extraction du nom exact dans les doubles-guillemets `"role "Nom"`
        const quoteMatch = content.match(/"([^"]*)"/);

        if (quoteMatch) {
            accessibleName = quoteMatch[1];
            // Le rôle est tout ce qui précède le premier guillemet, on nettoie une potentielle `:` finale
            rawRole = content.slice(0, quoteMatch.index).trim().replace(/:$/, "");
        } else {
            // Pas de guillemets : e.g. `/url:`, `paragraph`
            const colonIndex = content.indexOf(":");
            const bracketIndex = content.indexOf("[");
            // On prend le premier séparateur (`:` ou `[`) trouvé au plus tôt
            let splitIndex: number;
            if (colonIndex === -1) {
                splitIndex = bracketIndex;
            } else {
                splitIndex = bracketIndex === -1 || bracketIndex > colonIndex ? colonIndex : bracketIndex;
            }

            if (splitIndex === -1) {
                rawRole = content.trim().replace(/\[(.+)\]$/, "").trim();
            } else {
                rawRole = content.slice(0, splitIndex).trim();
                const afterSplit = content.slice(splitIndex + 1);
                // Si c'est une colonne (`:`), le contenu d'après est la valeur de l'élément
                if (afterSplit.startsWith(":")) {
                    value = afterSplit.trim();
                }
            }
        }

        // Si pas de `:` trouvée plus tôt, vérifie la fin de ligne pour une valeur (`: New-York`)
        if (!value) {
            const valMatch = content.match(/:\s(.+)$/);
            if (valMatch) {
value = valMatch[1].trim();
}
        }

        // Extraction de tous les attributs entre crochets `[..., attr, ...]`
        for (const match of content.matchAll(/\[(.+?)\]/g)) {
            const inner = match[1];
            const eqIndex = inner.indexOf("=");
            if (eqIndex !== -1) {
                // clé=valeur : `[level=1]`, `[aria-posinset='2']`
                attributes[inner.slice(0, eqIndex)] = inner.slice(eqIndex + 1);
            } else {
                // drapeau boolean : `[selected]`, `[checked]`
                attributes[inner] = true;
            }
        }

        return {
            accRole: rawRole,
            accName: accessibleName,
            value,
            otherAttrs: attributes,
            children: [],
        };
    }

    private static getBaseIndent(line: string): number {
        if (!line || !line.trim()) {
            return -1;
        }

        let count = 0;
        for (const char of line) {
            if (char === " ") {
                count++;
            } else {
                break;
            }
        }
        // Playwright utilise toujours un indentation de 2 espaces par niveau d'arbre
        return Math.floor(count / 2);
    }
}
