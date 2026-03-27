import fs from "node:fs";
import path from "node:path";
import packageJson from "../package.json" with { type: "json" };

const releaseDir = path.resolve(process.cwd(), "release");
const version = packageJson.version;
const installerName = `AI-Interview-Coach-Setup-${version}.exe`;
const portableName = `AI-Interview-Coach-Portable-${version}.exe`;
const installerPath = path.join(releaseDir, installerName);
const portablePath = path.join(releaseDir, portableName);

if (!fs.existsSync(installerPath)) {
  console.log(`No portable output found at ${installerPath}`);
  process.exit(0);
}

if (fs.existsSync(portablePath)) {
  fs.unlinkSync(portablePath);
}

fs.renameSync(installerPath, portablePath);
console.log(`Portable build renamed to ${portablePath}`);
