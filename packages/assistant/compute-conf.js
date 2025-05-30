const replaceJSONProperty = require("replace-json-property");
const fs = require("fs");

const buildAssetManifest = require("./build/.vite/manifest.json")["index.html"];

const destConfFile = "./dist/launcher/conf.json";
const srcConfFile = "./launcher/conf.json";
fs.copyFileSync(srcConfFile, destConfFile);

// Delete empty lines at the end of the CSS file
const path = `./build/${buildAssetManifest.css[0]}`;
let css = fs.readFileSync(path, 'utf8');
css = css.replace(/\n+$/, '');
fs.writeFileSync(path, css);

replaceJSONProperty.replace(destConfFile, "reactScript", `/build/${buildAssetManifest.file}`);
replaceJSONProperty.replace(destConfFile, "cssFile", `/build/${buildAssetManifest.css[0]}`);
replaceJSONProperty.replace(destConfFile, "unifiedFile", "/../uuv-assistant-resources.bundle.js");
replaceJSONProperty.replace(destConfFile, "packageJson", "/../../package.json");

replaceJSONProperty.replace(srcConfFile, "reactScript", `/build/${buildAssetManifest.file}`);
replaceJSONProperty.replace(srcConfFile, "cssFile", `/build/${buildAssetManifest.css[0]}`);
