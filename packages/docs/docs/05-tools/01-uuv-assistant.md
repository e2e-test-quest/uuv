import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# UUV Assistant

## Functionalities

### Mouse navigation
![screenshots of mouse navigation](@site/static/img/assistant/mouse.gif)
The UUV assistant can be used to generate UUV phrases for mouse behaviour.

Sentences can be used to check the presence of elements in the HTML DOM, to perform mouse click actions, or to put a mouse focus on an element.

If the sentences have neither a name nor an accessible role, an alert is raised in the results gutter.

### Keyboard navigation
![screenshots of keyboard navigation](@site/static/img/assistant/keyboard.gif)
The UUV assistant can be used to generate UUV phrases for keyboard behaviour.

The sentences are used to check the actual order of keyboard navigation and generate checks sentences accordingly.

## Online demo

<a href="https://uuv-assistant.vercel.app/">
    The online demo is available here.
</a>

## Install
:::caution

### NPM Package
Npm/Yarn will need access to the internet when installing the @uuv/assistant library.

:::

Run the following command :

<Tabs>
<TabItem value="npm" label="Npm">

```shell
npm install --save-dev @uuv/assistant
```

</TabItem>
<TabItem value="Yarn" label="Yarn">

```shell
yarn add -D @uuv/assistant
```

</TabItem>
</Tabs>

### Desktop executable
1. Download executable using the following button :

   <a href="https://github.com/e2e-test-quest/uuv/releases/latest"><img src="https://img.shields.io/badge/download_uuv--assistant_desktop-black?&style=for-the-badge&logo=github&logoColor=white" alt="documentation"/></a>
2. Unzip the downloaded zip file

## Usage
### NPM Package
```shell
npx uuv-assistant --targetUrl=<targetUrl>
```

| Name        | Description                                                                                                   | Example                               |
|-------------|---------------------------------------------------------------------------------------------------------------|---------------------------------------|
| `targetUrl` | Target website url                                                                                            | https://e2e-test-quest.github.io/uuv/ |

### Desktop executable
Execute `uuv-assistant.exe` from the unzipped folder
