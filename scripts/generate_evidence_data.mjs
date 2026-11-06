import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const e2eRaw = JSON.parse(fs.readFileSync(path.join(rootDir, "docs/e2e_production_evidence.json"), "utf8"));

const positiveScenarios = [
  {
    name: "Scenario 1: Clean Accessible Page",
    fixture: "good.html",
    url: "https://hypercybers99.github.io/alt-check-fixtures/good.html",
    reg: "0x5a59ffa105fea05acc3a2484df4f31ce7cae318e23321221e8b0b4f98405a4ca",
    audit: "0x0005962924374a3c606671862b2757133733f6af62a7075cbaf655788f0f5302",
    agree: "Accepted by validators (3/5 agreed)",
    res: "Score 100 (Grade A)",
  },
  {
    name: "Scenario 2: Defective Page Across R1-R12",
    fixture: "bad.html",
    url: "https://hypercybers99.github.io/alt-check-fixtures/bad.html",
    reg: "0x98d91239c561e7f1c82a74807d1dbf018b3b149822f5a9335046d57e23388cec",
    audit: "0xa788f95121bbdc835ceaf2bf922d804ca9994ffae4dfa2b88f0c0470d35784f0",
    agree: "Accepted by validators (3/5 agreed)",
    res: "Score 25 (Grade F)",
  },
  {
    name: "Scenario 3: Model Ambiguity Evaluation",
    fixture: "mixed.html",
    url: "https://hypercybers99.github.io/alt-check-fixtures/mixed.html",
    reg: "0x670b96340e422e902190af315b580d12978512949870fdb944758158d59e0ecc",
    audit: "0xa5cc91061e0ee8f9cbf402fec2bc1943f6407d1d04d2e4ea96fdb88c2fef7b5c",
    agree: "Accepted by validators (3/5 agreed)",
    res: "Score 88 (Grade B)",
  },
  {
    name: "Scenario 4: SPA Shell Detection",
    fixture: "shell.html",
    url: "https://hypercybers99.github.io/alt-check-fixtures/shell.html",
    reg: "0x7195740e4672c08b5efb8f5c512956bdb1568150c503eb0e5c4ba64effd77c8d",
    audit: "0x0d7723d22cf4bef8625b7ffcd323bada48fe353fa8fc68c282f04462a6bc0da5",
    agree: "Accepted by validators (3/5 agreed)",
    res: "Score -1 (SHELL_ONLY)",
  },
  {
    name: "Scenario 4B: Large Doc Partial Audit (Grade B Capped)",
    fixture: "large.html",
    url: "https://hypercybers99.github.io/alt-check-fixtures/large.html",
    reg: "0xe50db6b5170f276a2756d65351688be685972def9f0a4b035214c75d21231525",
    audit: "0xf16c3954f12aa8d2ad1ab13ecbd4f68e3374c57d90e525035eadde7c888f9867",
    agree: "Accepted by validators (3/5 agreed)",
    res: "Score 90 (Grade B capped)",
  },
];

const revertScenarios = [
  { name: "Reject HTTP Scheme", fn: "register_page", hash: "0x4bb32503f136515fe824efd27b13dc0d7ef90dd57d26c1fc6146cc0de7ab16d2", rawStatus: "FINALIZED", votes: "3/5", err: "url must use https", derivedLabel: "Reverted - state not applied" },
  { name: "Reject Localhost Hostname", fn: "register_page", hash: "0x6149c03e97b727c0c23e8ab63c59f0777458f6cbfcf68ff34f1f843d0bf9787b", rawStatus: "FINALIZED", votes: "3/5", err: "url host not allowed", derivedLabel: "Reverted - state not applied" },
  { name: "Reject IPv4 Literal", fn: "register_page", hash: "0x64612dbea46a94744c57f32fbbd7c036fa15e14d64182a39c534438c08443ce5", rawStatus: "FINALIZED", votes: "3/5", err: "url host not allowed", derivedLabel: "Reverted - state not applied" },
  { name: "Reject Private IP Range", fn: "register_page", hash: "0x373123220fe8908aab6220ae0213caa473bd306e2d3bda4d4eb33d16e0509333", rawStatus: "FINALIZED", votes: "3/5", err: "url host not allowed", derivedLabel: "Reverted - state not applied" },
  { name: "Reject Userinfo Credentials", fn: "register_page", hash: "0xb897f5fda7fc819e23e8b66b6bed09a3bcdf24228c7b5dd3e6e2e67fe96eab57", rawStatus: "FINALIZED", votes: "4/5", err: "url contains credentials", derivedLabel: "Reverted - state not applied" },
  { name: "Reject Explicit Non-443 Port", fn: "register_page", hash: "0xe6525c85717b0b4ecad5bc6d78442d9a92812270809933e619eba6fcd70dcc95", rawStatus: "FINALIZED", votes: "4/5", err: "url port not allowed", derivedLabel: "Reverted - state not applied" },
  { name: "Reject Over-Length URL", fn: "register_page", hash: "0xe5a093789bb93e5a00068f17198bc3625eff13145a57150d9b9b7c4c496ebc8f", rawStatus: "FINALIZED", votes: "3/5", err: "url too long", derivedLabel: "Reverted - state not applied" },
  { name: "Reject Non-HTML MIME (data.json)", fn: "audit_page", hash: "0x67b321657fe21b10dd90a399ed27f3d233ae2790e2f03091a6f8ee6a75c3a410", rawStatus: "FINALIZED", votes: "3/5", err: "not an html page", derivedLabel: "Reverted - state not applied" },
  { name: "Reject Non-HTML MIME (notes.txt)", fn: "audit_page", hash: "0xbfdc5fa402668e0d8bedc5943f35890847f6401243744b66e7322175dcfb09c2", rawStatus: "FINALIZED", votes: "3/5", err: "not an html page", derivedLabel: "Reverted - state not applied" },
  { name: "Audit Nonexistent Page ID", fn: "audit_page", hash: "0xca26c9dc85e211c75530673b6696b7c59893ac59ca54c26cab1852fb0c901d6d", rawStatus: "FINALIZED", votes: "5/5", err: "page not found", derivedLabel: "Reverted - state not applied" },
  { name: "Duplicate Page Registration", fn: "register_page", hash: "0x19f4ac315b2e103642fc4e450fd73fe12d20bf3099557eb4c106f95934b70e58", rawStatus: "FINALIZED", votes: "3/5", err: "page already registered", derivedLabel: "Reverted - state not applied" },
  { name: "Audit Cooldown Active", fn: "audit_page", hash: "0x932aa3cd6ef05cf33e26394067e0c37bcb33506becfaa39d63499c01c0343936", rawStatus: "FINALIZED", votes: "3/5", err: "audit cooldown active", derivedLabel: "Reverted - state not applied" },
  { name: "Non-Registrant Maintainer Note", fn: "add_maintainer_note", hash: "0x7c084e32bc56897fdba64d5eb9b5108c94d9a2c61a73d2a185f7a7b2fae17b3d", rawStatus: "FINALIZED", votes: "3/5", err: "only the registrant can do this", derivedLabel: "Reverted - state not applied" },
  { name: "Maintainer Note Too Short (< 5 chars)", fn: "add_maintainer_note", hash: "0x51d35dc589466cd08c4fa7b16c7fa3738a1f6546ef74cffe4438cb5b7bca0779", rawStatus: "FINALIZED", votes: "3/5", err: "note length out of range", derivedLabel: "Reverted - state not applied" },
  { name: "Non-Registrant Retire Page", fn: "retire_page", hash: "0x10343d90a0312e4047e05126f13353a92767b0a1db0235ca22107cbb698da0b4", rawStatus: "FINALIZED", votes: "3/5", err: "only the registrant can do this", derivedLabel: "Reverted - state not applied" },
];

const evidenceData = {
  positiveScenarios,
  revertScenarios,
  e2eLifecycle: e2eRaw,
};

// Validate that every hash is valid 66-character lowercase hex
function validateHash(h, ctx) {
  if (typeof h !== "string" || !/^0x[a-fA-F0-9]{64}$/.test(h)) {
    throw new Error(`Invalid 66-character transaction hash in ${ctx}: ${h}`);
  }
}

positiveScenarios.forEach((s, i) => {
  validateHash(s.reg, `positiveScenarios[${i}].reg`);
  validateHash(s.audit, `positiveScenarios[${i}].audit`);
});

revertScenarios.forEach((r, i) => {
  validateHash(r.hash, `revertScenarios[${i}].hash`);
});

e2eRaw.forEach((e, i) => {
  validateHash(e.txHash, `e2eLifecycle[${i}].txHash`);
});

const outDir = path.join(rootDir, "src/data");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, "evidenceData.json"),
  JSON.stringify(evidenceData, null, 2),
  "utf8"
);

console.log(`Generated src/data/evidenceData.json successfully:
  - Positive Scenarios: ${positiveScenarios.length}
  - Revert Scenarios: ${revertScenarios.length}
  - E2E Lifecycle Transactions: ${e2eRaw.length}
`);
