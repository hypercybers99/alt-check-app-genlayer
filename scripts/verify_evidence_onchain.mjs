import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const RPC_URL = "https://studio.genlayer.com/api";
const ACTIVE_CONTRACT = "0x1292c9bf74c2ef2789184ec9808379d46279dd30".toLowerCase();
const SUPERSEDED_CONTRACTS = [
  "0xba2d886e76b87fed8dcd5be61fccfa2a4e1d388a".toLowerCase(),
  "0xc40bf93ba9c3f1cf9a1088087c4c7156e538fb95".toLowerCase(),
];

function extractHashesFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8");
  const regex = /0x[a-fA-F0-9]{64}/g;
  const matches = content.match(regex) || [];
  return matches.map((h) => ({ hash: h.toLowerCase(), file: path.relative(rootDir, filePath) }));
}

async function rpcCall(method, params) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const data = await res.json();
  return data.result;
}

function parseMethodFromCalldata(b64) {
  if (!b64) return "unknown";
  try {
    const str = Buffer.from(b64, "base64").toString("utf8");
    if (str.includes("add_maintainer_note")) return "add_maintainer_note";
    if (str.includes("register_page")) return "register_page";
    if (str.includes("retire_page")) return "retire_page";
    if (str.includes("audit_page")) return "audit_page";
    const m = str.match(/method[^\w]*([a-zA-Z0-9_]+)/i);
    if (m) return m[1].replace(/^[a-zA-Z]/, "");
    return "deploy / contract call";
  } catch {
    return "unknown";
  }
}

function parseRevertMessage(resultB64) {
  if (!resultB64) return null;
  try {
    const buf = Buffer.from(resultB64, "base64");
    // Strip leading non-printable byte if present
    const clean = buf.toString("utf8").replace(/^[\x00-\x1f]+/, "").trim();
    return clean || null;
  } catch {
    return null;
  }
}

async function verifyHash(hash, sourceFiles) {
  const [tx, receipt] = await Promise.all([
    rpcCall("eth_getTransactionByHash", [hash]),
    rpcCall("eth_getTransactionReceipt", [hash]),
  ]);

  if (!tx) {
    return {
      hash,
      sourceFiles: sourceFiles.join(", "),
      foundOnChain: false,
      error: "Transaction not found on chain",
    };
  }

  const toAddr = (tx.to_address || tx.to || "").toLowerCase();
  let toContractStatus = "UNKNOWN";
  if (toAddr === ACTIVE_CONTRACT) {
    toContractStatus = "ACTIVE";
  } else if (SUPERSEDED_CONTRACTS.includes(toAddr)) {
    toContractStatus = `SUPERSEDED (${toAddr.slice(0, 10)}...)`;
  } else {
    toContractStatus = `OTHER (${toAddr ? toAddr.slice(0, 10) + "..." : "null"})`;
  }

  const method = parseMethodFromCalldata(tx.data?.calldata);
  const sender = tx.from_address || tx.from || "unknown";

  const rawStatusName = tx.status || "UNKNOWN";
  const numericStatus = receipt?.status || "unknown";

  // Votes from last_round
  let agreeCount = 0;
  let totalVotes = 5;
  if (tx.last_round?.validator_votes_name) {
    totalVotes = tx.last_round.validator_votes_name.length;
    agreeCount = tx.last_round.validator_votes_name.filter((v) => v === "AGREE").length;
  } else if (tx.consensus_data?.votes) {
    const votes = Object.values(tx.consensus_data.votes);
    totalVotes = votes.length;
    agreeCount = votes.filter((v) => v === "agree").length;
  }
  const voteCounts = `${agreeCount}/${totalVotes}`;

  // Execution result from leader or validator
  const execResultLeader = tx.consensus_data?.leader_receipt?.[0]?.execution_result;
  const execResultVal = tx.consensus_data?.validators?.[0]?.execution_result;
  const executionResult = execResultLeader || execResultVal || (receipt?.status === "0x1" ? "SUCCESS" : "ERROR");

  // Revert message
  let revertMessage = null;
  if (executionResult === "ERROR") {
    const rawRes = tx.consensus_data?.leader_receipt?.[0]?.result || tx.consensus_data?.validators?.[0]?.result;
    revertMessage = parseRevertMessage(rawRes);
  }

  // Derive honest terminal label
  let derivedLabel = "";
  if (executionResult === "ERROR") {
    derivedLabel = `Reverted - state not applied (${voteCounts} agreed on revert)`;
  } else if (agreeCount >= Math.ceil(totalVotes / 2)) {
    derivedLabel = `Accepted by validators (${voteCounts} agreed) - state applied`;
  } else {
    derivedLabel = `Validators did not agree (${voteCounts}) - state not applied`;
  }

  return {
    hash,
    sourceFiles: sourceFiles.join(", "),
    foundOnChain: true,
    method,
    sender,
    toAddress: toAddr,
    toContractStatus,
    rawStatusName,
    numericStatus,
    executionResult,
    voteCounts,
    revertMessage,
    derivedLabel,
  };
}

async function main() {
  console.log("Collecting all transaction hashes across dApp codebase and docs...");

  const filesToScan = [
    path.join(rootDir, "docs/e2e_production_evidence.json"),
    path.join(rootDir, "docs/live_fixture_audit.json"),
    path.join(rootDir, "docs/live_good_fixture_audit.json"),
    path.join(rootDir, "src/data/evidenceData.json"),
    path.join(rootDir, "src/pages/Evidence.tsx"),
    path.join(rootDir, "README.md"),
    path.join(rootDir, "docs/ARTIFACTS.md"),
  ];

  // Also include any other markdown files in docs/
  const docsDir = path.join(rootDir, "docs");
  if (fs.existsSync(docsDir)) {
    for (const f of fs.readdirSync(docsDir)) {
      if (f.endsWith(".md") && !filesToScan.includes(path.join(docsDir, f))) {
        filesToScan.push(path.join(docsDir, f));
      }
    }
  }

  const hashMap = new Map();
  for (const file of filesToScan) {
    const items = extractHashesFromFile(file);
    for (const { hash, file: src } of items) {
      if (!hashMap.has(hash)) {
        hashMap.set(hash, new Set());
      }
      hashMap.get(hash).add(src);
    }
  }

  console.log(`Found ${hashMap.size} unique transaction hashes. Verifying on-chain against ${RPC_URL}...`);

  const results = [];
  for (const [hash, srcSet] of hashMap.entries()) {
    process.stdout.write(`Verifying ${hash.slice(0, 10)}... `);
    const rec = await verifyHash(hash, Array.from(srcSet));
    results.push(rec);
    console.log(rec.foundOnChain ? `OK [${rec.method} - ${rec.derivedLabel.slice(0, 30)}...]` : "NOT FOUND");
  }

  // Save JSON report
  const outputPath = path.join(rootDir, "docs/evidence_verification.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`\nWrote complete verification record to ${outputPath}`);

  // Format Markdown Table
  console.log("\n### On-Chain Evidence Verification Table\n");
  console.log("| # | Hash | Method | Sender | Target Contract | Raw Status | Numeric | Execution | Votes | Derived Outcome Label |");
  console.log("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |");
  results.forEach((r, idx) => {
    if (!r.foundOnChain) {
      console.log(`| ${idx + 1} | \`${r.hash}\` | - | - | - | NOT FOUND | - | - | - | Transaction not found on chain |`);
    } else {
      console.log(
        `| ${idx + 1} | [\`${r.hash.slice(0, 10)}...${r.hash.slice(-8)}\`](https://explorer-studio.genlayer.com/tx/${r.hash}) | \`${r.method}\` | \`${r.sender.slice(0, 6)}...${r.sender.slice(-4)}\` | ${r.toContractStatus} | ${r.rawStatusName} | ${r.numericStatus} | \`${r.executionResult}\` | ${r.voteCounts} | ${r.derivedLabel} |`
      );
    }
  });
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
