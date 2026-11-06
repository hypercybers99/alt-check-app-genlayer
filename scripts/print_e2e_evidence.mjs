import fs from "fs";
const data = JSON.parse(fs.readFileSync("docs/e2e_production_evidence.json", "utf8"));
console.log(`Total transactions in e2e_production_evidence.json: ${data.length}`);
data.forEach((tx, i) => {
  console.log(`${i + 1}. [${tx.fnName}] ${tx.desc} | hash: ${tx.txHash} | votes: ${tx.votes} | success: ${tx.success}`);
});
