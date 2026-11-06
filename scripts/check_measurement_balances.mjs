const RPC_URL = "https://studio.genlayer.com/api";
const keys = [
  "0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5",
  "0x9871b97Ce2cB260E48c1e6Bc3E4a43dfDf1BC681",
  "0xE832F9bCD3f788b5cF6E4d8129c728DF8afBD4F4" // our newest throwaway key from run_live_audit
];

async function checkBalance(addr) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [addr, "latest"]
    })
  }).then(r => r.json());
  console.log(`Address: ${addr} | Balance: ${BigInt(res.result).toString()} wei (0 GEN)`);
}

async function main() {
  console.log("Checking RPC balances for measurement keys:");
  for (const k of keys) {
    await checkBalance(k);
  }
}
main();
