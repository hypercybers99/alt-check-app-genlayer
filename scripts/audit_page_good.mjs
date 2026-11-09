import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient, createAccount, chains } from "genlayer-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const RPC_URL = "https://studio.genlayer.com/api";
const CONTRACT_ADDRESS = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";
const PAGE_ID = "173a4e08d12d";

async function main() {
  console.log(`=== AUDITING PAGE ${PAGE_ID} ON WORKING HOST ===`);
  const account = createAccount();
  console.log(`Using fresh throwaway account: ${account.address}`);

  const client = createClient({
    chain: chains.studionet,
    endpoint: RPC_URL,
    account,
  });

  const balBefore = await client.getBalance({ address: account.address });
  console.log(`Account balance: ${balBefore.toString()} wei (0 GEN)`);

  console.log(`Submitting audit_page("${PAGE_ID}")...`);
  let auditHash = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      auditHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "audit_page",
        args: [PAGE_ID],
        value: 0n,
      });
      break;
    } catch (e) {
      console.log(`Attempt ${attempt} failed (${e.message}). Retrying in 2s...`);
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

  // Readback audit record
  const auditsRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_audits",
    args: [PAGE_ID, 0, 1],
  });
  const audits = typeof auditsRaw === "string" ? JSON.parse(auditsRaw) : auditsRaw;
  const latestAudit = audits[0];
  console.log(`Audit result: Score ${latestAudit.score}, Grade ${latestAudit.grade}, Partial: ${latestAudit.partial}`);

  const balAfter = await client.getBalance({ address: account.address });
  console.log(`Account balance after operations: ${balAfter.toString()} wei (0 GEN deducted)`);

  const evidence = {
    pageId: PAGE_ID,
    label: "Accessible Portfolio Demonstration (Working Host)",
    storedUrl: "https://hypercybers99.github.io/alt-check-fixtures/good.html",
    regTxHash: "0x070a4ab259efb36eb3f4e37e57496cd2f520b04cca673db81758f0897a771651",
    auditTxHash: auditHash,
    score: latestAudit.score,
    grade: latestAudit.grade,
    partial: latestAudit.partial,
    consensusReceipt: auditReceipt,
  };

  const outPath = path.join(rootDir, "docs", "live_good_fixture_audit.json");
  fs.writeFileSync(outPath, JSON.stringify(evidence, null, 2), "utf8");
  console.log(`Saved live good fixture evidence to ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
