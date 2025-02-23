# UUV Jetbrains Plugin

This plugin helps you to write and execute your UUV E2E tests from JetBrains IDEs. 

## Install plugin
- Download [UUV Plugin](https://plugins.jetbrains.com/plugin/22437-uuv)
- Or find **"UUV"** from Marketplace tab in plugin window, then click on install.

## Execute **open**
1. On the main toolbar, select the UUV ***open*** run configuration

    ![UUV open Run Config](@site/static/img/docs/jetbrain-plugin/open-run-config.png)

2. Click ![The Run button](https://resources.jetbrains.com/help/img/idea/2023.2/app.actions.execute_dark.svg) or press `Shift` + `F10`.

It triggers the opening of the selected GUI runner (playwright, cypress, etc).

## Execute **e2e**
1. On the main toolbar, select the UUV ***e2e*** run configuration

    ![UUV e2e Run Config](@site/static/img/docs/jetbrain-plugin/e2e-run-config.png)

2. Click ![The Run button](https://resources.jetbrains.com/help/img/idea/2023.2/app.actions.execute_dark.svg) or press `Shift` + `F10`.

It runs all your e2e uuv tests without GUI runner.

## Execute single file
1. Open the target uuv test file
2. Click the ![Run icon](https://resources.jetbrains.com/help/img/idea/2023.2/app.actions.execute_dark.svg) in the gutter on the **Feature** node, and select **Run UUV Tests** from the list.

    ![Execute single file](@site/static/img/docs/jetbrain-plugin/execute-single-file.png)

It runs the target uuv test file.

## Custom configurations
A UUV Run configuration contains the followings parameters :

![Custom run configuration](@site/static/img/docs/jetbrain-plugin/run-custom-run-config.png)

| Parameter             | Required | Description                                                                                                                     |
|-----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| Project Directory     | Yes      | Must be the directory containing the package.json where the uuv dependency is installed                                         |
| Target script         | Yes      | `open` : to open the GUI runner<br/> `e2e` : to execute tests without GUI runner                                                |
| Use local npm script  | No       | Check this box if for some reason you are unable to run **npx scripts** from your ide                                           |
| Target test file      | No       | **If empty**: all test files will be included<br/>**If set**: contains a `specPattern` path relative to the ProjetDir parameter |
| Target Browser        | No       | Default value: `chrome`<br/> Target browser to execute tests                                                                    |
| Environment variables | No       | Override environment variables                                                                                                  |

