/**
 * Software Name : UUV
 *
 * SPDX-License-Identifier: MIT
 *
 * This software is distributed under the MIT License,
 * see the "LICENSE" file for more details
 *
 * Authors: NJAKO MOLOM Louis Fredice & SERVICAL Stanley
 * Software description: Make test writing fast, understandable by any human
 * understanding English or French.
 */

const fs = require("fs");
const { execSync } = require("child_process");
const PROJECT_DIR = `${__dirname}/../../../`;
const CLI_DIR = `${__dirname}/dist/lib`;
const TARGET_CONFIG_DIR = `${__dirname}/target-config`;

function copyFile(fileToCopy, originFolder, destFolder) {
    if (fs.existsSync(`${originFolder}/${fileToCopy}`)) {
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
        fs.copyFile(`${originFolder}/${fileToCopy}`, `${destFolder}/${fileToCopy}`, (err) => {
            if (err) {
throw err;
}
            console.log(`File ${destFolder}/${fileToCopy} created`);
        });
    }
}

function copyFileIfMissing(fileToCopy, originFolder, destFolder) {
    if (!fs.existsSync(`${destFolder}/${fileToCopy}`)) {
        copyFile(fileToCopy, originFolder, destFolder);
    }
}

function getUserAgent() {
    return process.env["npm_config_user_agent"]?.startsWith("yarn") ? "yarn" : "npx";
}

function main () {
    if (fs.existsSync(`${PROJECT_DIR}/package.json`) && !fs.existsSync(`${PROJECT_DIR}/.no-postinstall`)) {
        copyFileIfMissing("playwright.config.ts", `${TARGET_CONFIG_DIR}`, `${PROJECT_DIR}/uuv`);
        execSync(`${getUserAgent()} playwright install`, { stdio: "inherit" });
    } else {
        console.log("postinstall - Nothing to copy");
    }
}

main();
