import path from "path";
import { ExpectTableService } from "./expect.service";

describe("ExpectService", () => {
    describe("generateForTable", () => {
        it("should generate script for table", async () => {
            const baseUrl = "http://example.com";
            const innerHtmlFilePath = path.join(__dirname, "../tests/mock-table.html");

            const result = await ExpectTableService.generateExpectForTable(baseUrl, innerHtmlFilePath);

            expect(result).toEqual(
                "Feature: Your amazing feature name\n" +
                    "  Scenario: Action - Expect Array\n" +
                    `    Given I visit path "${baseUrl}"\n` +
                    "    Then I should see a table named \"Mock table\" and containing \n" +
                    "      | Company                      | Contact          | Country |\n" +
                    "      | ---------------------------- | ---------------- | ------- |\n" +
                    "      | Alfreds Futterkiste          | Maria Anders     | Germany |\n" +
                    "      | Centro comercial Moctezuma   | Francisco Chang  | Mexico  |\n" +
                    "      | Ernst Handel                 | Roland Mendel    | Austria |\n" +
                    "      | Island Trading               | Helen Bennett    | UK      |\n" +
                    "      | Laughing Bacchus Winecellars | Yoshi Tannamuri  | Canada  |\n" +
                    "      | Magazzini Alimentari Riuniti | Giovanni Rovelli | Italy   |\n"
            );
        });
    });
});
