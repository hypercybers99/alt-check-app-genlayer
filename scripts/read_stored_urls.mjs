import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient, chains } from "genlayer-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const RPC_URL = "https://studio.genlayer.com/api";
const CONTRACT_ADDRESS = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";

const client = createClient({
  chain: chains.studionet,
  endpoint: RPC_URL,
});

async function checkHttpStatus(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(6000),
    });
    return res.status;
  } catch (err) {
    return 0; // Network error or unreachable
  }
}

async function main() {
  console.log(`Connecting to GenLayer Studionet (Preview) RPC: ${RPC_URL}`);
  console.log(`Reading registered pages from AltCheck contract: ${CONTRACT_ADDRESS}`);

  const rawIds = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "list_page_ids",
    args: [0, 50],
  });

  const ids = typeof rawIds === "string" ? JSON.parse(rawIds) : rawIds;
  console.log(`Retrieved ${ids.length} page IDs from contract storage.\n`);

  const results = [];

  for (let i = 0; i < ids.length; i++) {
    const pageId = ids[i];
    const rawPage = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_page",
      args: [pageId],
    });

    const page = typeof rawPage === "string" ? JSON.parse(rawPage) : rawPage;
    const auditsTotal = Number(page.audits_total || 0);

    let lastScore = null;
    let lastGrade = null;
    let partial = null;

    if (auditsTotal > 0) {
      try {
        const rawAudits = await client.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_audits",
          args: [pageId, 0, 1],
        });
        const audits = typeof rawAudits === "string" ? JSON.parse(rawAudits) : rawAudits;
        if (audits && audits.length > 0) {
          lastScore = audits[0].score;
          lastGrade = audits[0].grade;
          partial = Boolean(audits[0].partial);
        }
      } catch (err) {
        console.warn(`Warning: failed to read latest audit for page ${pageId}: ${err.message}`);
      }
    }

    const httpStatus = await checkHttpStatus(page.url);

    const record = {
      id: page.id,
      label: page.label,
      stored_url: page.url,
      retired: Boolean(page.retired),
      audits_total: auditsTotal,
      last_score: lastScore,
      last_grade: lastGrade,
      partial: partial,
      http_status: httpStatus,
      registrant: page.registrant,
      registered_at: page.registered_at,
    };

    results.push(record);
  }

  const outPath = path.join(rootDir, "docs", "stored_pages.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`Successfully written ${results.length} stored page records to ${outPath}\n`);

  const srcDataPath = path.join(rootDir, "src", "data", "stored_pages.json");
  fs.writeFileSync(srcDataPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`Successfully written ${results.length} stored page records to ${srcDataPath}\n`);

  console.log("=== RAW STORED PAGES DUMP ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
