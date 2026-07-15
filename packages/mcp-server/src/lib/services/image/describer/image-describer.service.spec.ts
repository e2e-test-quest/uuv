import { ImageDescriberService } from "./image-describer.service";
import { readFileSync } from "fs";
import path, { basename } from "path";
import { File } from "node:buffer";
import { fakeModel } from "@langchain/core/testing";

describe("image-describer.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should correctly return a single description of an image", async () => {
        const mockLLMResponse = "Picture of a cat";
        const model = fakeModel().structuredResponse({
            imageDescription: mockLLMResponse,
        });
        const imageDescriber = new ImageDescriberService(model);
        const filePath = path.join(__dirname, "../../../tests", "crocus.jpg");
        const buffer = readFileSync(filePath);
        const file = new File([buffer], basename(filePath));
        const result = await imageDescriber.singleDescribe(file);
        expect(result.imageDescription).toBe(mockLLMResponse);
    });

    it("should correctly return multiple descriptions of an image", async () => {
        const mockLLMResponse = ["Picture of a cat", "Garfield"];
        const model = fakeModel().structuredResponse({
            descriptions: mockLLMResponse,
        });
        const imageDescriber = new ImageDescriberService(model);
        const filePath = path.join(__dirname, "../../../tests", "crocus.jpg");
        const buffer = readFileSync(filePath);
        const file = new File([buffer], basename(filePath));
        const result = await imageDescriber.multipleDescribe(file);
        expect(result.descriptions).toBe(mockLLMResponse);
    });
});
