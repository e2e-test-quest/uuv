import { getLanguageModel } from "../../utils";
import { ImageClassifierService } from "./image-classifier.service";
import { generateText } from "ai";

jest.mock("ai", () => ({
    ...jest.requireActual("ai"),
    generateText: jest.fn(),
}));

describe("image-classifier.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should correctly classify an image", async () => {
        const mockLLMResponse = {
            image_description: "a burned up old outdated computer sitting on a desk",
            is_decorative: true,
            confidence: 0.8,
            analysis_details: "More details"
        };
        (generateText as jest.Mock).mockResolvedValue({
            output: mockLLMResponse,
        });

        const model = getLanguageModel("ollama/ministral-3:8b", "http://localhost:11434");
        const imageClassifier = new ImageClassifierService(model);
        const htmlContent =
            "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Technology History</title>\n</head>\n<body>\n    <article>\n        <h1>Museum Accident</h1>\n        <p>Tragedy struck our tech exhibit: a vintage PC was partially destroyed in an unexpected incident. The charred remains of this once-prized machine serve as a stark reminder of how fragile even our most treasured pieces of history can be. While the damage is unfortunate, it highlights the resilience of our collection and the stories each artifact carries—even in the face of accidents.</p>\n        <img src=\"http://farm1.staticflickr.com/149/437547179_84c28a4c37_z.jpg\" alt=\"Old computer on desk\">\n    </article>\n</body>\n</html>";
        const result = await imageClassifier.classify({
            htmlContent,
            imageCssSelector: "img",
            imageDescription: "a burned up old outdated computer sitting on a desk",
        });
        expect(result).toBe(mockLLMResponse);
    });
});
