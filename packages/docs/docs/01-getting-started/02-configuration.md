import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configuration

:::info[✨ New: AI-Powered Test Generation with MCP]
Get started even faster with **[@uuv/mcp-server](/docs/tools/uuv-mcp-server)** - the AI-driven solution that automatically generates human-readable Gherkin test scenarios! Integrate LLMs like OpenAI, Anthropic, and Google to explore your app and generate accessible E2E tests in minutes.
:::

## Update of the .gitignore

Edit the `.gitignore` file to add the following lines :

```gitignore title='.gitignore'
#@uuv
/uuv/reports
/uuv/.uuv-features-gen
```

## IDE Plugins

### IntelliJ

- Download the [cucumber.js](https://plugins.jetbrains.com/plugin/7418-cucumber-js) plugin **for autocompletion** while writing your tests.
- Install [UUV Jetbrains Plugin](/docs/tools/uuv-jetbrains-plugin) **for test execution inside ide**

### VS Code

- **For autocompletion** while writing your tests, download the [Cucumber](https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official) plugin.<br/>Then, create or edit the `.vscode/settings.json` file to add the following lines :
    ```json title='.vscode/settings.json'
    {
        "cucumber.features": ["uuv/e2e/**/*.feature"],
        "cucumber.glue": [
            "uuv/cucumber/step_definitions/**/*.{js,ts}",
            "node_modules/@uuv/*/src/cucumber/step_definitions/*/unsafe/**/*.ts",
            "node_modules/@uuv/*/src/cucumber/step_definitions/*/generated/**/*.ts",
            "node_modules/@uuv/*/src/cucumber/step_definitions/*/generated/enriched/*/*.ts"
        ]
    }
    ```
- Install [UUV VS Code Extension](/docs/tools/uuv-vscode-extension) **for test execution inside ide**

## Dev Containers (Optional)

To configure [Dev Container](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers), add the following files :

```json title='.devcontainer/devcontainer.json'
{
    "name": "UUV TestSpace",
    "service": "uuv-e2e-testspace",
    "dockerComposeFile": "docker-compose.yml",
    "customizations": {
        "vscode": {
            "extensions": ["CucumberOpen.cucumber-official", "e2e-test-quest.uuv-vscode-extension"],
            "settings": {
                "cucumber.features": ["uuv/e2e/**/*.feature"],
                "cucumber.glue": [
                    "uuv/cucumber/step_definitions/**/*.{js,ts}",
                    "node_modules/@uuv/*/src/cucumber/step_definitions/*/unsafe/**/*.ts",
                    "node_modules/@uuv/*/src/cucumber/step_definitions/*/generated/**/*.ts",
                    "node_modules/@uuv/*/src/cucumber/step_definitions/*/generated/enriched/*/*.ts"
                ]
            }
        }
    },
    "forwardPorts": [8080],
    "workspaceFolder": "/workspace",
    "postCreateCommand": "npm install"
}
```

```yml title='.devcontainer/docker-compose.yml'
services:
    uuv-e2e-testspace:
        image: e2etesting/uuv
        command: sleep infinity
        environment:
            DISPLAY: ":14"
            LIBGL_ALWAYS_INDIRECT: 0
        volumes:
            - ..:/workspace
            - cypress-cache:/root/.cache/Cypress/
        volumes_from:
            - x11-bridge:rw
        depends_on:
            - x11-bridge

    x11-bridge:
        image: jare/x11-bridge
        volumes:
            - "/tmp/.X11-unix:/tmp/.X11-unix:rw"
        ports:
            - "8080:8080"
        restart: always
        environment:
            MODE: tcp
            XPRA_HTML: "yes"
            DISPLAY: ":14"
            XPRA_TCP_PORT: "8080"
            XPRA_PASSWORD: uuv

volumes:
    cypress-cache:
```
