import path from "path";
import fs from "fs";

/**
 * Update Chart.js version in the HTML report files.
 *
 * @param reportDir
 * @param {string} oldVersion - old Chart.js version (ex: '2.5.0')
 * @param {string} newVersion - new Chart.js version (ex: '2.6.0')
 */
export function updateChartJsVersion(reportDir: string, oldVersion, newVersion) {
    const oldScript = `<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/${oldVersion}/Chart.min.js"></script>`;
    const newScript = `<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/${newVersion}/Chart.min.js"></script>`;

    const baseDir = reportDir;
    const filesToUpdate = ["index.html"];

    // Add all html files of ./features/ directory
    const featuresDir = path.join(baseDir, "features");
    if (fs.existsSync(featuresDir)) {
        const featureFiles = fs.readdirSync(featuresDir)
            .filter(file => file.endsWith(".html"))
            .map(file => path.join("features", file));
        filesToUpdate.push(...featureFiles);
    }

    // Update files
    filesToUpdate.forEach((filePath) => {
        const fullPath = path.join(baseDir, filePath);
        if (!fs.existsSync(fullPath)) {
            return;
        }

        let content = fs.readFileSync(fullPath, "utf8");
        if (content.includes(oldScript)) {
            content = content.replace(oldScript, newScript);
            fs.writeFileSync(fullPath, content, "utf8");
        }
    });
}
