import { createClient, chains } from "genlayer-js";

const client = createClient({
  chain: chains.studionet,
  endpoint: "https://studio.genlayer.com/api"
});
const contract = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";

async function main() {
  const idsRaw = await client.readContract({
    address: contract,
    functionName: "list_page_ids",
    args: [0, 50]
  });
  const ids = typeof idsRaw === "string" ? JSON.parse(idsRaw) : idsRaw;
  console.log(`Found ${ids.length} registered page IDs:`, ids);

  const pages = [];
  for (const id of ids) {
    const raw = await client.readContract({
      address: contract,
      functionName: "get_page",
      args: [id]
    });
    const p = typeof raw === "string" ? JSON.parse(raw) : raw;
    pages.push(p);
  }

  console.log("\n=== ALL REGISTERED PAGES ON-CHAIN ===");
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    let status = "unknown";
    try {
      const res = await fetch(p.url, { method: "HEAD" });
      status = `${res.status}`;
    } catch (e) {
      status = `ERR: ${e.message}`;
    }
    console.log(`[${i + 1}] ID: ${p.id}`);
    console.log(`    Label:    ${p.label}`);
    console.log(`    URL:      ${p.url}`);
    console.log(`    Status:   HTTP ${status}`);
    console.log(`    Audits:   ${p.audits_total}, Retired: ${p.retired}`);
  }
}

main().catch(console.error);
