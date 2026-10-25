import { ImageClassifierService } from "./image-classifier.service";
import { fakeModel } from "@langchain/core/testing";
import { FakeEmbeddings } from "@langchain/core/utils/testing";
import { Similarity } from "./image-classifier.schema";

describe("image-classifier.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should correctly classify an image", async () => {
        const mockLLMResponse: Similarity = {
            similarityScore: 0.5,
            relation: "relatedTheme",
            confidence: 0.8,
            details: "More details",
        };

        const model = fakeModel().structuredResponse(mockLLMResponse);
        const embeddingConfig = new FakeEmbeddings();
        const imageClassifier = new ImageClassifierService(model, {
            embeddings: embeddingConfig,
            calibration: { low: 0.3, high: 0.7 },
        });
        const htmlContent =
            "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Technology History</title>\n</head>\n<body>\n    <article>\n        <h1>Museum Accident</h1>\n        <p>Tragedy struck our tech exhibit: a vintage PC was partially destroyed in an unexpected incident. The charred remains of this once-prized machine serve as a stark reminder of how fragile even our most treasured pieces of history can be. While the damage is unfortunate, it highlights the resilience of our collection and the stories each artifact carries—even in the face of accidents.</p>\n        <img src=\"http://farm1.staticflickr.com/149/437547179_84c28a4c37_z.jpg\" alt=\"Old computer on desk\">\n    </article>\n</body>\n</html>";
        const imageDescription = "a burned up old outdated computer sitting on a desk";
        const result = await imageClassifier.classify({
            htmlContent,
            imageCssSelector: "img",
            imageDescription: imageDescription,
        });
        expect(result).toEqual({
            analysisDetails: mockLLMResponse.details,
            confidence: mockLLMResponse.confidence,
            imageDescription: imageDescription,
            isDecorative: false,
        });
    });
});
