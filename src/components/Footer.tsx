import React from "react";
import { Link } from "react-router-dom";
import { NETWORK_CONFIG, CONTRACT_ADDRESS } from "../config/chain";
import { ExternalLink, ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-8 mt-auto text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-200">Network:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono">
              {NETWORK_CONFIG.name}
            </span>
            <span className="text-zinc-400 font-mono">Chain ID: {NETWORK_CONFIG.chainId}</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`${NETWORK_CONFIG.explorerBaseUrl}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 flex items-center space-x-1 font-mono transition-colors"
            >
              <span>Contract {CONTRACT_ADDRESS.slice(0, 8)}...</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/hypercybers99/alt-check-genlayer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 flex items-center space-x-1 transition-colors"
            >
              <span>Contract Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/50 flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-zinc-400 leading-relaxed">
            <strong className="text-zinc-300 font-medium">Honest Scope Notice:</strong> AltCheck audits raw server-delivered HTML under multi-validator consensus across a deterministic subset of accessibility criteria. It does not run client JavaScript, render CSS styles, calculate color contrast, or simulate screen reader hardware. SPAs serving client-rendered shells are honestly flagged as <code className="text-amber-400 bg-zinc-800 px-1 py-0.5 rounded font-mono">SHELL_ONLY</code>. An audit record is an automated signal and does not constitute a formal legal compliance certificate.
          </p>
        </div>

        <div className="text-center text-zinc-400 pt-2 font-mono">
          AltCheck Desk v1.0.3 &bull; Open source under MIT License
        </div>
      </div>
    </footer>
  );
};
