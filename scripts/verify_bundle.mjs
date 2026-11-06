import fs from "fs";
import path from "path";
import { ACTIVE_ALTCHECK } from "./check_address_consistency.mjs";

const rootDir = process.cwd();
const distAssetsDir = path.join(rootDir, "dist", "assets");

if (!fs.existsSync(distAssetsDir)) {
  console.error("FAILED: dist/assets directory not found. Please run npm run build first.");
  process.exit(1);
}

const jsFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith(".js"));

let hasActiveAltCheck = false;

for (const file of jsFiles) {
  const content = fs.readFileSync(path.join(distAssetsDir, file), "utf8").toLowerCase();
  if (content.includes(ACTIVE_ALTCHECK)) {
    hasActiveAltCheck = true;
  }
}

console.log(`Audited ${jsFiles.length} production bundle assets.`);
console.log(`Active AltCheck present in bundle: ${hasActiveAltCheck ? "YES" : "NO"}`);

if (!hasActiveAltCheck) {
  console.error("FAILED: Active AltCheck address not found in production bundle.");
  process.exit(1);
}

console.log("PASS: Bundle verified successfully.");
process.exit(0);
