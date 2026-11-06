import fs from "fs";
import { createClient, createAccount, chains } from "genlayer-js";

const RPC_URL = "https://studio.genlayer.com/api";
const CONTRACT_ADDRESS = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";
const PAGE_ID = "55d0e52560ab"; // fresh.html fixture

async function main() {
  console.log("=== RUNNING LIVE AUDIT WITH FRESH 0 GEN ACCOUNT ===");
  // Create completely fresh random throwaway account
  const account = createAccount();
  console.log(`Generated throwaway account: ${account.address}`);

  const client = createClient({
    chain: chains.studionet,
    endpoint: RPC_URL,
    account,
  });

  // Verify initial balance
  const balBefore = await client.getBalance({ address: account.address });
  console.log(`Initial balance: ${balBefore.toString()} wei (0 GEN)`);

  // Verify page state before
  const pageBeforeRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_page",
    args: [PAGE_ID],
  });
  const pageBefore = typeof pageBeforeRaw === "string" ? JSON.parse(pageBeforeRaw) : pageBeforeRaw;
  console.log(`Page before: audits_total = ${pageBefore.audits_total}, latest_score = ${pageBefore.latest_score}`);

  // Send audit transaction
  console.log(`Sending audit_page("${PAGE_ID}")...`);
  const startTime = Date.now();
  let txHash = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      txHash = await client.writeContract({
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
  if (!txHash) throw new Error("Failed to submit audit transaction after 3 attempts");
  console.log(`Transaction submitted: ${txHash}`);

  // Wait for receipt
  console.log("Waiting for multi-validator consensus receipt...");
  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: "FINALIZED",
    interval: 3000,
    retries: 40,
  });
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Consensus reached in ${elapsed}s!`);

  // Fetch full tx details for votes
  const txDetailsRes = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getTransactionByHash",
      params: [txHash],
    }),
  }).then((r) => r.json());

  const txDetails = txDetailsRes.result;
  const votes = txDetails?.last_round?.validator_votes_name || [];
  const agrees = votes.filter((v) => v === "AGREE").length;
  const voteStr = `${agrees}/${votes.length}`;

  // Check balance after
  const balAfter = await client.getBalance({ address: account.address });
  console.log(`Balance after: ${balAfter.toString()} wei (0 GEN deducted)`);

  // Readback from contract
  const pageAfterRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_page",
    args: [PAGE_ID],
  });
  const pageAfter = typeof pageAfterRaw === "string" ? JSON.parse(pageAfterRaw) : pageAfterRaw;

  // Read latest audit details
  const auditsRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_audits",
    args: [PAGE_ID, 0, 1],
  });
  const audits = typeof auditsRaw === "string" ? JSON.parse(auditsRaw) : auditsRaw;
  const latestAudit = audits[0] || {};

  const summary = {
    scenario: "Live Fixture Audit with 0 GEN Throwaway Account",
    pageId: PAGE_ID,
    url: pageBefore.url,
    sender: account.address,
    initialBalance: `${balBefore.toString()} wei`,
    finalBalance: `${balAfter.toString()} wei`,
    txHash,
    elapsedSeconds: elapsed,
    rawReceiptStatus: receipt.status,
    votes: voteStr,
    voteDetails: votes,
    score: latestAudit.score,
    grade: latestAudit.grade,
    partial: latestAudit.partial,
    mode: latestAudit.mode,
    auditsTotalBefore: pageBefore.audits_total,
    auditsTotalAfter: pageAfter.audits_total,
    readbackVerified: pageAfter.audits_total === pageBefore.audits_total + 1,
  };

  console.log("\n=== AUDIT EXECUTION RESULT ===");
  console.log(JSON.stringify(summary, null, 2));

  // Save to file for evidence inclusion
  fs.writeFileSync(
    "docs/live_fixture_audit.json",
    JSON.stringify(summary, null, 2),
    "utf8"
  );
  console.log("Saved summary to docs/live_fixture_audit.json");
}

main().catch(console.error);
