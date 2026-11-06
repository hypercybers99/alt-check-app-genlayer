import fs from "fs";
import path from "path";
import crypto from "crypto";

const EXPECTED_CONTRACTS = [
  {
    name: "AltCheck.py",
    expectedSha256: "9af349d914c6c0e44199a00b0bc4c219a27fc6a9836b3b3a70574c23e4cdc262",
  },
];

let hasError = false;

for (const contract of EXPECTED_CONTRACTS) {
  const filePath = path.join(process.cwd(), "contracts-reference", contract.name);

  if (!fs.existsSync(filePath)) {
    console.error(`FAILED: Reference contract not found at ${filePath}`);
    hasError = true;
    continue;
  }

  const content = fs.readFileSync(filePath);
  const actualSha256 = crypto.createHash("sha256").update(content).digest("hex");

  if (actualSha256 !== contract.expectedSha256) {
    console.error(`FAILED: Reference contract ${contract.name} SHA-256 mismatch!`);
    console.error(`  Expected: ${contract.expectedSha256}`);
    console.error(`  Actual:   ${actualSha256}`);
    hasError = true;
  } else {
    console.log(`PASS: Reference contract ${contract.name} matches canonical SHA-256 (${actualSha256}).`);
  }
}

if (hasError) {
  process.exit(1);
}

process.exit(0);
