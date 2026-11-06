import { createClient, chains, createAccount } from "genlayer-js";
import fs from "fs";
import path from "path";

const RPC_URL = "https://studio.genlayer.com/api";
const CONTRACT_ADDRESS = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";

const key1 = "0x22b137746f50490068eef48dab8524ce81434970377fecf7de80b3f1f31ce82a";
const key2 = "0xbc2b57ac31c3b48b7845aa3d8728956a615e7bcc49a89b0020386888556d395c";
const account1 = createAccount(key1);
const account2 = createAccount(key2);

const client1 = createClient({ chain: chains.studionet, endpoint: RPC_URL, account: account1 });
const client2 = createClient({ chain: chains.studionet, endpoint: RPC_URL, account: account2 });
const publicClient = createClient({ chain: chains.studionet, endpoint: RPC_URL });

const freshId = "55d0e52560ab";
const publicId = "2cac3e7d6d80";
const retireId = "81186ead3daf";

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
  const existingRecords = JSON.parse(fs.readFileSync("docs/e2e_production_evidence.json", "utf8"));
  console.log(`Existing records: ${existingRecords.length}`);

  // 1. Audit fresh.html
  const aud1 = await executeTx(client1, "audit_page", [freshId], "Audit fresh.html (Audit #1)");
  existingRecords.push(aud1);

  // 2. Audit cooldown negative test (immediate re-audit)
  const coolTx = await executeTx(client1, "audit_page", [freshId], "Negative: Audit Cooldown Active (Immediate re-audit)");
  existingRecords.push(coolTx);

  // 3. Non-registrant note negative test
  const nonRegNote = await executeTx(client2, "add_maintainer_note", [freshId, 1, "Unauthorized note from non-registrant"], "Negative: Non-Registrant Maintainer Note Rejection");
  existingRecords.push(nonRegNote);

  // 4. Legitimate maintainer note from registrant
  const regNote = await executeTx(client1, "add_maintainer_note", [freshId, 1, "E2E verified maintainer note on fresh audit"], "Add Maintainer Note (Registrant)");
  existingRecords.push(regNote);

  // 5. Audit real public page (httpbin.org/html)
  const pubAud = await executeTx(client1, "audit_page", [publicId], "Audit Real Public Page (httpbin.org/html)");
  existingRecords.push(pubAud);

  // 6. Non-registrant retire negative test
  const nonRegRetire = await executeTx(client2, "retire_page", [retireId], "Negative: Non-Registrant Retire Page Rejection");
  existingRecords.push(nonRegRetire);

  // 7. Legitimate retire from registrant
  const regRetire = await executeTx(client1, "retire_page", [retireId], "Retire Page (Registrant)");
  existingRecords.push(regRetire);

  const outPath = path.resolve("docs/e2e_production_evidence.json");
  fs.writeFileSync(outPath, JSON.stringify(existingRecords, null, 2), "utf8");
  console.log(`\nUpdated evidence saved: ${existingRecords.length} records in ${outPath}`);
}

main().catch(console.error);
