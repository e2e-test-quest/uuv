import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Tip from "@theme/Admonition/Type/Tip";
import { FaEye, FaUniversalAccess, FaCode, FaCalendarDays } from "react-icons/fa6";
import { BsPlugFill, BsFillPeopleFill, BsWindowSplit } from "react-icons/bs";
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';
import Card from "../components/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx("hero", styles.heroBanner)}>
            <div className="container">
                <img className="hero__logo" src="img/uuv.png" height="150px" />
                <h1 className="hero__title">
                    With <span className={"baseColor"}>{siteConfig.title}</span>{" "}
                    <Translate id="homepage.hero.title">: Test like a human, Verify like a robot</Translate>
                </h1>
                <h3 className={styles.heroTagline}>
                    <Translate id="homepage.hero.tagline">
                        An accessibility driven solution to facilitate the writing and execution of funtional tests that are understandable to any
                        human being.
                    </Translate>
                </h3>
                <div className={styles.buttons}>
                    <Link className={`${styles.button} button button--primary button--lg`} to="/docs/intro">
                        <div className={styles.buttonIconWrapper}>
                            <span className={styles.buttonIconGetStarted}></span>
                        </div>
                        <Translate id="homepage.hero.ctaStart">Get Started</Translate>
                    </Link>
                    <a
                        className={`${styles.button} button button--secondary button--lg`}
                        href="https://www.cal.eu/fr.dice/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaCalendarDays />
                        <Translate id="homepage.hero.ctaSchedule"> Schedule a demo</Translate>
                    </a>
                </div>
                <div className={styles.codeExampleContainer}>
                    <CodeBlock
                        className={styles.codePanel}
                        title={<Translate id="homepage.hero.uuvTitle">Anyone on your team can write this</Translate>}
                        language="gherkin"
                        showLineNumbers
                    >
                        {`Feature: Hello World
                        
  Scenario: Search - Successful case
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
`}
                    </CodeBlock>
                </div>

                <div className={styles.keyPoints}>
                    <Card className={`${clsx("col col--3")} ${styles.keyPointsCard}`} shadow="tl">
                        <CardHeader className={styles.keyPointsCardHeader}>
                            <FaEye className={styles.keyPointsCardHeaderIcon} />
                            <h3>Readable by the whole team</h3>
                        </CardHeader>
                    </Card>
                    <Card className={`${clsx("col col--3")} ${styles.keyPointsCard}`} shadow="tl">
                        <CardHeader className={styles.keyPointsCardHeader}>
                            <FaUniversalAccess className={styles.keyPointsCardHeaderIcon} />
                            <h3>Improve accessibility</h3>
                        </CardHeader>
                    </Card>
                    <Card className={`${clsx("col col--3")} ${styles.keyPointsCard}`} shadow="tl">
                        <CardHeader className={styles.keyPointsCardHeader}>
                            <BsPlugFill className={styles.keyPointsCardHeaderIcon} />
                            <h3>Playwright or Cypress</h3>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={translate({ id: "homepage.pageTitle", message: "Homepage" })}
            description={translate({
                id: "homepage.headline",
                message: "Discovering your application by usecase validation",
            })}
        >
            <HomepageHeader />

            <div className={"altBackground"}>
                <div className="container">
                    <h2 className={"text--center"}>
                        <Translate id="homepage.why.title">Why it matters</Translate>
                    </h2>
                    <p className={"text--center"}>
                        <Translate id="homepage.why.text">
                            Accessibility isn't a checkbox at the end of a sprint anymore, it's verified automatically, on every test.
                        </Translate>
                    </p>
                    <div className={`row ${styles.keyNumbers}`}>
                        <div className={`col col--3  ${styles.keyNumber}`}>
                            <span className={styles.keyNumberTitle}>+45%</span>
                            <span className={"text--center"}>
                                <Translate id="homepage.why.gain.title">Productivity gain</Translate>
                                <br />
                                <Translate id="homepage.why.gain.subtitle">while writting E2E tests</Translate>
                            </span>
                        </div>
                        <div className={`col col--3  ${styles.keyNumber}`}>
                            <span className={styles.keyNumberTitle}>-60%</span>
                            <span className={"text--center"}>
                                <Translate id="homepage.why.reduction.title">reduction of</Translate>
                                <br />
                                <Translate id="homepage.why.reduction.subtitle">accessibility issues</Translate>
                            </span>
                        </div>
                        <div className={`col col--3  ${styles.keyNumber}`}>
                            <span className={styles.keyNumberTitle}>100%</span>
                            <span className={"text--center"}>
                                <Translate id="homepage.why.oss.title">Open Source</Translate>
                                <br />
                                <Translate id="homepage.why.oss.subtitle">and Free</Translate>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"altBackground"}>
                <div className="container">
                    <h2 className={"text--center"}>
                        <Translate id="homepage.team.title">Built for the whole team</Translate>
                    </h2>
                    <div className={styles.keyPoints}>
                        <Card className={`${clsx("col col--5")} ${styles.keyPointsCard}`} shadow="tl">
                            <CardHeader className={styles.teamCardHeader}>
                                <FaCode className={styles.teamCardHeaderIcon} />
                                <h3>
                                    <Translate id="homepage.team.dev.title">Readable by the whole team</Translate>
                                </h3>
                            </CardHeader>
                            <CardBody>
                                <Translate id="homepage.team.dev.text.1">Plugs into </Translate>
                                <a href={"https://www.npmjs.com/package/@uuv/cypress"} target={"_blank"}>Cypress</a>
                                <Translate id="homepage.team.dev.text.2"> or </Translate>
                                <a href={"https://www.npmjs.com/package/@uuv/playwright"} target={"_blank"}>Playwright</a>
                                <Translate id="homepage.team.dev.text.3"> in minutes and use built-in</Translate>
                                <a href={"/docs/category/description-of-sentences"}>
                                    <Translate id="homepage.team.dev.text.4"> Gherkin Sentences</Translate>
                                </a>
                                <Translate id="homepage.team.dev.text.5">. You can also add custom Gherkin sentence if your need</Translate>
                            </CardBody>
                        </Card>
                        <Card className={`${clsx("col col--5")} ${styles.keyPointsCard}`} shadow="tl">
                            <CardHeader className={styles.teamCardHeader}>
                                <BsFillPeopleFill className={styles.teamCardHeaderIcon} />
                                <h3>
                                    <Translate id="homepage.team.nondev.title">Improve accessibility</Translate>
                                </h3>
                            </CardHeader>
                            <CardBody>
                                <Translate id="homepage.team.nondev.text">
                                    Read, understand and validate test scenarios without writing a line of code
                                </Translate>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>

            <div className={"heroBackground"}>
                <div className="container">
                    <h2 className={"text--center"}>
                        <Translate id="homepage.stack.title">Built to fit your stack</Translate>
                    </h2>
                    <Tip
                        className={"margin-bottom--lg"}
                        title={translate({ id: "homepage.stack.tip.title", message: "✨ New: AI-Powered Test Generation with MCP" })}
                    >
                        <Translate id="homepage.stack.tip.text1">Get started faster with</Translate>{" "}
                        <a href={"docs/tools/uuv-mcp-server"}>@uuv/mcp-server</a>
                        <Translate id="homepage.stack.tip.text2">
                            , an AI-powered solution that explores your app and automatically generates human-readable test scenarios in minutes.
                        </Translate>
                    </Tip>
                    <div className={styles.uuvStack}>
                        <div>
                            <h3>
                                <Translate id="homepage.stack.npm">NPM Packages</Translate>
                            </h3>
                            <div className={styles.packages}>
                                <a href={"https://www.npmjs.com/package/@uuv/cypress"} target={"_blank"}>
                                    <picture>
                                        <source
                                            media="(prefers-color-scheme: dark)"
                                            srcSet="https://shieldcn.dev/npm/dm/%40uuv%2Fcypress.svg?theme=zinc&amp;label=%40uuv%2Fcypress&amp;mode=dark"
                                        />
                                        <img
                                            alt={translate({ id: "homepage.stack.alt.cypress", message: "UUV Cypress NPM Package" })}
                                            src="https://shieldcn.dev/npm/dm/%40uuv%2Fcypress.svg?amp;label=%40uuv%2Fcypress&amp;mode=light"
                                        />
                                    </picture>
                                </a>
                                <a href={"https://www.npmjs.com/package/@uuv/playwright"} target={"_blank"}>
                                    <picture>
                                        <source
                                            media="(prefers-color-scheme: dark)"
                                            srcSet="https://shieldcn.dev/npm/dm/%40uuv%2Fplaywright.svg?theme=zinc&amp;label=%40uuv%2Fplaywright&amp;mode=dark"
                                        />
                                        <img
                                            alt={translate({ id: "homepage.stack.alt.playwright", message: "UUV Playwright NPM Package" })}
                                            src="https://shieldcn.dev/npm/dm/%40uuv%2Fplaywright.svg?amp;label=%40uuv%2Fplaywright&amp;mode=light"
                                        />
                                    </picture>
                                </a>
                                <a href={"https://www.npmjs.com/package/@uuv/assistant"} target={"_blank"}>
                                    <picture>
                                        <source
                                            media="(prefers-color-scheme: dark)"
                                            srcSet="https://shieldcn.dev/npm/dm/%40uuv%2Fassistant.svg?theme=zinc&amp;label=%40uuv%2Fassistant&amp;mode=dark"
                                        />
                                        <img
                                            alt={translate({ id: "homepage.stack.alt.assistant", message: "UUV Assistant NPM Package" })}
                                            src="https://shieldcn.dev/npm/dm/%40uuv%2Fassistant.svg?amp;label=%40uuv%2Fassistant&amp;mode=light"
                                        />
                                    </picture>
                                </a>
                                <a href={"https://www.npmjs.com/package/@uuv/mcp-server"} target={"_blank"}>
                                    <picture>
                                        <source
                                            media="(prefers-color-scheme: dark)"
                                            srcSet="https://shieldcn.dev/npm/dm/%40uuv%2Fmcp-server.svg?theme=zinc&amp;label=%40uuv%2Fmcp-server&amp;mode=dark"
                                        />
                                        <img
                                            alt={translate({ id: "homepage.stack.alt.mcpServer", message: "UUV MCP Server NPM Package" })}
                                            src="https://shieldcn.dev/npm/dm/%40uuv%2Fmcp-server.svg?amp;label=%40uuv%2Fmcp-server&amp;mode=light"
                                        />
                                    </picture>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3>
                                <Translate id="homepage.stack.ide">IDE Plugin</Translate>
                            </h3>
                            <div className={styles.packages}>
                                <a href={"https://marketplace.visualstudio.com/items?itemName=e2e-test-quest.uuv-vscode-extension"} target={"_blank"}>
                                    <img
                                        alt={"badge"}
                                        src="https://shieldcn.dev/vscode/installs/e2e-test-quest/uuv-vscode-extension.svg?variant=branded&amp;label=VS+Code+extension"
                                    />
                                </a>
                                <a href={"https://plugins.jetbrains.com/plugin/22437-uuv"} target={"_blank"}>
                                    <img
                                        className={styles.jetbrainPlugin}
                                        alt={translate({ id: "homepage.stack.alt.jetbrainsPlugin", message: "UUV Jetbrain Plugin" })}
                                        src="https://img.shields.io/jetbrains/plugin/d/22437-uuv?style=flat&logo=jetbrains&label=UUV%20Plugin&labelColor=%2318181b&color=%2318181b"
                                    />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3>
                                <Translate id="homepage.stack.desktop">Desktop</Translate>
                            </h3>
                            <div className={styles.packages}>
                                <a
                                    className={`button button--secondary button--md ${styles.uuvAssistantDesktopButton}`}
                                    href="https://github.com/e2e-test-quest/uuv/releases/latest"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <BsWindowSplit />
                                    <Translate id="homepage.hero.ctaDemo">UUV Assistant Desktop App</Translate>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className={"margin--none"} />
        </Layout>
    );
}
