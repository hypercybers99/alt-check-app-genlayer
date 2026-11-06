import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { getWalletClient } from "../services/contractService";
import { CONTRACT_ADDRESS } from "../config/chain";
import { validateAltCheckUrl } from "../lib/urlParser";
import { TxPipelineModal } from "../components/TxPipelineModal";
import { TxLifecycleOutcome, deriveTerminalOutcome } from "../lib/txLifecycle";
import { Globe, AlertTriangle, ShieldCheck, ArrowRight, Info } from "lucide-react";

export const Register: React.FC = () => {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [outcome, setOutcome] = useState<TxLifecycleOutcome>({
    state: "idle",
    terminalLabel: "Preparing registration",
    agreeCount: 0,
    totalVotes: 0,
  });

  const { account } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    // 1. Label check
    if (label.trim().length < 3 || label.trim().length > 80) {
      setClientError("Page label must be between 3 and 80 characters long.");
      return;
    }

    // 2. URL client validation mirroring contract rules
    const urlValidation = validateAltCheckUrl(url);
    if (!urlValidation.valid) {
      setClientError(`URL Validation Failed: ${urlValidation.error}`);
      return;
    }

    if (!account) {
      setClientError("Please initialize or import a wallet account first.");
      return;
    }

    setPipelineOpen(true);
    setElapsed(0);
    setOutcome({
      state: "submitting",
      terminalLabel: "Submitting page registration to validators...",
      agreeCount: 0,
      totalVotes: 0,
    });

    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    try {
      const client = getWalletClient(account);
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: "register_page",
        args: [label.trim(), url.trim()],
        value: 0n,
      });

      setOutcome((prev) => ({
        ...prev,
        state: "consensus_pending",
        txHash,
        terminalLabel: "Consensus pending (validators voting)...",
      }));

      // Poll transaction receipt
      const receipt: any = await client.waitForTransactionReceipt({
        hash: txHash,
        interval: 2000,
        retries: 40,
      });

      clearInterval(timer);

      // Parse votes and outcomes
      const consensusData = receipt?.consensus_data;
      const votes = consensusData?.votes || {};
      const voteValues = Object.values(votes);
      const agreeCount = voteValues.filter((v: any) => v === "agree").length;
      const totalVotes = voteValues.length || 5;

      const leaderReceipt = consensusData?.leader_receipt?.[0];
      const executionResultName = leaderReceipt?.execution_result || "SUCCESS";
      const rawStatusName = receipt?.status_name || receipt?.statusName || "FINALIZED";

      // Check for revert payload in result
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

      setOutcome({
        ...terminal,
        txHash,
      });
    } catch (err: any) {
      clearInterval(timer);
      const msg = String(err?.message || err);
      setOutcome({
        state: "reverted",
        terminalLabel: `Registration rejected (${msg.slice(0, 80)})`,
        revertMessage: msg,
        agreeCount: 0,
        totalVotes: 5,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Register Page for Consensus Audit
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Registers a target web page in the contract ledger. Page IDs are computed deterministically from the URL, registrant address, and nonce.
        </p>
      </div>

      {/* Redirect Limitation Notice */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold">
          <Info className="w-4 h-4" />
          <span>Important Redirect Scope Limitation</span>
        </div>
        <p className="text-zinc-300 leading-relaxed">
          The GenLayer runtime HTTP client follows redirects automatically and does not expose redirect targets to contract code. Consequently, URL security checks constrain only the initially registered URL. AltCheck audits whatever raw HTML is delivered at the end of the redirect chain.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-6">
        <div className="space-y-2">
          <label htmlFor="reg-label" className="text-sm font-semibold text-zinc-200 block">
            Page Title / Descriptive Label
          </label>
          <input
            id="reg-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., My Portfolio / Documentation Homepage"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            required
            minLength={3}
            maxLength={80}
          />
          <span className="text-[11px] text-zinc-400 block font-mono">Between 3 and 80 characters</span>
        </div>

        <div className="space-y-2">
          <label htmlFor="reg-url" className="text-sm font-semibold text-zinc-200 block">
            Target Page HTTPS URL
          </label>
          <div className="relative">
            <input
              id="reg-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page.html"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              required
            />
            <Globe className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          </div>
          <span className="text-[11px] text-zinc-400 block">
            Must use <code className="text-amber-400">https://</code> scheme on default port 443. No credentials, IP literals, or localhost. Max 2048 chars.
          </span>
        </div>

        {clientError && (
          <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{clientError}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/10 focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Submit Page Registration (On-Chain)
          </button>
        </div>
      </form>

      <TxPipelineModal
        isOpen={pipelineOpen}
        outcome={outcome}
        elapsedSeconds={elapsed}
        onClose={() => {
          setPipelineOpen(false);
          if (outcome.state === "completed") {
            navigate("/board");
          }
        }}
        title="Page Registration Transaction"
        operationDesc={`Registering ${url}`}
      />
    </div>
  );
};
