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

export class ArchitectService {
    /**
     * Generates a nominal case for the given scenario.
     *
     * @param aiServerUrl - The base URL of the AI server.
     * @param scenario - The scenario to generate a nominal case for.
     * @param targetUrl - Target Url
     * @returns A promise that resolves with the generated nominal case data.
     */
    async generateNominalCase(aiServerUrl: string, scenario: string, targetUrl: string, isBrowserHeadless: boolean): Promise<{ result: string }> {
        const url = `${aiServerUrl}/api/v1/architect/generate-nominal-case`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    targetUrl,
                    scenario,
                    isBrowserHeadless,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching nominal case: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to generate nominal case:", error);
            throw error;
        }
    }
}
