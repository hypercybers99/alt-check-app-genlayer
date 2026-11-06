import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchPage,
  fetchPageAudits,
  fetchPageProgress,
  PageRecord,
  AuditRecord,
  ProgressDelta,
  getWalletClient,
} from "../services/contractService";
import { CONTRACT_ADDRESS } from "../config/chain";
import { useWallet } from "../context/WalletContext";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { InAppNotice } from "../components/InAppNotice";
import { TxPipelineModal } from "../components/TxPipelineModal";
import { TxLifecycleOutcome, deriveTerminalOutcome } from "../lib/txLifecycle";
import {
  Globe,
  Clock,
  Play,
  FileEdit,
  Archive,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const PageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<PageRecord | null>(null);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [progress, setProgress] = useState<ProgressDelta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Maintainer note form state
  const [noteText, setNoteText] = useState("");
  const [noteAuditN, setNoteAuditN] = useState(1);
  const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Pipeline modal state
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [outcome, setOutcome] = useState<TxLifecycleOutcome>({
    state: "idle",
    terminalLabel: "",
    agreeCount: 0,
    totalVotes: 0,
  });
  const [opTitle, setOpTitle] = useState("");
  const [opDesc, setOpDesc] = useState("");

  const { account, address } = useWallet();

  const loadPageData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const p = await fetchPage(id);
      setPage(p);
      if (p) {
        const [a, prog] = await Promise.all([
          fetchPageAudits(id, 0, 15),
          fetchPageProgress(id).catch(() => null),
        ]);
        setAudits(a);
        setProgress(prog);
        if (a.length > 0) {
          setNoteAuditN(a[a.length - 1].n);
        }
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [id]);

  // Execute write actions (Audit, Note, Retire)
  const handleRunAudit = async () => {
    if (!id || !account) return;
    setOpTitle("Multi-Validator Consensus Audit");
    setOpDesc(`Auditing page ${page?.url || id}`);
    setPipelineOpen(true);
    setElapsed(0);
    setOutcome({
      state: "submitting",
      terminalLabel: "Submitting audit request to validator nodes...",
      agreeCount: 0,
      totalVotes: 0,
    });

    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);

    try {
      const client = getWalletClient(account);
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "audit_page",
        args: [id],
        value: 0n,
      });

      setOutcome((prev) => ({
        ...prev,
        state: "consensus_pending",
        txHash,
        terminalLabel: "Validators re-fetching HTML, evaluating rules & model clarity...",
      }));

      const receipt: any = await client.waitForTransactionReceipt({
        hash: txHash,
        interval: 2500,
        retries: 45,
      });

      clearInterval(timer);

      const consensusData = receipt?.consensus_data;
      const votes = consensusData?.votes || {};
      const voteValues = Object.values(votes);
      const agreeCount = voteValues.filter((v: any) => v === "agree").length;
      const totalVotes = voteValues.length || 5;

      const leaderReceipt = consensusData?.leader_receipt?.[0];
      const executionResultName = leaderReceipt?.execution_result || "SUCCESS";
      const rawStatusName = receipt?.status_name || receipt?.statusName || "FINALIZED";

      let revertPayload: string | undefined;
      if (leaderReceipt?.genvm_result?.error_description) {
        revertPayload = leaderReceipt.genvm_result.error_description;
      }

      const terminal = deriveTerminalOutcome({
        rawStatusName,
        executionResultName,
        agreeCount,
        totalVotes,
        revertPayload,
        readbackConfirmed: agreeCount * 2 > totalVotes && !revertPayload,
      });

      setOutcome({ ...terminal, txHash });
      if (terminal.state === "completed") {
        setTimeout(loadPageData, 2000);
      }
    } catch (err: any) {
      clearInterval(timer);
      const msg = String(err?.message || err);
      setOutcome({
        state: "reverted",
        terminalLabel: `Audit failed (${msg.slice(0, 80)})`,
        revertMessage: msg,
        agreeCount: 0,
        totalVotes: 5,
      });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !account) return;
    if (noteText.trim().length < 5 || noteText.trim().length > 500) {
      setNotice({ type: "error", message: "Note must be between 5 and 500 characters in length." });
      return;
    }

    setOpTitle("Attach Registrant Progress Note");
    setOpDesc(`Attaching note to audit #${noteAuditN}`);
    setPipelineOpen(true);
    setElapsed(0);
    setOutcome({
      state: "submitting",
      terminalLabel: "Recording maintainer note on-chain...",
      agreeCount: 0,
      totalVotes: 0,
    });

    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);

    try {
      const client = getWalletClient(account);
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "add_maintainer_note",
        args: [id, Number(noteAuditN), noteText.trim()],
        value: 0n,
      });

      setOutcome((prev) => ({
        ...prev,
        state: "consensus_pending",
        txHash,
        terminalLabel: "Consensus pending...",
      }));

      const receipt: any = await client.waitForTransactionReceipt({
        hash: txHash,
        interval: 2000,
        retries: 30,
      });

      clearInterval(timer);

      const consensusData = receipt?.consensus_data;
      const votes = consensusData?.votes || {};
      const voteValues = Object.values(votes);
      const agreeCount = voteValues.filter((v: any) => v === "agree").length;
      const totalVotes = voteValues.length || 5;

      const leaderReceipt = consensusData?.leader_receipt?.[0];
      const executionResultName = leaderReceipt?.execution_result || "SUCCESS";
      const rawStatusName = receipt?.status_name || receipt?.statusName || "FINALIZED";

      let revertPayload: string | undefined;
      if (leaderReceipt?.genvm_result?.error_description) {
        revertPayload = leaderReceipt.genvm_result.error_description;
      }

      const terminal = deriveTerminalOutcome({
        rawStatusName,
        executionResultName,
        agreeCount,
        totalVotes,
        revertPayload,
        readbackConfirmed: agreeCount * 2 > totalVotes && !revertPayload,
      });

      setOutcome({ ...terminal, txHash });
      if (terminal.state === "completed") {
        setNoteText("");
        setTimeout(loadPageData, 2000);
      }
    } catch (err: any) {
      clearInterval(timer);
      const msg = String(err?.message || err);
      setOutcome({
        state: "reverted",
        terminalLabel: `Note rejected (${msg.slice(0, 80)})`,
        revertMessage: msg,
        agreeCount: 0,
        totalVotes: 5,
      });
    }
  };

  const handleRetire = async () => {
    if (!id || !account) return;

    setOpTitle("Retire Registered Page");
    setOpDesc(`Retiring page ${id}`);
    setPipelineOpen(true);
    setElapsed(0);
    setOutcome({
      state: "submitting",
      terminalLabel: "Submitting retirement transaction...",
      agreeCount: 0,
      totalVotes: 0,
    });

    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);

    try {
      const client = getWalletClient(account);
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "retire_page",
        args: [id],
        value: 0n,
      });

      const receipt: any = await client.waitForTransactionReceipt({
        hash: txHash,
        interval: 2000,
        retries: 30,
      });

      clearInterval(timer);

      const consensusData = receipt?.consensus_data;
      const votes = consensusData?.votes || {};
      const voteValues = Object.values(votes);
      const agreeCount = voteValues.filter((v: any) => v === "agree").length;
      const totalVotes = voteValues.length || 5;

      const leaderReceipt = consensusData?.leader_receipt?.[0];
      const executionResultName = leaderReceipt?.execution_result || "SUCCESS";
      const rawStatusName = receipt?.status_name || receipt?.statusName || "FINALIZED";

      let revertPayload: string | undefined;
      if (leaderReceipt?.genvm_result?.error_description) {
        revertPayload = leaderReceipt.genvm_result.error_description;
      }

      const terminal = deriveTerminalOutcome({
        rawStatusName,
        executionResultName,
        agreeCount,
        totalVotes,
        revertPayload,
        readbackConfirmed: agreeCount * 2 > totalVotes && !revertPayload,
      });

      setOutcome({ ...terminal, txHash });
      if (terminal.state === "completed") {
        setTimeout(loadPageData, 2000);
      }
    } catch (err: any) {
      clearInterval(timer);
      const msg = String(err?.message || err);
      setOutcome({
        state: "reverted",
        terminalLabel: `Retire rejected (${msg.slice(0, 80)})`,
        revertMessage: msg,
        agreeCount: 0,
        totalVotes: 5,
      });
    }
  };

  const isRegistrant = Boolean(
    address && page && address.toLowerCase() === page.registrant.toLowerCase()
  );

  const latestAudit = audits.length > 0 ? audits[audits.length - 1] : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <h1 className="sr-only">Page Audit Details</h1>
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h1 className="text-xl font-bold text-white">Page Not Found or Error</h1>
        <p className="text-sm text-zinc-400">{error || "Page ID not found in ledger"}</p>
        <Link to="/board" className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs font-semibold inline-block">
          Return to Board
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="p-8 bg-zinc-900/70 border border-zinc-800 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-amber-500 uppercase tracking-wider font-semibold">
                ID: {page.id}
              </span>
              {page.retired && (
                <span className="px-2 py-0.5 bg-rose-950/60 text-rose-400 border border-rose-800 text-[10px] rounded font-mono font-bold">
                  RETIRED
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-white">{page.label}</h1>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-amber-400 flex items-center space-x-1"
            >
              <span>{page.url}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!page.retired && (
              <button
                type="button"
                onClick={handleRunAudit}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/10 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Consensus Audit</span>
              </button>
            )}

            {isRegistrant && !page.retired && (
              <button
                type="button"
                onClick={handleRetire}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-rose-950/50 hover:text-rose-300 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Retire Page</span>
              </button>
            )}
          </div>
        </div>

        {/* Page Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-400 block">Registrant</span>
            <span className="font-mono text-zinc-300 truncate block">{page.registrant}</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Total Audits</span>
            <span className="font-mono text-white font-bold">{page.audits_total} of 12</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Latest Mode</span>
            <span className="font-mono text-amber-400 font-bold">
              {page.latest_mode} {page.latest_partial && "(PARTIAL)"}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block">Registered At</span>
            <span className="font-mono text-zinc-300">{page.registered_at}</span>
          </div>
        </div>
      </div>

      {/* Progress Delta Panel (if >= 2 audits) */}
      {progress && (
        <section className="p-6 bg-gradient-to-r from-emerald-950/20 via-zinc-900 to-zinc-900 border border-emerald-800/40 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Verifiable Audit Progress Delta (Audit #{progress.earlier_audit_n} &rarr; Audit #{progress.latest_audit_n})</span>
            </div>
            <div className="text-lg font-black font-mono text-emerald-400">
              {progress.score_delta >= 0 ? `+${progress.score_delta}` : progress.score_delta} Points
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block">Earlier State</span>
              <span className="text-white font-bold text-sm">
                Score {progress.earlier_score} (Grade {progress.earlier_grade})
              </span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block">Remediated State</span>
              <span className="text-emerald-400 font-bold text-sm">
                Score {progress.latest_score} (Grade {progress.latest_grade})
              </span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block">Grade Transition</span>
              <span className="text-amber-400 font-bold text-sm">
                {progress.earlier_grade} &rarr; {progress.latest_grade}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Latest Audit Detail & Rule Evaluation Table */}
      {latestAudit && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Latest Audit Evaluation (Audit #{latestAudit.n})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-zinc-400">
                Score: <strong className="text-white text-base">{latestAudit.score}</strong>/100
              </span>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-lg font-mono">
                Grade {latestAudit.grade}
              </span>
            </div>
          </div>

          {/* Audit Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-mono">
            <div>
              <span className="text-zinc-400 block">DOM Elements</span>
              <span className="text-zinc-200 font-semibold">
                {latestAudit.elements_analyzed} / {latestAudit.elements_seen} seen
              </span>
              {latestAudit.elements_truncated && (
                <span className="text-[10px] text-amber-400 block">Capped at 3,000</span>
              )}
            </div>
            <div>
              <span className="text-zinc-400 block">Body Size</span>
              <span className="text-zinc-200 font-semibold">{latestAudit.fetched_bytes} bytes</span>
              {latestAudit.truncated && (
                <span className="text-[10px] text-amber-400 block">Capped at 300 KB</span>
              )}
            </div>
            <div>
              <span className="text-zinc-400 block">Model Penalty</span>
              <span className="text-zinc-200 font-semibold">
                -{latestAudit.model_penalty} pts ({latestAudit.vague_count} vague)
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Partial Flag</span>
              <span className={latestAudit.partial ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                {latestAudit.partial ? "true (Grade capped at B)" : "false (FULL)"}
              </span>
            </div>
          </div>

          {latestAudit.partial && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
              <strong>Partial Audit Notice:</strong> {latestAudit.partial_note}. Rules requiring full-document scope (R5 heading order, R8 unique IDs, R11 main landmark) are marked &quot;unverified (partial)&quot;.
            </div>
          )}

          {/* Rules R1 to R12 Table */}
          <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th scope="col" className="px-5 py-3">Rule ID</th>
                    <th scope="col" className="px-5 py-3">Criterion Name</th>
                    <th scope="col" className="px-5 py-3">Weight / Cap</th>
                    <th scope="col" className="px-5 py-3">Violations</th>
                    <th scope="col" className="px-5 py-3">Status</th>
                    <th scope="col" className="px-5 py-3">Stored HTML Snippets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-sans">
                  {[
                    { id: "R1", name: "Image Alt Text (Missing/Empty)", weight: "5 pts / finding", cap: "Cap: 25" },
                    { id: "R2", name: "Uninformative Alt Filename/Placeholder", weight: "3 pts / finding", cap: "Cap: 15" },
                    { id: "R3", name: "Form Inputs Missing Accessible Name", weight: "5 pts / finding", cap: "Cap: 25" },
                    { id: "R4", name: "Buttons Missing Accessible Name", weight: "4 pts / finding", cap: "Cap: 20" },
                    { id: "R5", name: "Skipped Heading Levels", weight: "3 pts / finding", cap: "Cap: 12", wholeDoc: true },
                    { id: "R6", name: "Missing or Empty <html lang>", weight: "8 pts", cap: "Cap: 8" },
                    { id: "R7", name: "Missing or Empty <title>", weight: "8 pts", cap: "Cap: 8" },
                    { id: "R8", name: "Duplicate Element IDs", weight: "2 pts / duplicate", cap: "Cap: 10", wholeDoc: true },
                    { id: "R9", name: "Viewport Disables User Zooming", weight: "10 pts", cap: "Cap: 10" },
                    { id: "R10", name: "Empty or Broken Link Text", weight: "4 pts / link", cap: "Cap: 20" },
                    { id: "R11", name: "Missing <main> Landmark", weight: "5 pts", cap: "Cap: 5", wholeDoc: true },
                    { id: "R12", name: "Meta Refresh / Auto-Redirect", weight: "10 pts", cap: "Cap: 10" },
                  ].map((rule) => {
                    const count = latestAudit.rule_counts?.[rule.id] || 0;
                    const isUnverified = latestAudit.partial && rule.wholeDoc && count === 0;
                    const snippets = latestAudit.snippets?.[rule.id] || [];

                    return (
                      <tr key={rule.id} className="hover:bg-zinc-800/20">
                        <td className="px-5 py-3 font-mono font-bold text-amber-400">{rule.id}</td>
                        <td className="px-5 py-3 font-medium text-white">{rule.name}</td>
                        <td className="px-5 py-3 font-mono text-zinc-400 text-[11px]">{rule.weight} ({rule.cap})</td>
                        <td className="px-5 py-3 font-mono font-bold text-zinc-200">{count}</td>
                        <td className="px-5 py-3">
                          {isUnverified ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-mono">
                              unverified (partial)
                            </span>
                          ) : count === 0 ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold font-mono text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pass</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-rose-400 font-semibold font-mono text-[11px]">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Fail (-{count})</span>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 max-w-xs font-mono text-[11px] text-zinc-400">
                          {snippets.length > 0 ? (
                            <div className="space-y-1">
                              {snippets.map((s, sIdx) => (
                                <div key={sIdx} className="p-1 bg-zinc-950 rounded border border-zinc-800 truncate" title={s}>
                                  {s}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-zinc-600 italic">None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Maintainer Notes & History */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white">Maintainer Progress Notes</h2>

        {isRegistrant && !page.retired && (
          <form onSubmit={handleAddNote} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Add a Progress / Remediation Note</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label htmlFor="note-audit-select" className="text-xs text-zinc-400 block mb-1">
                  Audit Number
                </label>
                <select
                  id="note-audit-select"
                  value={noteAuditN}
                  onChange={(e) => setNoteAuditN(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-white"
                >
                  {audits.map((a) => (
                    <option key={a.n} value={a.n}>
                      Audit #{a.n} ({a.grade} / {a.score})
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="note-text-input" className="text-xs text-zinc-400 block mb-1">
                  Note Text (5 to 500 characters)
                </label>
                <input
                  id="note-text-input"
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Remediation commit deployed: fixed missing form labels and skip-link."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                  minLength={5}
                  maxLength={500}
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs transition-colors"
            >
              Post Maintainer Note to Chain
            </button>
          </form>
        )}

        <div className="space-y-3">
          {audits.flatMap((a) => (a.notes || []).map((n) => ({ ...n, auditN: a.n }))).length === 0 ? (
            <p className="text-xs text-zinc-400 italic">No maintainer notes recorded yet.</p>
          ) : (
            audits.flatMap((a) => (a.notes || []).map((n) => ({ ...n, auditN: a.n }))).map((n, nIdx) => (
              <div key={nIdx} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-zinc-400 font-mono">
                  <span>Author: {n.author.slice(0, 10)}... (Audit #{n.auditN})</span>
                  <span>{n.at}</span>
                </div>
                <p className="text-zinc-200">{n.text}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <TxPipelineModal
        isOpen={pipelineOpen}
        outcome={outcome}
        elapsedSeconds={elapsed}
        onClose={() => setPipelineOpen(false)}
        title={opTitle}
        operationDesc={opDesc}
      />

      {notice && (
        <InAppNotice
          type={notice.type}
          message={notice.message}
          onClose={() => setNotice(null)}
        />
      )}
    </div>
  );
};
