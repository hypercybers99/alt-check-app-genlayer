import fs from "fs";

const text = fs.readFileSync("contracts-reference/AltCheck.py", "ascii");

// Match UserError
const errorRegex = /UserError\(\s*["']([^"']+)["']\s*\)/g;
const errors = new Set();
let match;
while ((match = errorRegex.exec(text)) !== null) {
  errors.add(match[1]);
}
console.log("Found UserErrors (" + errors.size + "):");
for (const err of Array.from(errors).sort()) {
  console.log("  - " + err);
}

// Match public methods
const methodRegex = /@gl\.public\.(view|write)\s*\n\s*def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
console.log("\nFound Methods:");
while ((match = methodRegex.exec(text)) !== null) {
  console.log(`  - [${match[1]}] ${match[2]}(${match[3].replace(/\s+/g, " ").trim()})`);
}
