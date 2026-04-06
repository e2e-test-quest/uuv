import z from "zod";

export const AccessibleElementSchema = z.object({
  accessibleName: z.string()
                    .describe(
                      "The accessible name of the element (from aria-label, aria-labelledby, label, placeholder, text content, title, alt...)"
                    ),
  accessibleRole: z.string()
                    .describe(
                      "The ARIA role of the element (button, textbox, checkbox, link, combobox, dialog, heading, img, listitem...)"
                    ),
  value: z.string().optional()
          .describe("The value to use if the action requires input (fill, select...)"),
});

export const TypeStepSchema = z.object({
  stepNumber: z.number(),
  action: z.literal("type"),
  targetElement: AccessibleElementSchema,
  valueToType: z.string().describe("The value to type"),
  description: z.string().describe("Human-readable description of this step"),
});

export const InteractionStepSchema = z.object({
  stepNumber: z.number(),
  action: z.enum(["expect", "click", "within"]).describe(
    "What to do with this element in the scenario (e.g. click, expect to be visible, within the element)"
  ),
  targetElement: AccessibleElementSchema,
  description: z.string().describe("Human-readable description of this step"),
});

export const NavigationStepSchema = z.object({
  stepNumber: z.number(),
  action: z.literal("navigation").describe(
    "Use ONLY when navigating to a new URL. Do NOT use for clicks or interactions."
  ),
  targetUrl: z.string().describe("Target Url"),
  description: z.string().describe("Human-readable description of this step"),
});

export const StepSchema = z.discriminatedUnion("action", [
  TypeStepSchema,
  InteractionStepSchema,
  NavigationStepSchema,
]);

export type Step = z.infer<typeof StepSchema>;

export const ScenarioResultSchema = z.object({
  scenarioTitle: z.string().describe("Short title for this test scenario"),
  givenSteps: z.array(StepSchema).describe("Preconditions that set up the initial context of the scenario"),
  whenSteps: z.array(StepSchema).describe("Actions or events that trigger the behavior being tested"),
  thenSteps: z.array(StepSchema).describe("Expected outcomes that verify the system behaved correctly")
});

export type ScenarioResult = z.infer<typeof ScenarioResultSchema>;
