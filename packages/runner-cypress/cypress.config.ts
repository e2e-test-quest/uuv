import { defineConfig } from "cypress";
import { setupNodeEvents } from "./src/cypress/cypress.config";

export default defineConfig({
    port: 9000,
    video: false,
    e2e: {
        baseUrl: "https://e2e-test-quest.github.io/simple-webapp",
        specPattern: "e2e/**/*.{cy.ts,feature}",
        supportFile: false,
        setupNodeEvents,
        viewportWidth: 1536
    }
});
