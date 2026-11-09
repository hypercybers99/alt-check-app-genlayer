import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient, createAccount, chains } from "genlayer-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const RPC_URL = "https://studio.genlayer.com/api";
const CONTRACT_ADDRESS = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";
const GOOD_URL = "https://hypercybers99.github.io/alt-check-fixtures/good.html";
const LABEL = "Accessible Portfolio Demonstration (Working Host)";

async function main() {
  console.log("=== REGISTERING AND AUDITING good.html ON WORKING HOST ===");
  const account = createAccount();
  console.log(`Using fresh throwaway account: ${account.address}`);

  const client = createClient({
    chain: chains.studionet,
    endpoint: RPC_URL,
    account,
  });

  const balBefore = await client.getBalance({ address: account.address });
  console.log(`Account balance: ${balBefore.toString()} wei (0 GEN)`);

  // 1. Submit register_page
  console.log(`Submitting register_page("${LABEL}", "${GOOD_URL}")...`);
  let regHash = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      regHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "register_page",
        args: [LABEL, GOOD_URL],
        value: 0n,
      });
      break;
    } catch (e) {
      console.log(`Attempt ${attempt} failed (${e.message}). Retrying in 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!regHash) throw new Error("Failed to submit register_page");
  console.log(`register_page tx submitted: ${regHash}`);

  console.log("Waiting for register_page receipt...");
  const regReceipt = await client.waitForTransactionReceipt({
    hash: regHash,
    status: "FINALIZED",
    interval: 3000,
    retries: 45,
  });
  console.log("register_page reached consensus!");

  // 2. Discover page ID
  // SHA-256 of lowercase URL first 12 hex chars
  const crypto = await import("crypto");
  const expectedId = crypto.createHash("sha256").update(GOOD_URL.toLowerCase()).digest("hex").slice(0, 12);
  console.log(`Calculated Page ID: ${expectedId}`);

  // Confirm page exists on-chain
  const pageRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_page",
    args: [expectedId],
  });
  const page = typeof pageRaw === "string" ? JSON.parse(pageRaw) : pageRaw;
  console.log(`On-chain verified page:`, page);

  // 3. Submit audit_page
  console.log(`Submitting audit_page("${expectedId}")...`);
  let auditHash = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      auditHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "audit_page",
        args: [expectedId],
        value: 0n,
      });
      break;
    } catch (e) {
      console.log(`Audit attempt ${attempt} failed (${e.message}). Retrying in 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!auditHash) throw new Error("Failed to submit audit_page");
  console.log(`audit_page tx submitted: ${auditHash}`);

  console.log("Waiting for audit_page consensus (validators fetching HTML & analyzing)...");
  const auditReceipt = await client.waitForTransactionReceipt({
    hash: auditHash,
    status: "FINALIZED",
    interval: 3000,
    retries: 45,
  });
  console.log("audit_page reached consensus!");

  // 4. Readback audit record
  const auditsRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_audits",
    args: [expectedId, 0, 1],
  });
  const audits = typeof auditsRaw === "string" ? JSON.parse(auditsRaw) : auditsRaw;
  const latestAudit = audits[0];
  console.log(`Audit result: Score ${latestAudit.score}, Grade ${latestAudit.grade}, Partial: ${latestAudit.partial}`);

  const balAfter = await client.getBalance({ address: account.address });
  console.log(`Account balance after operations: ${balAfter.toString()} wei (0 GEN deducted)`);

  const evidence = {
    pageId: expectedId,
    label: LABEL,
    storedUrl: GOOD_URL,
    sender: account.address,
    registerTx: {
      hash: regHash,
      receipt: regReceipt,
    },
    auditTx: {
      hash: auditHash,
      receipt: auditReceipt,
      score: latestAudit.score,
      grade: latestAudit.grade,
      partial: latestAudit.partial,
    },
  };

  const outPath = path.join(rootDir, "docs", "live_good_fixture_evidence.json");
  fs.writeFileSync(outPath, JSON.stringify(evidence, null, 2), "utf8");
  console.log(`Saved live good fixture evidence to ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
