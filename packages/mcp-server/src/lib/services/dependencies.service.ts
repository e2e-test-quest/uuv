import { execSync } from "child_process";
import path from "path";
import fs from "node:fs";

export type PackageManager = "npm" | "yarn" | "pnpm";

/**
 * Detect the package manager being used based on UUV_NPM_USER_AGENT environment variable.
 * @returns The detected package manager: "npm", "yarn", or "pnpm"
 */
export function detectPackageManager(): PackageManager {
    // eslint-disable-next-line dot-notation
    const userAgent = process.env["UUV_NPM_USER_AGENT"];

    if (!userAgent) {
        return "npm";
    }

    if (userAgent.toLowerCase().includes("yarn")) {
        return "yarn";
    }

    if (userAgent.toLowerCase().includes("pnpm")) {
        return "pnpm";
    }

    return "npm";
}

/**
 * Install dependencies using the detected package manager.
 * @param projectPath - Path to the project directory
 * @param packageName - Optional package name to install (defaults to @uuv/playwright)
 */
export function installUuvDependency(projectPath: string, packageName = "@uuv/playwright"): void {
    const packageManager = detectPackageManager();
    const command = getInstallCommand(packageManager, packageName);

    try {
        execSync(command, {
            cwd: projectPath,
            stdio: "inherit",
            env: process.env,
        });
    } catch (error) {
        throw new Error(`Failed to install ${packageName}: ${(error as Error).message}`);
    }
}

/**
 * Check if a package is installed in the project by parsing package.json.
 * @param projectPath - Path to the project directory
 * @param packageName - Package name to check (defaults to @uuv/playwright)
 * @returns true if the package is installed, false otherwise
 */
export function checkUuvDependency(projectPath: string, packageName = "@uuv/playwright"): boolean {
    const packageJsonPath = path.resolve(projectPath, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return false;
    }

    try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageJsonContent);

        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        return packageName in dependencies || packageName in devDependencies;
    } catch {
        return false;
    }
}

/**
 * Get the installed version of a package.
 * @param projectPath - Path to the project directory
 * @param packageName - Package name to get version for (defaults to @uuv/playwright)
 * @returns The installed version as a string, or null if not installed
 */
export function getVersion(projectPath: string, packageName = "@uuv/playwright"): string | null {
    const packageJsonPath = path.resolve(projectPath, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return null;
    }

    try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageJsonContent);

        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        if (packageName in dependencies) {
            return dependencies[packageName];
        }

        if (packageName in devDependencies) {
            return devDependencies[packageName];
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Get the install command for a specific package manager.
 * @param packageManager - The package manager to get command for
 * @param packageName - The package to install
 * @returns The full command string to execute
 */
function getInstallCommand(packageManager: PackageManager, packageName: string): string {
    switch (packageManager) {
        case "yarn":
            return `yarn add --dev ${packageName}`;
        case "pnpm":
            return `pnpm add --dev ${packageName}`;
        case "npm":
        default:
            return `npm install -D ${packageName}`;
    }
}
