import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx("hero", styles.heroBanner)}>
            <div className="container">
                <img className="hero__logo" src="img/uuv.png" height="150px" />
                <h1 className="hero__title">{siteConfig.title}</h1>
                <h3>User centric Usecases Validator</h3>
                <p className="hero__subtitle">
                    {translate({
                        id: "homepage.headline",
                        message: siteConfig.tagline,
                    })}
                </p>
                <div className={styles.homepageShortDescription}>
                    <p className="">
                        <Translate id="homepage.shortDescription">
                            An accessibility driven solution to facilitate the writing and execution of end-to-end tests that are understandable to
                            any human being.
                        </Translate>
                    </p>
                </div>
                <div className={styles.downloadSection}>
                    <a href={"https://www.npmjs.com/package/@uuv/cypress"} target={"_blank"}>
                        <img
                            alt="@uuv/cypress npm library download count"
                            src="https://img.shields.io/npm/dt/%40uuv/cypress?logo=npm&label=%40uuv%2Fcypress"
                        ></img>
                    </a>
                    <a href={"https://www.npmjs.com/package/@uuv/playwright"} target={"_blank"}>
                        <img
                            alt="@uuv/playwright npm library download count"
                            src="https://img.shields.io/npm/dt/%40uuv/playwright?logo=npm&label=%40uuv%2Fplaywright"
                        ></img>
                    </a>
                    <a href={"https://www.npmjs.com/package/@uuv/assistant"} target={"_blank"}>
                        <img
                            alt="@uuv/assistant npm library download count"
                            src="https://img.shields.io/npm/dt/%40uuv/assistant?logo=npm&label=%40uuv%2Fassistant"
                        ></img>
                    </a>
                    <a href={"https://www.npmjs.com/package/@mcp-server"} target={"_blank"}>
                        <img
                            alt="@uuv/mcp-server npm library download count"
                            src="https://img.shields.io/npm/dt/%40uuv/mcp-server?logo=npm&label=%40uuv%2Fmcp-server"
                        ></img>
                    </a>
                    <a href={"https://plugins.jetbrains.com/plugin/22437-uuv"} target={"_blank"}>
                        <img
                            alt="JetBrains Plugin Downloads"
                            src="https://img.shields.io/jetbrains/plugin/d/22437-uuv?logo=jetbrains&label=UUV%20plugin"
                        ></img>
                    </a>
                    <a href={"https://marketplace.visualstudio.com/items?itemName=e2e-test-quest.uuv-vscode-extension"} target={"_blank"}>
                        <img
                            alt="VS Code Extension Downloads"
                            src="https://img.shields.io/visual-studio-marketplace/d/e2e-test-quest.uuv-vscode-extension?label=UUV%20VS%20Code%20Extension&cacheSeconds=0"
                        ></img>
                    </a>
                    <a href={"https://hub.docker.com/r/e2etesting/uuv"} target={"_blank"}>
                        <img alt="Docker pulls" src="https://img.shields.io/docker/pulls/e2etesting/uuv?logo=docker&cacheSeconds=0"></img>
                    </a>
                </div>
                <div className={styles.buttons}>
                    <Link className={`${styles.button} button button--primary button--lg`} to="docs/intro">
                        <div className={styles.buttonIconWrapper}>
                            <span className={styles.buttonIconGetStarted}></span>
                        </div>
                        <Translate id="homepage.callToAction">Getting Started</Translate>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`Homepage`}  
            description={translate({
                id: 'homepage.headline',
                message: 'Discovering your application by usecase validation'
            })}>
            <HomepageHeader/>
            <main className={'homepage-feature'}>
                <HomepageFeatures/>
            </main>
        </Layout>
    );
}
