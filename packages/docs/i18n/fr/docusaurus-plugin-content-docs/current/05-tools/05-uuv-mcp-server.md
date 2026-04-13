# Serveur MCP UUV

## Introduction

`@uuv/mcp-server` est un serveur Model Context Protocol (MCP) pour UUV — une solution qui facilite l'écriture et l'exécution de tests end-to-end (E2E) compréhensibles par tout être humain (anglais ou français) en utilisant Cucumber (BDD) et Playwright ou Cypress.

En tant que serveur MCP, `@uuv/mcp-server` fait le lien entre les modèles IA et les capacités de test E2E. Il permet aux assistants IA de générer des scénarios de test Gherkin lisibles par un humain pour les applications web, en prenant en charge les langues anglaise et française. Le serveur s'intègre aux fournisseurs LLM populaires (OpenAI, Anthropic, Google, Ollama) pour fournir une génération et une validation de tests pilotées par l'IA.

### Principaux avantages

- **Génération de tests pilotée par l'IA** : Génère automatiquement des scénarios Gherkin à partir de descriptions en langage naturel
- **Accessibilité en priorité** : Les tests sont conçus avec l'accessibilité en tête en utilisant les rôles et noms ARIA
- **Framework agnostique** : Fonctionne avec Playwright et Cypress
- **Conformité BDD** : Utilise la syntaxe Gherkin pour des spécifications de test claires et lisibles
- **Support multi-langues** : Les scénarios de test peuvent être écrits en anglais ou en français

## Installation

### Prérequis

- **Node.js 20 ou supérieur**

### LLM pris en charge

`@uuv/mcp-server` prend en charge les fournisseurs LLM suivants :

- **OpenAI** : `openai/gpt-4.1`, `openai/gpt-3.5-turbo`, etc.
- **Anthropic** : `anthropic/claude-haiku-4-5`, `anthropic/claude-sonnet-4-6`, etc.
- **Google** : `google/gemini-2.0-flash`, `google/gemini-pro`, etc.
- **Ollama** : `ollama/qwen3-coder-next`, `ollama/llama3`, etc.

### Configuration MCP

#### Configuration MCP standard

```json
{
    "mcpServers": {
        "uuv": {
            "command": "npx",
            "args": ["@uuv/mcp-server@latest"],
            "env": {
                "UUV_LLM_MODEL": "anthropic/claude-haiku-4-5",
                "UUV_JSON_FLAT_MODEL_ENABLED": true
            }
        }
    }
}
```

#### Configuration Opencode

```json
{
    "$schema": "https://opencode.ai/config.json",
    "mcp": {
        "uuv": {
            "type": "local",
            "command": ["npx", "@uuv/mcp-server@latest"],
            "enabled": true,
            "timeout": 300000,
            "environment": {
                "UUV_LLM_MODEL": "anthropic/claude-sonnet-4-6"
            }
        }
    }
}
```

Pour une configuration d'agent dédiée, voir : [uuv-assistant.md](./01-uuv-assistant.md)

#### Configuration Claude Code

Ajouter le serveur MCP UUV via CLI :

```bash
claude mcp add uuv npx @uuv/mcp-server@latest
```

#### Configuration Gemini CLI

```bash
gemini extensions install https://github.com/e2e-test-quest/uuv --auto-update
```

---

#### Variables d'environnement

| Variable d'environnement      | Requise                                   | Description                                                                                         |
| ----------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `UUV_LLM_MODEL`               | Oui                                       | Spécifie le modèle LLM utilisé par le serveur MCP. Format : `<fournisseur>/<nomModele>`             |
| `UUV_JSON_FLAT_MODEL_ENABLED` | Recommandé (`true` pour Anthropic/Gemini) | Active le formatage de sortie JSON plat (fortement recommandé pour les modèles Anthropic et Gemini) |
| `UUV_LLM_API`                 | Optionnel (Ollama uniquement)             | Endpoint d'API de base pour les modèles locaux Ollama                                               |

## Utilisation (Prompts MCP)

### Deux modes de génération : exploration intelligente vs génération ciblée

Le `@uuv/mcp-server` propose deux approches complémentaires pour générer vos tests e2e.

---

### 🔍 Prompts avec exploration automatique de l'application

Ces deux prompts sont uniques : **ils naviguent réellement dans votre application** pour comprendre sa structure avant de générer des tests. Plus besoin de remplir manuellement des paramètres — l'IA explore, analyse et produit des scénarios adaptés à votre interface réelle.

| Modèle               | Objectif                                                                       | Paramètres clés                |
| -------------------- | ------------------------------------------------------------------------------ | ------------------------------ |
| `genNominalTestCase` | Génère un scénario de test complet (chemin nominal) en explorant l'application | `testCase`                     |
| `genTestExpectTable` | Vérifie le contenu d'un tableau en inspectant les données réelles              | `baseUrl`, `innerHtmlFilePath` |

**Pourquoi c'est puissant ?** Plutôt que de décrire ce que vous voulez tester, Vous décrivez simplement votre intention — le serveur MCP s'occupe d'explorer votre application, d'identifier les éléments pertinents et de générer un test qui correspond à votre interface réelle.

---

### ⚡ Prompts de génération ciblée

Ces prompts génèrent des tests précis à partir des paramètres que vous fournissez. Parfait pour des cas d'utilisation spécifiques lorsque vous savez exactement quel élément cibler.

| Modèle                     | Objectif                                    | Paramètres clés                    |
| -------------------------- | ------------------------------------------- | ---------------------------------- |
| `installUuvDependency`     | Installer @uuv/playwright                   | —                                  |
| `checkUuvDependency`       | Vérifier le statut d'installation           | —                                  |
| `getUuvVersion`            | Obtenir la version du paquet                | —                                  |
| `genTestClickRoleAndName`  | Cliquer sur un élément via ARIA             | `accessibleName`, `accessibleRole` |
| `genTestClickDomSelector`  | Cliquer sur un élément via un sélecteur CSS | `domSelector`                      |
| `genTestTypeRoleAndName`   | Saisir dans un champ                        | `accessibleName`, `accessibleRole` |
| `genTestExpectDomSelector` | Vérifier l'existence d'un élément (CSS)     | `domSelector`                      |
| `genTestExpectRoleAndName` | Vérifier l'existence d'un élément (ARIA)    | `accessibleName`, `accessibleRole` |
| `genTestWithinRoleAndName` | Se concentrer sur un élément (ARIA)         | `accessibleName`, `accessibleRole` |
| `genTestWithinDomSelector` | Se concentrer sur un élément (CSS)          | `domSelector`                      |

Tous ces prompts suivent un modèle cohérent en trois étapes :

1. Récupérer l'URL de base via `uuv_getBaseUrl`
2. Générer le test avec l'outil `uuv_gen*` approprié
3. Écrire le fichier `.feature` dans `./uuv/e2e`

---

### Exemples

**Vérifier la présence d'un élément** — `genTestExpectRoleAndName`

- `baseUrl` : `https://example.com`
- `accessibleRole` : `button`
- `accessibleName` : `Login`

**Cliquer sur un élément** — `genTestClickRoleAndName`

- `baseUrl` : `https://example.com`
- `accessibleRole` : `link`
- `accessibleName` : `Products`

**Saisir dans un champ de formulaire** — `genTestTypeRoleAndName`

- `baseUrl` : `https://example.com`
- `accessibleRole` : `textbox`
- `accessibleName` : `Search`
- `value` : `laptop`

## Outils MCP

Ce serveur MCP expose les outils suivants :

### getBaseUrl

- **Description** : Récupère l'URL de base du projet pour les tests UUV générés. En termes de priorité, la variable d'environnement UUV_BASE_URL est lue, et si elle est vide, la valeur du champ baseURL dans le fichier projectPath/uuv/playwright.config.ts ou projectPath/uuv/cypress.config.ts est vérifiée.
- **Schéma d'entrée** :
    - `projectPath` (string) : Chemin absolu du projet

### availableSentences

- **Description** : Liste toutes les phrases/phrases de test UUV disponibles au format Gherkin.
- **Schéma d'entrée** :
    - `category` (enum, optionnel) : Filtre les phrases par type d'action (général, clavier, clic, contient, saisir, vérifiable)
    - `role` (string, optionnel) : Filtre les phrases liées à un rôle accessible

### genTestExpectRoleAndName

- **Description** : Génère un scénario de test UUV complet (format Gherkin) pour vérifier la présence d'un élément avec le rôle et le nom spécifiés.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve l'élément
    - `accessibleRole` (string) : Rôle accessible de l'élément
    - `accessibleName` (string) : Nom accessible de l'élément

### genTestExpectDomSelector

- **Description** : Génère un scénario de test UUV complet (format Gherkin) pour vérifier la présence d'un élément avec le sélecteur DOM spécifié.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve l'élément
    - `domSelector` (string) : Sélecteur DOM de l'élément

### genTestClickRoleAndName

- **Description** : Génère un scénario de test UUV complet (format Gherkin) qui clique sur l'élément HTML avec le rôle et le nom spécifiés.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve l'élément
    - `accessibleRole` (string) : Rôle accessible de l'élément
    - `accessibleName` (string) : Nom accessible de l'élément

### genTestClickDomSelector

- **Description** : Génère un scénario de test UUV complet (format Gherkin) qui clique sur l'élément HTML avec le sélecteur DOM spécifié.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve l'élément
    - `domSelector` (string) : Sélecteur DOM de l'élément

### genTestWithinRoleAndName

- **Description** : Génère un scénario de test UUV complet (format Gherkin) qui se concentre sur un élément HTML avec le rôle et le nom spécifiés.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve l'élément
    - `accessibleRole` (string) : Rôle accessible de l'élément
    - `accessibleName` (string) : Nom accessible de l'élément

### genTestWithinDomSelector

- **Description** : Génère un scénario de test UUV complet (format Gherkin) qui se concentre sur un élément HTML avec le sélecteur DOM spécifié.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve l'élément
    - `domSelector` (string) : Sélecteur DOM de l'élément

### genTestTypeRoleAndName

- **Description** : Génère un scénario de test UUV complet (format Gherkin) qui saisit une valeur dans un élément HTML avec le rôle et le nom spécifiés.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve l'élément
    - `accessibleRole` (string) : Rôle accessible de l'élément
    - `accessibleName` (string) : Nom accessible de l'élément

### genTestExpectTable (Expérimental)

- **Description** : Génère un scénario de test UUV complet (format Gherkin) pour vérifier la présence et le contenu d'un tableau HTML, d'une grille ou d'un arbregrille.
- **Schéma d'entrée** :
    - `baseUrl` (string) : L'URL de base de la page où se trouve le tableau/grille/arbregrille
    - `innerHtmlFilePath` (string) : Chemin du fichier contenant le contenu innerHTML brut

### genNominalTestCase (Expérimental)

Les fournisseurs LLM supportés sont openai, anthropic, google et ollama

- **Description** : Génère un scénario de test UUV complet (format Gherkin) pour le cas nominal en utilisant l'exploration du navigateur pilotée par l'IA avec les outils Playwright.
- **Schéma d'entrée** :
    - `testCase` (string) : Brève description du scénario de test à générer

### installUuvDependency

- **Description** : Installe le paquet npm @uuv/playwright.
- **Schéma d'entrée** :
    - `projectPath` (string) : Chemin du répertoire du projet
    - `packageName` (string, optionnel) : Nom optionnel du paquet à installer (par défaut : @uuv/playwright)

### checkUuvDependency

- **Description** : Vérifie si @uuv/playwright est installé.
- **Schéma d'entrée** :
    - `projectPath` (string) : Chemin du répertoire du projet

### getUuvVersion

- **Description** : Obtient la version actuelle du paquet npm @uuv/playwright.
- **Schéma d'entrée** :
    - `projectPath` (string) : Chemin du répertoire du projet
