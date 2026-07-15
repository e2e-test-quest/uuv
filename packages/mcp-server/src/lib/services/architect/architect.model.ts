import z from "zod";

export const AccessibleElementSchema = z.object({
    accessibleName: z
        .string()
        .describe("EXACT string from the Playwright snapshot, do not modify, paraphrase, inferr, or translate. Copy it verbatim."),
    accessibleRole: z
        .string()
        .describe("The ARIA role of the element (button, textbox, checkbox, link, combobox, dialog, heading, img, listitem...)"),
    value: z.string().nullable().describe("The value to use, ONLY USE if the action requires input (select, type, navigation)"),
});

export const SelectStepSchema = z.object({
    stepNumber: z.number(),
    action: z.literal("select"),
    targetElement: z.object({
        accessibleName: z.string().describe("accessible name of the combobox"),
        accessibleRole: z.literal(["combobox"]),
    }),
    valueToSelect: z.string().describe("The value of the option to select into the combobox"),
    stepComment: z.string().describe("Human-readable description of this step"),
});

export const TypeStepSchema = z.object({
    stepNumber: z.number(),
    action: z.literal("type"),
    targetElement: AccessibleElementSchema,
    valueToType: z.string().describe("The value to type"),
    stepComment: z.string().describe("Human-readable description of this step"),
});

export const InteractionStepSchema = z.object({
    stepNumber: z.number(),
    action: z
        .enum(["expect", "click", "within"])
        .describe("What to do with this element in the scenario (e.g. click, expect to be visible, within the element)"),
    targetElement: AccessibleElementSchema,
    stepComment: z.string().describe("Human-readable description of this step"),
});

export const NavigationStepSchema = z.object({
    stepNumber: z.number(),
    action: z.literal("navigation").describe("Use ONLY when navigating to a new URL. Do NOT use for clicks or interactions."),
    targetUrl: z.string().describe("Target Url"),
    targetElement: AccessibleElementSchema.nullish(),
    stepComment: z.string().describe("Human-readable description of this step"),
});

export const StopStepSchema = z.object({
    stepNumber: z.number(),
    action: z.literal("stop").describe("Use ONLY when there is no more actions needed."),
    targetElement: AccessibleElementSchema.nullish(),
});

export const StepSchema = z.discriminatedUnion("action", [
    SelectStepSchema,
    TypeStepSchema,
    InteractionStepSchema,
    NavigationStepSchema,
    StopStepSchema,
]);

export const FlatStepSchema = z.object({
    stepNumber: z.number().describe("Sequential step number in the scenario."),

    action: z
        .enum(["click", "type", "expect", "within", "navigation", "select", "stop"])
        .describe(
            "Action to perform. Determines which other fields are required. 'type' requires valueToType. 'navigation' requires targetUrl. Other actions use targetElement."
        ),

    targetElement: AccessibleElementSchema.nullable().describe(
        "Target UI element of the action. REQUIRED ONLU for click, type, expect, select and within actions"
    ),

    valueToType: z.string().nullable().describe("Text to type into the element. Only used and REQUIRED when action is 'type'."),

    valueToSelect: z
        .string()
        .nullable()
        .describe("The value of the option to select into the combobox. Only used and REQUIRED when action is 'select'"),

    targetUrl: z.string().nullable().describe("Destination URL. ONLY USED and REQUIRED when action is 'navigation'."),

    stepComment: z.string().describe("Very short imperative sentence"),
});

export type AriaElement = {
    accRole: string;
    accName: string | null;
    value: string | null;
    otherAttrs: Record<string, string | boolean> | null;
    children: AriaElement[];
};

export type StepResult = {
    type: "todo" | "success" | "error";
    error: string | null;
    pageSnapshot: AriaElement[] | null;
};

export type Step = z.infer<typeof FlatStepSchema> & {
    result: StepResult;
};

export const ScenarioResultSchema = z.object({
    scenarioTitle: z.string().describe("Short title for this test scenario"),
    givenSteps: z.array(StepSchema).describe("Preconditions that set up the initial context of the scenario"),
    whenSteps: z.array(StepSchema).describe("Actions or events that trigger the behavior being tested"),
    thenSteps: z.array(StepSchema).describe("Expected outcomes that verify the system behaved correctly"),
});

export const FlatScenarioResultSchema = z.object({
    scenarioTitle: z.string().describe("Short title for this test scenario"),
    givenSteps: z.array(FlatStepSchema).describe("Preconditions that set up the initial context of the scenario"),
    whenSteps: z.array(FlatStepSchema).describe("Actions or events that trigger the behavior being tested"),
    thenSteps: z.array(FlatStepSchema).describe("Expected outcomes that verify the system behaved correctly"),
});

export type ScenarioResult = z.infer<typeof ScenarioResultSchema> | z.infer<typeof FlatScenarioResultSchema>;
