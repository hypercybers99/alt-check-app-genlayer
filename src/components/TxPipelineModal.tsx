import React, { useEffect, useRef } from "react";
import { ModalPortal } from "./ModalPortal";
import { modalManager } from "../lib/modalManager";
import { TxState, TxLifecycleOutcome } from "../lib/txLifecycle";
import { getRevertExplanation } from "../lib/revertMap";
import { NETWORK_CONFIG } from "../config/chain";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TxPipelineModalProps {
  isOpen: boolean;
  outcome: TxLifecycleOutcome;
  elapsedSeconds: number;
  onClose: () => void;
  title?: string;
  operationDesc?: string;
}

export const TxPipelineModal: React.FC<TxPipelineModalProps> = ({
  isOpen,
  outcome,
  elapsedSeconds,
  onClose,
  title = "Consensus Transaction Pipeline",
  operationDesc = "Processing intelligent contract transaction",
}) => {
  const modalId = "tx-pipeline-modal";
  const [showRawDetails, setShowRawDetails] = React.useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalManager.register(modalId);
      closeBtnRef.current?.focus();
    } else {
      modalManager.unregister(modalId);
    }
    return () => modalManager.unregister(modalId);
  }, [isOpen]);

  if (!isOpen) return null;

  const isTerminal = [
    "completed",
    "disagreed",
    "reverted",
    "timed_out",
  ].includes(outcome.state);

  const getStatusIcon = () => {
    switch (outcome.state) {
      case "completed":
        return <CheckCircle2 className="w-10 h-10 text-emerald-400" />;
      case "disagreed":
        return <AlertOctagon className="w-10 h-10 text-amber-400" />;
      case "reverted":
        return <XCircle className="w-10 h-10 text-rose-500" />;
      default:
        return <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />;
    }
  };

  const explanation = outcome.revertMessage
    ? getRevertExplanation(outcome.revertMessage)
    : null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[900] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-pipeline-title"
      >
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative z-[1000] my-8 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <h2 id="tx-pipeline-title" className="text-base font-bold text-white">
              {title}
            </h2>
            {isTerminal && (
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded"
              >
                Close
              </button>
            )}
          </div>

          {/* ARIA Live Region for Screen Readers */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {outcome.terminalLabel}. Elapsed time {elapsedSeconds} seconds.
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-center">
            <div className="flex justify-center">{getStatusIcon()}</div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                {outcome.terminalLabel}
              </h3>
              <p className="text-xs text-zinc-400">{operationDesc}</p>
            </div>

            {/* Elapsed Time Display */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-950 rounded-full border border-zinc-800 text-xs font-mono text-zinc-300">
              <span>Elapsed:</span>
              <span className="text-amber-400 font-bold">{elapsedSeconds}s</span>
              {!isTerminal && <span className="text-zinc-400">(audits typically take 10-30s)</span>}
            </div>

            {/* Voting Consensus Bar */}
            {outcome.totalVotes && outcome.totalVotes > 0 ? (
              <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Validator Consensus:</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    {outcome.agreeCount || 0} of {outcome.totalVotes} nodes agreed
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      (outcome.agreeCount || 0) * 2 > outcome.totalVotes
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                    style={{
                      width: `${((outcome.agreeCount || 0) / outcome.totalVotes) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ) : null}

            {/* Revert / Error Explanation Box */}
            {explanation && (
              <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl text-left space-y-2">
                <span className="text-xs font-bold text-rose-400 block uppercase tracking-wider">
                  {explanation.title}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {explanation.explanation}
                </p>
                <div className="text-xs text-amber-300 font-medium pt-1">
                  &rarr; Suggested Action: {explanation.action}
                </div>
              </div>
            )}

            {/* Transaction Hash */}
            {outcome.txHash && (
              <div className="pt-2 text-xs text-left">
                <span className="text-zinc-400 block mb-1">Transaction Hash:</span>
                <a
                  href={`${NETWORK_CONFIG.explorerBaseUrl}/transaction/${outcome.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-amber-400 hover:text-amber-300 flex items-center justify-between text-xs break-all"
                >
                  <span className="truncate">{outcome.txHash}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                </a>
              </div>
            )}

            {/* Raw Details Toggle */}
            <div className="pt-2 border-t border-zinc-800 text-left">
              <button
                type="button"
                onClick={() => setShowRawDetails(!showRawDetails)}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
              >
                <span>Raw Consensus & Node Details</span>
                {showRawDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showRawDetails && (
                <div className="mt-2 p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1">
                  <div>raw_status: {outcome.rawStatus || "PENDING"}</div>
                  <div>execution_result: {outcome.rawExecutionResult || "PENDING"}</div>
                  <div>revert_message: {outcome.revertMessage || "none"}</div>
                  <div>network: {NETWORK_CONFIG.name}</div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 shrink-0 flex justify-end">
            {isTerminal ? (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors"
              >
                Done
              </button>
            ) : (
              <span className="text-xs text-zinc-400 italic">Waiting for consensus...</span>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
