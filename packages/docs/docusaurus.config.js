// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const rgaaCoveragePlugin= require("./src/plugins/rgaa-coverage.plugin");

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "UUV",
  tagline: "Discovering your application by usecase validation",
  favicon: "img/uuv.png",
  // Set the production url of your site here
  url: "https://e2e-test-quest.github.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/uuv/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  projectName: "UUV Documentation",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["fr", "en"]
  },
  scripts: [
    { src: "/uuv/script/analytics.js", async: false }
  ],
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          beforeDefaultRemarkPlugins: [rgaaCoveragePlugin]
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      })
    ]
  ],

  themeConfig:
  /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "UUV",
        logo: {
          alt: "UUV",
          src: "img/uuv.png"
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs"
          },
          {
            href: "https://github.com/e2e-test-quest/uuv/",
            label: "Github",
            position: "right"
          },
          {
            type: "localeDropdown",
            position: "right"
          }
        ]
      },
      metadata: [{
        name: "keywords", content: "uuv, UUV, E2E, end-to-end, test, testing, " +
          "cypress, testing-library, accessibility, accessibilite, a11y, cucumber, " +
          "gherkin"
      }],
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Docs",
                to: "/docs/intro"
              }
            ]
          },
          {
            title: "Authors",
            items: [
              {
                label: "Louis Fredice NJAKO MOLOM",
                href: "https://github.com/luifr10"
              },
              {
                label: "Stanley SERVICAL",
                href: "https://github.com/stanlee974"
              }
            ]
          },
          {
            title: "Funding",
            items: [
              {
                html:`
                <a id="contribution" href="https://opencollective.com/uuv/contribute" target="_blank">
                  <img src="https://opencollective.com/uuv/contribute/button@2x.png?color=blue" width=300 />
                </a>
                `
              }
            ]
          },
        ]
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["json", "gherkin"]
      },
      colorMode: {
        defaultMode: "dark"
      }
    }),
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        indexDocs: true,
        indexBlog: false,
        language: "fr",
        searchResultContextMaxLength: 8
      }
    ]
  ]
};
export default config;
