const files = [
  "bad.html",
  "data.json",
  "demo.html",
  "fixed.html",
  "fresh.html",
  "good.html",
  "index.html",
  "large.html",
  "mixed.html",
  "notes.txt",
  "shell.html"
];

const hosts = [
  "https://huzyow155.github.io/alt-check-fixtures",
  "https://hypercybers99.github.io/alt-check-fixtures"
];

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.status;
  } catch (e) {
    return `ERR: ${e.message}`;
  }
}

async function main() {
  console.log("Checking fixture hosting across both hosts:\n");
  for (const host of hosts) {
    console.log(`=== Host: ${host} ===`);
    for (const file of files) {
      const url = `${host}/${file}`;
      const status = await checkUrl(url);
      console.log(`  ${file.padEnd(12)} -> HTTP ${status} (${url})`);
    }
    console.log("");
  }
}

main();
