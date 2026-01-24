import path from "path";
import fs from "node:fs";


export function getBaseUrl(projectPath: string): string {
    // eslint-disable-next-line dot-notation
    const fromEnv = process.env["UUV_BASE_URL"];
    if (fromEnv) {
        return fromEnv;
    }

    const configs = [
        {
            path: path.resolve(projectPath, "uuv/playwright.config.ts"),
            key: /baseURL\s*:\s*['"`](.*?)['"`]/
        },
        {
            path: path.resolve(projectPath, "uuv/cypress.config.ts"),
            key: /baseUrl\s*:\s*['"`](.*?)['"`]/
        }
    ];

    for (const { path: configPath, key } of configs) {
        if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath, "utf-8");
            const match = content.match(key);
            if (match && match[1]) {
                return match[1];
            }
        }
    }

    return "";
}
