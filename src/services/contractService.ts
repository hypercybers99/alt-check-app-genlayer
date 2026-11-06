import { createClient, chains, createAccount } from "genlayer-js";
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from "../config/chain";

export interface PageRecord {
  id: string;
  label: string;
  url: string;
  registrant: string;
  registered_at: string;
  registered_ts: number;
  audits_total: number;
  latest_n: number;
  latest_mode: string;
  latest_score: number;
  latest_grade: string;
  latest_partial: boolean;
  best_score: number;
  best_grade?: string;
  best_partial: boolean;
  first_full_score: number;
  last_audit_ts: number;
  retired: boolean;
}

export interface RuleCounts {
  [ruleId: string]: number;
}

export interface RuleSnippets {
  [ruleId: string]: string[];
}

export interface ModelLabel {
  kind: "alt" | "link";
  text: string;
  label: "CLEAR" | "VAGUE";
}

export interface MaintainerNote {
  author: string;
  text: string;
  at: string;
  ts: number;
}

export interface AuditRecord {
  page_id: string;
  n: number;
  auditor: string;
  at: string;
  ts: number;
  final_url: string;
  cross_host_redirect: boolean;
  fetched_bytes: number;
  truncated: boolean;
  elements_seen: number;
  elements_analyzed: number;
  elements_truncated: boolean;
  partial: boolean;
  partial_note: string;
  unverified_rules: string[];
  body_sha256: string;
  mode: "FULL" | "SHELL_ONLY";
  visible_text_chars: number;
  script_tag_count: number;
  decorative_unmarked: number;
  rule_counts: RuleCounts;
  snippets: RuleSnippets;
  model_labels: ModelLabel[];
  vague_count: number;
  model_penalty: number;
  score: number;
  grade: string;
  notes: MaintainerNote[];
}

export interface ProgressDelta {
  score_delta: number;
  earlier_score: number;
  latest_score: number;
  earlier_grade: string;
  latest_grade: string;
  earlier_partial: boolean;
  latest_partial: boolean;
  rule_deltas: { [ruleId: string]: number };
  earlier_audit_n: number;
  latest_audit_n: number;
}

export interface BoardItem {
  id: string;
  label: string;
  url: string;
  score: number;
  grade: string;
  partial: boolean;
  audits_count?: number;
  delta?: number;
  mode?: string;
}

export interface BoardData {
  best_pages: BoardItem[];
  most_improved: BoardItem[];
}

export interface ContractMeta {
  pages_count: number;
  audits_count: number;
  contract_version: string;
  max_elements: number;
  max_body_bytes: number;
  audit_cooldown_seconds: number;
}

export function getPublicClient() {
  return createClient({
    chain: chains.studionet,
    endpoint: NETWORK_CONFIG.rpcUrl,
  });
}

export function getWalletClient(account: any) {
  return createClient({
    chain: chains.studionet,
    endpoint: NETWORK_CONFIG.rpcUrl,
    account,
  });
}

export async function getAccountBalance(address: string): Promise<bigint> {
  try {
    const res = await fetch(NETWORK_CONFIG.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
    });
    const json = await res.json();
    if (json.result) {
      return BigInt(json.result);
    }
  } catch {
    // fallback
  }
  return 0n;
}

export async function fetchContractMeta(): Promise<ContractMeta> {
  const client = getPublicClient();
  const raw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_meta",
    args: [],
  });
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return {
    pages_count: Number(parsed.pages_count || 0),
    audits_count: Number(parsed.audits_count || 0),
    contract_version: parsed.contract_version || "1.0.1",
    max_elements: Number(parsed.max_elements || 3000),
    max_body_bytes: Number(parsed.max_body_bytes || 300000),
    audit_cooldown_seconds: Number(parsed.audit_cooldown_seconds || 300),
  };
}

export async function fetchBoard(limit = 20): Promise<BoardData> {
  const client = getPublicClient();
  const raw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_board",
    args: [limit],
  });
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return {
    best_pages: parsed.best_pages || [],
    most_improved: parsed.most_improved || [],
  };
}

export async function fetchPage(pageId: string): Promise<PageRecord | null> {
  const client = getPublicClient();
  try {
    const raw: any = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_page",
      args: [pageId],
    });
    return typeof raw === "string" ? JSON.parse(raw) : (raw as PageRecord);
  } catch (err: any) {
    if (String(err).includes("page not found")) {
      return null;
    }
    throw err;
  }
}

export async function fetchPageAudits(
  pageId: string,
  offset = 0,
  limit = 20
): Promise<AuditRecord[]> {
  const client = getPublicClient();
  const raw: any = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_audits",
    args: [pageId, offset, limit],
  });
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return Array.isArray(parsed) ? (parsed as AuditRecord[]) : [];
}

export async function fetchPageProgress(
  pageId: string
): Promise<ProgressDelta | null> {
  const client = getPublicClient();
  try {
    const raw: any = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_progress",
      args: [pageId],
    });
    return typeof raw === "string" ? JSON.parse(raw) : (raw as ProgressDelta);
  } catch (err: any) {
    if (String(err).includes("need at least 2 audits")) {
      return null;
    }
    throw err;
  }
}

export async function fetchRules(): Promise<any[]> {
  const client = getPublicClient();
  const raw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_rules",
    args: [],
  });
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return parsed.rules || [];
}

export async function fetchPageIds(offset = 0, limit = 50): Promise<string[]> {
  const client = getPublicClient();
  const raw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "list_page_ids",
    args: [offset, limit],
  });
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return parsed.page_ids || [];
}
