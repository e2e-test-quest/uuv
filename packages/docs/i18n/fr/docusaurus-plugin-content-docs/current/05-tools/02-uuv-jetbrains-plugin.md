# UUV Jetbrains Plugin

Ce plugin vous aide à écrire et à exécuter vos tests UUV E2E depuis les IDE JetBrains.

## Installer le plugin
- Télécharger [UUV Plugin](https://plugins.jetbrains.com/plugin/22437-uuv)
- Ou trouver **"UUV "** à partir de l'onglet Marketplace dans la fenêtre du plugin, puis cliquer sur installer

## Exécuter **open**
1. Dans la barre d'outils principale, sélectionnez la configuration d'exécution UUV ***open***

    ![UUV open Run Config](@site/static/img/docs/jetbrain-plugin/open-run-config.png)

2. Cliquer sur ![le bouton exécuter](https://resources.jetbrains.com/help/img/idea/2023.2/app.actions.execute_dark.svg) ou appuyer sur `Shift` + `F10`.

Cela déclenche l'ouverture de l'interface graphique du runner sélectionné (playwright, cypress, etc).

## Exécuter **e2e**
1. Dans la barre d'outils principale, sélectionnez la configuration d'exécution UUV ***e2e***

    ![UUV e2e Run Config](@site/static/img/docs/jetbrain-plugin/e2e-run-config.png)

2. Cliquer sur ![le bouton exécuter](https://resources.jetbrains.com/help/img/idea/2023.2/app.actions.execute_dark.svg) ou appuyer sur `Shift` + `F10`.

Cela déclenche l'exécution de vos tests e2e uuv (sans l'interface graphique du runner).

## Exécuter uniquement un fichier
1. Ouvrir le fichier de test uuv concerné
2. Cliquer sur ![Run icon](https://resources.jetbrains.com/help/img/idea/2023.2/app.actions.execute_dark.svg) dans la gouttière au niveau du noeud **Feature**, et sélectionner **Run UUV Tests** dans la liste des options.

    ![Execute single file](@site/static/img/docs/jetbrain-plugin/execute-single-file.png)

Cela exécute le fichier de test uuv cible

## Configurations personnalisées
Une configuration d'exécution UUV contient les paramètres suivants :

![Custom run configuration](@site/static/img/docs/jetbrain-plugin/run-custom-run-config.png)

| Paramètres            | Obligatoire | Description                                                                                                                              |
|-----------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Project Directory     | Oui         | Doit être le répertoire contenant le package.json où la dépendance uuv est installée                                                     |
| Target script         | Oui         | `open` : pour ouvrir l'interface graphique du runner<br/> `e2e` : pour exécuter les tests (sans interface graphique du runner)           |
| Use local npm script  | Non         | Cochez cette case si, pour une raison quelconque, vous ne pouvez pas exécuter les scripts **npx** à partir de votre ordinateur           |
| Target test file      | Non         | **Si vide** : tous les fichiers de test seront inclus<br/>**Si défini** : contient un chemin `specPattern` relatif au paramètre ProjetDir |
| Target Browser        | Non         | Valeur par défaut : `chrome`<br/> Navigateur cible pour l'exécution des tests                                                            |
| Environment variables | Non         | Surcharge les variables d'environnements                                                                                                 |

