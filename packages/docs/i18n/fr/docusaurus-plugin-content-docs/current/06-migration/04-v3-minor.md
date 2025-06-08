# Migrations des 3.x.x mineurs ou patch

## Modification du navigateur par défaut pour @uuv/playwright
Pour `@uuv/playwright 3.0.1 -> 3.1.0`
- Renommer les noms de navigateurs dans le fichier `uuv/playwright.config.ts`:
  - `name: "Microsoft Edge"` -> `name: "edge"`
  - `name: "Google Chrome"` -> `name: "chrome"`

## Changement de l'import des mots-clés cucumber pour @uuv/playwright
Pour `@uuv/playwright 3.36.0 -> 3.37.0`
- Mettez à jour les imports de vos propres phrases si vous en avez :
  - `import {Given, When, Then} from "@cucumber/cucumber";` -> `import { World, Given, Then } from "@uuv/playwright";`