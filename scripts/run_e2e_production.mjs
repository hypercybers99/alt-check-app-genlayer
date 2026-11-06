import { createClient, chains, createAccount, generatePrivateKey } from "genlayer-js";
import fs from "fs";
import path from "path";

const RPC_URL = "https://studio.genlayer.com/api";
const CONTRACT_ADDRESS = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";

// Two fresh unfunded accounts
const key1 = generatePrivateKey();
const key2 = generatePrivateKey();
const account1 = createAccount(key1);
const account2 = createAccount(key2);

console.log("Key 1 (Registrant):", account1.address, key1);
console.log("Key 2 (Other):     ", account2.address, key2);

const client1 = createClient({
  chain: chains.studionet,
  endpoint: RPC_URL,
  account: account1,
});

const client2 = createClient({
  chain: chains.studionet,
  endpoint: RPC_URL,
  account: account2,
});

const publicClient = createClient({
  chain: chains.studionet,
  endpoint: RPC_URL,
});

async function getBalance(addr) {
  try {
    const res = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [addr, "latest"],
      }),
    });
    const j = await res.json();
    return j.result || "0x0";
  } catch {
    return "0x0";
  }
}

async function executeTx(client, fnName, args, desc) {
  console.log(`\n--- Starting: ${desc} ---`);
  const sender = client.account?.address || "unknown";
  const balBefore = await getBalance(sender);
  const startTime = Date.now();

  try {
    const txHash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: fnName,
      args,
      value: 0n,
    });
    console.log(`Submitted tx: ${txHash}`);

    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      interval: 2000,
      retries: 45,
    });
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const balAfter = await getBalance(sender);

    const consensusData = receipt?.consensus_data || {};
    const votes = consensusData.votes || {};
    const voteVals = Object.values(votes);
    const agreeCount = voteVals.filter((v) => v === "agree").length;
    const totalVotes = voteVals.length || 5;

    const leaderReceipt = consensusData.leader_receipt?.[0] || {};
    const executionResultName = leaderReceipt.execution_result || "SUCCESS";
    const rawStatusName = receipt.status_name || receipt.statusName || "FINALIZED";
    const rawStatus = receipt.status;

    let revertPayload = null;
    if (leaderReceipt.genvm_result?.error_description) {
      revertPayload = leaderReceipt.genvm_result.error_description;
    }

    const record = {
      desc,
      txHash,
      fnName,
      sender,
      args,
      elapsed,
      balBefore,
      balAfter,
      rawStatusName,
      rawStatus,
      executionResultName,
      votes: `${agreeCount}/${totalVotes}`,
      revertPayload,
      success: executionResultName === "SUCCESS" && agreeCount * 2 > totalVotes,
    };

    console.log(`Finished: ${desc} in ${elapsed}s -> Status: ${rawStatusName}, Result: ${executionResultName}, Agree: ${agreeCount}/${totalVotes}, Revert: ${revertPayload || "none"}`);
    return record;
  } catch (err) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.error(`Error in ${desc}:`, err.message || err);
    return {
      desc,
      txHash: null,
      fnName,
      sender,
      args,
      elapsed,
      error: String(err.message || err),
      success: false,
    };
  }
}

async function main() {
  const records = [];

  // Target URLs
  const freshUrl = "https://hypercybers99.github.io/alt-check-fixtures/fresh.html";
  const publicUrl = "https://httpbin.org/html";
  const retireTargetUrl = "https://hypercybers99.github.io/alt-check-fixtures/fresh.html?retire=1";

  // 1. Register fresh fixture page
  const reg1 = await executeTx(client1, "register_page", ["E2E Fresh Fixture Page", freshUrl], "Register fresh.html fixture");
  records.push(reg1);

  // 2. Register real public HTML page
  const reg2 = await executeTx(client1, "register_page", ["E2E Public Httpbin Target", publicUrl], "Register public httpbin.org/html");
  records.push(reg2);

  // 3. Register target page for retirement
  const reg3 = await executeTx(client1, "register_page", ["E2E Retire Target Page", retireTargetUrl], "Register target page for retirement");
  records.push(reg3);

  // Derive page IDs by reading list_page_ids
  console.log("\nReading registered page list...");
  const pageIdsRaw = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "list_page_ids",
    args: [0, 50],
  });
  const parsedIds = typeof pageIdsRaw === "string" ? JSON.parse(pageIdsRaw) : pageIdsRaw;
  const allIds = parsedIds.page_ids || [];
  console.log(`Total pages on chain: ${allIds.length}`);

  // Fetch page details to identify IDs for fresh, public, and retire target
  let freshId = null;
  let publicId = null;
  let retireId = null;

  for (const pid of allIds.slice(-5)) {
    const pRaw = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_page",
      args: [pid],
    });
    const p = typeof pRaw === "string" ? JSON.parse(pRaw) : pRaw;
    if (p.url === freshUrl && p.registrant.toLowerCase() === account1.address.toLowerCase()) freshId = pid;
    if (p.url === publicUrl && p.registrant.toLowerCase() === account1.address.toLowerCase()) publicId = pid;
    if (p.url === retireTargetUrl && p.registrant.toLowerCase() === account1.address.toLowerCase()) retireId = pid;
  }

  console.log(`Identified IDs -> freshId: ${freshId}, publicId: ${publicId}, retireId: ${retireId}`);

  if (freshId) {
    // 4. Audit fresh.html
    const aud1 = await executeTx(client1, "audit_page", [freshId], "Audit fresh.html (Audit #1)");
    records.push(aud1);

    // 5. Audit cooldown negative test (immediate re-audit)
    const coolTx = await executeTx(client1, "audit_page", [freshId], "Negative: Audit Cooldown Active (Immediate re-audit)");
    records.push(coolTx);

    // 6. Non-registrant note negative test
    const nonRegNote = await executeTx(client2, "add_maintainer_note", [freshId, 1, "Unauthorized note from non-registrant"], "Negative: Non-Registrant Maintainer Note Rejection");
    records.push(nonRegNote);

    // 7. Legitimate maintainer note from registrant
    const regNote = await executeTx(client1, "add_maintainer_note", [freshId, 1, "E2E verified maintainer note on fresh audit"], "Add Maintainer Note (Registrant)");
    records.push(regNote);
  }

  if (publicId) {
    // 8. Audit real public page (httpbin.org/html)
    const pubAud = await executeTx(client1, "audit_page", [publicId], "Audit Real Public Page (httpbin.org/html)");
    records.push(pubAud);
  }

  if (retireId) {
    // 9. Non-registrant retire negative test
    const nonRegRetire = await executeTx(client2, "retire_page", [retireId], "Negative: Non-Registrant Retire Page Rejection");
    records.push(nonRegRetire);

    // 10. Legitimate retire from registrant
    const regRetire = await executeTx(client1, "retire_page", [retireId], "Retire Page (Registrant)");
    records.push(regRetire);
  }

  // 11. Duplicate registration negative test
  const dupTx = await executeTx(client1, "register_page", ["Duplicate Attempt", freshUrl], "Negative: Duplicate Registration Rejection");
  records.push(dupTx);

  // 12. Non-HTTPS negative test
  const httpTx = await executeTx(client1, "register_page", ["HTTP Scheme Test", "http://example.com/insecure"], "Negative: Reject Non-HTTPS URL");
  records.push(httpTx);

  // 13. Userinfo credentials negative test
  const userinfoTx = await executeTx(client1, "register_page", ["Userinfo Test", "https://user:pass@example.com/login"], "Negative: Reject Userinfo Credentials");
  records.push(userinfoTx);

  // Save evidence
  const outPath = path.resolve("docs/e2e_production_evidence.json");
  fs.writeFileSync(outPath, JSON.stringify(records, null, 2), "utf8");
  console.log(`\nSaved ${records.length} production transaction records to ${outPath}`);
}

main().catch(console.error);
