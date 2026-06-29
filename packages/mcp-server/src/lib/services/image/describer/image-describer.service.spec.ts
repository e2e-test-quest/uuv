import { ImageDescriberService } from "./image-describer.service";
import { getLanguageModel } from "../../utils";
import { readFileSync } from "fs";
import path, { basename } from "path";
import { File } from "node:buffer";
import { generateText } from "ai";

jest.mock("ai", () => ({
    ...jest.requireActual("ai"),
    generateText: jest.fn(),
}));

describe("image-describer.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should correctly return a single description of an image", async () => {
        const mockLLMResponse = "Picture of a cat";
        (generateText as jest.Mock).mockResolvedValue({
            output: {
                imageDescription: mockLLMResponse,
            },
        });
        const model = getLanguageModel("ollama/ministral-3:8b", "http://localhost:11434");
        const imageDescriber = new ImageDescriberService(model);
        const filePath = path.join(__dirname, "../../../tests", "crocus.jpg");
        const buffer = readFileSync(filePath);
        const file = new File([buffer], basename(filePath));
        const result = await imageDescriber.singleDescribe(file);
        expect(result.imageDescription).toBe(mockLLMResponse);
    });

    it("should correctly return multiple descriptions of an image", async () => {
        const mockLLMResponse = ["Picture of a cat", "Garfield"];
        (generateText as jest.Mock).mockResolvedValue({
            output: {
                descriptions: mockLLMResponse,
            },
        });
        const model = getLanguageModel("ollama/ministral-3:8b", "http://localhost:11434");
        const imageDescriber = new ImageDescriberService(model);
        const filePath = path.join(__dirname, "../../../tests", "crocus.jpg");
        const buffer = readFileSync(filePath);
        const file = new File([buffer], basename(filePath));
        const result = await imageDescriber.multipleDescribe(file);
        expect(result.descriptions).toBe(mockLLMResponse);
    });
});
