import { execSync } from "child_process";
import path from "path";
import fs from "node:fs";
import { detectPackageManager, checkUuvDependency, getVersion, installUuvDependency } from "./dependencies.service";

// Mock modules
jest.mock("child_process", () => ({
    execSync: jest.fn(),
}));
jest.mock("node:fs", () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
}));
jest.mock("process", () => ({
    env: {},
}));

const { execSync: mockExecSync } = jest.requireMock("child_process");
const { existsSync: mockExistsSync, readFileSync: mockReadFileSync } = jest.requireMock("node:fs");

describe("dependencies.service", () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        // Reset process.env
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        // Restore original env
        process.env = originalEnv;
    });

    describe("detectPackageManager", () => {
        it("should return \"npm\" when UUV_NPM_USER_AGENT is not set", () => {
            // eslint-disable-next-line dot-notation
            delete(process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"];

            const result = detectPackageManager();

            expect(result).toBe("npm");
        });

        it("should return \"yarn\" when UUV_NPM_USER_AGENT contains with \"yarn\"", () => {
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "yarn/1.22.19";

            const result = detectPackageManager();

            expect(result).toBe("yarn");
        });

        it("should return \"pnpm\" when UUV_NPM_USER_AGENT contains \"pnpm\"", () => {
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "pnpm/8.6.0";

            const result = detectPackageManager();

            expect(result).toBe("pnpm");
        });

        it("should return \"npm\" when UUV_NPM_USER_AGENT is an empty string", () => {
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "";

            const result = detectPackageManager();

            expect(result).toBe("npm");
        });

        it("should return \"npm\" when UUV_NPM_USER_AGENT does not match any pattern", () => {
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "custom-agent/1.0.0";

            const result = detectPackageManager();

            expect(result).toBe("npm");
        });
    });

    describe("installDependencies", () => {
        const mockProjectPath = "/test/project";
        const mockPackageName = "@uuv/playwright";

        it("should execute installation when package manager is npm", () => {
            // Mock UUV_NPM_USER_AGENT to trigger npm detection
            // eslint-disable-next-line dot-notation
            delete(process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"];

            installUuvDependency(mockProjectPath, mockPackageName);

            expect(mockExecSync).toHaveBeenCalledWith("npm install -D @uuv/playwright", {
                cwd: mockProjectPath,
                stdio: "inherit",
                env: process.env,
            });
        });

        it("ld execute installation when package manager is yarn", () => {
            // Mock UUV_NPM_USER_AGENT to trigger yarn detection
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "yarn/1.22.19";

            installUuvDependency(mockProjectPath, mockPackageName);

            expect(mockExecSync).toHaveBeenCalledWith("yarn add --dev @uuv/playwright", {
                cwd: mockProjectPath,
                stdio: "inherit",
                env: process.env,
            });
        });

        it("ld execute installation when package manager is pnpm", () => {
            // Mock UUV_NPM_USER_AGENT to trigger pnpm detection
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "pnpm/8.6.0";

            installUuvDependency(mockProjectPath, mockPackageName);

            expect(mockExecSync).toHaveBeenCalledWith("pnpm add --dev @uuv/playwright", {
                cwd: mockProjectPath,
                stdio: "inherit",
                env: process.env,
            });
        });

        it("should use default package name when not provided", () => {
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "npm";

            installUuvDependency(mockProjectPath);

            expect(mockExecSync).toHaveBeenCalledWith("npm install -D @uuv/playwright", {
                cwd: mockProjectPath,
                stdio: "inherit",
                env: process.env,
            });
        });

        it("should use custom package name when provided", () => {
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "npm";

            const customPackage = "lodash";
            installUuvDependency(mockProjectPath, customPackage);

            expect(mockExecSync).toHaveBeenCalledWith("npm install -D lodash", {
                cwd: mockProjectPath,
                stdio: "inherit",
                env: process.env,
            });
        });

        it("should throw error when installation failed", () => {
            // eslint-disable-next-line dot-notation
            (process.env as Record<string, string | undefined>)["UUV_NPM_USER_AGENT"] = "npm";

            const errorMessage = "Installation failed";
            (mockExecSync as jest.Mock).mockImplementationOnce(() => {
                throw new Error(errorMessage);
            });

            expect(() => {
                installUuvDependency(mockProjectPath, mockPackageName);
            }).toThrow(`Failed to install ${mockPackageName}: ${errorMessage}`);
        });
    });

    describe("checkUuvDependency", () => {
        const mockProjectPath = "/test/project";
        const mockPackageName = "@uuv/playwright";

        it("should return false when package.json does not exist", () => {
            mockExistsSync.mockReturnValue(false);

            const result = checkUuvDependency(mockProjectPath, mockPackageName);

            expect(result).toBe(false);
            expect(mockExistsSync).toHaveBeenCalledWith(path.resolve(mockProjectPath, "package.json"));
        });

        it("should return true when package is in dependencies", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {},
                    devDependencies: {
                        [mockPackageName]: "^1.0.0",
                    },
                })
            );

            const result = checkUuvDependency(mockProjectPath, mockPackageName);

            expect(result).toBe(true);
            expect(mockReadFileSync).toHaveBeenCalledWith(path.resolve(mockProjectPath, "package.json"), "utf-8");
        });

        it("should return false when package is not in dependencies or devDependencies", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {
                        lodash: "^4.17.21",
                    },
                    devDependencies: {
                        jest: "^29.0.0",
                    },
                })
            );

            const result = checkUuvDependency(mockProjectPath, mockPackageName);

            expect(result).toBe(false);
        });

        it("should return false when package.json is invalid JSON", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue("invalid json {");

            const result = checkUuvDependency(mockProjectPath, mockPackageName);

            expect(result).toBe(false);
        });

        it("should return false when package.json parsing fails for other reasons", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockImplementationOnce(() => {
                throw new Error("Read error");
            });

            const result = checkUuvDependency(mockProjectPath, mockPackageName);

            expect(result).toBe(false);
        });

        it("should handle empty dependencies object", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {},
                    devDependencies: {},
                })
            );

            const result = checkUuvDependency(mockProjectPath, mockPackageName);

            expect(result).toBe(false);
        });

        it("should use default package name when not provided", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {
                        "@uuv/playwright": "^1.0.0",
                    },
                    devDependencies: {},
                })
            );

            const result = checkUuvDependency(mockProjectPath);

            expect(result).toBe(true);
        });
    });

    describe("getVersion", () => {
        const mockProjectPath = "/test/project";
        const mockPackageName = "@uuv/playwright";

        it("should return null when package.json does not exist", () => {
            mockExistsSync.mockReturnValue(false);

            const result = getVersion(mockProjectPath, mockPackageName);

            expect(result).toBeNull();
            expect(mockExistsSync).toHaveBeenCalledWith(path.resolve(mockProjectPath, "package.json"));
        });

        it("should return version when package is in dependencies", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {
                    },
                    devDependencies: {
                        [mockPackageName]: "^1.2.3",
                    },
                })
            );

            const result = getVersion(mockProjectPath, mockPackageName);

            expect(result).toBe("^1.2.3");
        });

        it("should return null when package is not installed", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {
                        lodash: "^4.17.21",
                    },
                    devDependencies: {
                        jest: "^29.0.0",
                    },
                })
            );

            const result = getVersion(mockProjectPath, mockPackageName);

            expect(result).toBeNull();
        });

        it("should return null when package.json is invalid JSON", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue("invalid json {");

            const result = getVersion(mockProjectPath, mockPackageName);

            expect(result).toBeNull();
        });

        it("should return null when package.json parsing fails for other reasons", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockImplementationOnce(() => {
                throw new Error("Parse error");
            });

            const result = getVersion(mockProjectPath, mockPackageName);

            expect(result).toBeNull();
        });

        it("should return null for empty dependencies object", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {},
                    devDependencies: {},
                })
            );

            const result = getVersion(mockProjectPath, mockPackageName);

            expect(result).toBeNull();
        });

        it("should use default package name when not provided", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {
                        "@uuv/playwright": "^1.0.0",
                    },
                    devDependencies: {},
                })
            );

            const result = getVersion(mockProjectPath);

            expect(result).toBe("^1.0.0");
        });

        it("should handle version with exact format (no caret or tilde)", () => {
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(
                JSON.stringify({
                    dependencies: {
                    },
                    devDependencies: {
                        [mockPackageName]: "1.0.0",
                    },
                })
            );

            const result = getVersion(mockProjectPath, mockPackageName);

            expect(result).toBe("1.0.0");
        });
    });
});
