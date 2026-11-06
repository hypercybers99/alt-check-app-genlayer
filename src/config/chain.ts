export interface ContractConfig {
  address: string;
  deployTxHash: string;
  sourceSha256: string;
  version: string;
  role: string;
  status: string;
  consensusResult: string;
}

export const NETWORK_CONFIG = {
  name: "GenLayer Studionet (Preview)",
  chainId: 61999,
  rpcUrl: "https://studio.genlayer.com/api",
  explorerBaseUrl: "https://explorer-studio.genlayer.com",
};

export const CONTRACT_ADDRESS = "0x1292C9bf74C2ef2789184Ec9808379d46279dd30";
export const DEPLOY_TX_HASH = "0xd171df04a4a959e77f17c8b5c8109d29419baaa273c0df0d58736dbbfbc56cd4";
export const SOURCE_SHA256 = "9af349d914c6c0e44199a00b0bc4c219a27fc6a9836b3b3a70574c23e4cdc262";

export const WALLET_DISCLAIMER =
  "Studionet-only throwaway key. Preview network, no real value.";

export const ACTIVE_CONTRACT: ContractConfig = {
  address: CONTRACT_ADDRESS,
  deployTxHash: DEPLOY_TX_HASH,
  sourceSha256: SOURCE_SHA256,
  version: "1.0.1",
  role: "Active Ledger",
  status: "ACCEPTED",
  consensusResult: "MAJORITY_AGREE",
};

export const SUPERSEDED_DEPLOYMENTS: ContractConfig[] = [
  {
    address: "0xBA2D886E76b87feD8dCd5be61fccFA2A4e1D388A",
    deployTxHash: "0xf2ec73168cf65d504ddedf4b965bce56d9fa399c86a955ce98f06600e992f9db",
    sourceSha256: "b9c55a75970aca12f11edaf447e16a09a1d9a8a661e068e3ef2a5cddaa00e202",
    version: "1.0.0",
    role: "Superseded Ledger",
    status: "SUPERSEDED",
    consensusResult: "MAJORITY_AGREE",
  },
  {
    address: "0xC40bf93bA9c3f1cf9A1088087C4c7156E538FB95",
    deployTxHash: "0xeecc2d204f91eae6ce63444e251f69a2d71463d86edca0f2edf050edfe5593ba",
    sourceSha256: "c7b2966c2ea5dcfa263da0f662f51add37167e490a6ff1bfd2b0d32c075e3520",
    version: "0.1.0",
    role: "Superseded Diagnostic",
    status: "SUPERSEDED",
    consensusResult: "MAJORITY_AGREE",
  },
];
