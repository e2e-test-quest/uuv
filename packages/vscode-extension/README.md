# UUV Visual Code Extension

![UUV Logo](./packages/vscode-extension/uuv.png)<br/>
VS Code extension for UUV end-to-end tests.<br/>
[UUV](https://e2e-test-quest.github.io/uuv/)(User-centric Usescases Validator) is An accessibility driven open source solution to facilitate the writing of end-to-end tests and ensure accessibility best practices are properly applied.

## Requirements

You must either have `@uuv/cypress` or `@uuv/playwright` as dev dependency [installed](https://e2e-test-quest.github.io/uuv/docs/getting-started/installation) from your package.json

## Features

### Execute **uuv open**
Open the runner : find `UUV Open` vscode command.<br/>
![UUV Open](./packages/vscode-extension/docs/images/uuv-open.png)

### Execute **uuv e2e**
From the `Testing view`, you can see and execute your uuv tests.<br/>
![UUV E2E](./packages/vscode-extension/docs/images/uuv-e2e.png)

### Execute **uuv assistant**
[@uuv/assistant](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-assistant) is a component that helps you generate sentences with a user-centric approach for your test scenario.<br/>
Open uuv assistant : find `UUV Assistant` vscode command.<br/>
![UUV Assistant](./packages/vscode-extension/docs/images/uuv-assistant.png)


## Extension settings

| Parameter             | Required | Default value | Description                                                                                |
|-----------------------|----------|---------------|--------------------------------------------------------------------------------------------|
| uuv.projectHomeDir    | Yes      | `.`           | Must be the directory containing the package.json where the uuv dependency is installed    |
| uuv.useLocalScript    | No       |               | Check this box if for some reason you are unable to run **npx scripts** from your ide      |

## Documentation
For more information on the UUV solution, please consult our online [documentation](https://e2e-test-quest.github.io/uuv/).

## Release Notes
See [changelog](https://github.com/e2e-test-quest/uuv/blob/main/packages/vscode-extension/CHANGELOG.md) on git repository.

## License

[<a href="https://github.com/e2e-test-quest/uuv/blob/main/LICENSE">  
<img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"/>  
</a>](https://spdx.org/licenses/MIT.html)

This project is licensed under the terms of the [MIT license](https://github.com/e2e-test-quest/uuv/blob/main/LICENSE).

## Support UUV through Open Collective

If you want to help UUV grow, you can fund the project directly via [Open Collective](https://opencollective.com/uuv).  
Every contribution helps us dedicate more time and energy to improving this open-source tool.

<a href="https://opencollective.com/uuv/contribute" target="_blank">
  <img src="https://opencollective.com/uuv/contribute/button@2x.png?color=blue" width=300 />
</a>


Interested in becoming a sponsor?  
We welcome sponsorships of all sizes!  
Contact us via [GitHub](https://github.com/e2e-test-quest/uuv/discussions) or through [Open Collective](https://opencollective.com/uuv) to discuss opportunities.

## Authors

- [@luifr10](https://github.com/luifr10)
- [@stanlee974](https://github.com/stanlee974)
