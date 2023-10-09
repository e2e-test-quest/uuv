import { defineConfig } from "cypress";
import { setupNodeEvents } from "./src/cypress/cypress.config";

export default defineConfig({
    port: 9000,
    video: true,
    e2e: {
        baseUrl: "https://e2e-test-quest.github.io/simple-webapp",
        specPattern: ["e2e/**/*.cy.ts", "e2e/**/*.feature"],
        excludeSpecPattern: ["e2e/**/*.playbook.feature", "e2e/**/*.playbooked.feature"],
        supportFile: false,
        setupNodeEvents,
        viewportWidth: 1536,
        videoUploadOnPasses: false
    }
});
