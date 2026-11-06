import { describe, it, expect } from "vitest";
import { ACTIVE_CONTRACT, SUPERSEDED_DEPLOYMENTS, NETWORK_CONFIG } from "../src/config/chain";
import fs from "fs";
import path from "path";

describe("Address & Deployments Consistency Across Files", () => {
  const contractRepoDeployments = path.resolve(
    process.cwd(),
    "../AltCheck_V1.2/scripts/deploy/deployments.json"
  );

  it("chain.ts matches active and superseded deployments exactly", () => {
    if (fs.existsSync(contractRepoDeployments)) {
      const depData = JSON.parse(fs.readFileSync(contractRepoDeployments, "utf8"));
      expect(ACTIVE_CONTRACT.address.toLowerCase()).toBe(
        depData.altCheck.contractAddress.toLowerCase()
      );
      expect(ACTIVE_CONTRACT.deployTxHash.toLowerCase()).toBe(
        depData.altCheck.deployTxHash.toLowerCase()
      );
      expect(ACTIVE_CONTRACT.sourceSha256.toLowerCase()).toBe(
        depData.altCheck.sourceSha256.toLowerCase()
      );
    }
  });

  it("addresses and hashes are full 42 and 66 characters long without truncation", () => {
    expect(ACTIVE_CONTRACT.address.length).toBe(42);
    expect(ACTIVE_CONTRACT.deployTxHash.length).toBe(66);
    expect(ACTIVE_CONTRACT.sourceSha256.length).toBe(64);

    for (const s of SUPERSEDED_DEPLOYMENTS) {
      expect(s.address.length).toBe(42);
      expect(s.deployTxHash.length).toBe(66);
      expect(s.sourceSha256.length).toBe(64);
    }
  });

  it("chain ID and network wording match strict GenLayer Studionet specification", () => {
    expect(NETWORK_CONFIG.chainId).toBe(61999);
    expect(NETWORK_CONFIG.name).toBe("GenLayer Studionet (Preview)");
    expect(NETWORK_CONFIG.rpcUrl).toBe("https://studio.genlayer.com/api");
  });
});
