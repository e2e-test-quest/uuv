import { AccessibleRole } from "./accessible-role";

export enum LANG {
    FR = "fr",
    EN = "en",
}

export type BaseSentence = {
    key: string;
    description: string;
    wording: string;
};

export type RoleBasedSentenceTemplate = BaseSentence & {
    section: string;
};

export type RoleBasedSentence = RoleBasedSentenceTemplate & {
    role: string;
};

export type ComputeSentenceInput = {
    sentence: BaseSentence;
    mock?: string;
    accessibleRole: string;
    parameters: string[];
};

export abstract class Dictionary {
    protected baseSentences!: BaseSentence[];
    protected roleBasedSentencesTemplate!: RoleBasedSentenceTemplate[];
    protected roles!: AccessibleRole[];

    public getBaseSentences(): BaseSentence[] {
        return this.baseSentences;
    }

    public getRoleBasedSentencesTemplate(): RoleBasedSentenceTemplate[] {
        return this.roleBasedSentencesTemplate;
    }

    public getDefinedRoles(): AccessibleRole[] {
        return this.roles;
    }

    public getRoleBasedSentences(): RoleBasedSentence[] {
        const result: RoleBasedSentence[] = [];
        this.roles.forEach(role => {
            this.roleBasedSentencesTemplate
                .filter(
                    sentence =>
                        sentence.section === "general" ||
                        (sentence.section === "keyboard" && role.shouldGenerateKeyboardSentence) ||
                        (sentence.section === "click" && role.shouldGenerateClickSentence) ||
                        (sentence.section === "contains" && role.shouldGenerateContainsSentence) ||
                        (sentence.section === "type" && role.shouldGenerateTypeSentence) ||
                        (sentence.section === "checkable" && role.shouldGenerateCheckedSentence)
                )
                .map(sentence => {
                    return {
                        ...sentence,
                        role: role.name,
                        key: `${sentence.key}.role.${role.name.toLowerCase()}`,
                        wording: sentence.wording
                            .replaceAll("(n)", "")
                            .replaceAll("$roleName", role.name)
                            .replaceAll("$definiteArticle", role.getDefiniteArticle())
                            .replaceAll("$indefiniteArticle", role.getIndefiniteArticle())
                            .replaceAll("$namedAdjective", role.namedAdjective())
                            .replaceAll("$ofDefiniteArticle", role.getOfDefiniteArticle()),
                    };
                })
                .forEach(sentence => {
                    result.push(sentence);
                });
        });
        return result;
    }

    public computeSentence(input: ComputeSentenceInput): string {
        const targetRole = this.getDefinedRoles().filter(role => role.id === input.accessibleRole)[0];
        let resultSentence = input.sentence.wording;

        if (input.mock) {
            resultSentence = resultSentence.replace("{string}", `"${input.mock}"`);
        }

        resultSentence = resultSentence
            .replaceAll("(n)", "")
            .replaceAll("$roleName", targetRole?.name ?? input.accessibleRole)
            .replaceAll("$definiteArticle", targetRole?.getDefiniteArticle())
            .replaceAll("$indefiniteArticle", targetRole?.getIndefiniteArticle())
            .replaceAll("$namedAdjective", targetRole?.namedAdjective())
            .replaceAll("$ofDefiniteArticle", targetRole?.getOfDefiniteArticle());

        input.parameters.forEach(param => {
            resultSentence = resultSentence.replace("{string}", `"${param}"`);
        });

        return resultSentence;
    }
}
