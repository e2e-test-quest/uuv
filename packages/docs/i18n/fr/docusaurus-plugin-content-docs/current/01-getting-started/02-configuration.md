import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configuration

:::info[✨ Nouveau : Génération de tests avec l'IA(MCP)]
Démarrez encore plus vite avec **[@uuv/mcp-server](/docs/tools/uuv-mcp-server)** - la solution IA qui génère automatiquement des scénarios Gherkin lisibles par un humain ! Intégrez des LLM comme OpenAI, Anthropic et Google pour explorer votre application et générer des tests E2E accessibles en quelques minutes.
:::

## Mise à jour du .gitignore

Modifier le fichier `.gitignore` pour rajouter les lignes suivantes :

```gitignore title='.gitignore'
#@uuv
/uuv/reports
/uuv/.uuv-features-gen
```

## IDE Plugins
### IntelliJ
- Télécharger le plugin [cucumber.js](https://plugins.jetbrains.com/plugin/7418-cucumber-js) **pour l'autocompletion** lors de l'écriture de vos tests.
- Installer [le plugin Jetbrains UUV](/docs/tools/uuv-jetbrains-plugin) **pour exécuter les tests depuis l'ide**

### VS Code
- **Pour l'autocompletion** lors de l'écriture de vos tests, télécharger le plugin [Cucumber](https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official).<br/>Puis, créer ou modifier le fichier `.vscode/settings.json` afin d'ajouter les lignes suivantes :
    ```json title='.vscode/settings.json'
    {
        "cucumber.features": [
          "uuv/e2e/**/*.feature"
        ],
        "cucumber.glue": [
          "uuv/cucumber/step_definitions/**/*.{js,ts}",
          "node_modules/@uuv/*/src/cucumber/step_definitions/*/unsafe/**/*.ts",
          "node_modules/@uuv/*/src/cucumber/step_definitions/*/generated/**/*.ts",
          "node_modules/@uuv/*/src/cucumber/step_definitions/*/generated/enriched/*/*.ts"
        ]
    }
    ```
- Installer [l'extension VS Code UUV](/docs/tools/uuv-vscode-extension) **pour exécuter les tests depuis l'ide**

## Dev Containers (Facultatif)
Pour configurer un [Dev Container](https://docs.github.com/fr/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers), ajouter les fichiers suivants :
  ```json title='.devcontainer/devcontainer.json'
    {
      "name": "UUV TestSpace",
      "service": "uuv-e2e-testspace",
      "dockerComposeFile": "docker-compose.yml",
      "customizations": {
        "vscode": {
          "extensions": [
            "CucumberOpen.cucumber-official",
            "e2e-test-quest.uuv-vscode-extension"
          ],
          "settings": {
            "cucumber.features": [
              "uuv/e2e/**/*.feature"
            ],
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
