import React from "react";
import { ACTIVE_CONTRACT, SUPERSEDED_DEPLOYMENTS, NETWORK_CONFIG } from "../config/chain";
import { ShieldCheck, ExternalLink, AlertTriangle, Layers, CheckCircle2, XCircle } from "lucide-react";
import evidenceData from "../data/evidenceData.json";

export const Evidence: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          On-Chain Evidence & Verification Log
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Verifiable consensus transactions recorded on GenLayer Studionet (Preview).
        </p>
      </div>

      {/* Disclosures */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-300 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>Test Fixtures & Environment Disclosure</span>
        </div>
        <p className="leading-relaxed">
          The positive verification scenarios and remediation demonstrations below utilize static HTML test fixtures hosted by this project at <a href="https://hypercybers99.github.io/alt-check-fixtures" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">hypercybers99.github.io/alt-check-fixtures</a> (served over HTTPS via GitHub Pages). Transactions were executed under multi-validator consensus on GenLayer Studionet (Preview).
        </p>
      </div>

      {/* Contract Deployments */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Intelligent Contract Deployments</h2>
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/40">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th scope="col" className="px-5 py-3">Contract / Version</th>
                <th scope="col" className="px-5 py-3">Role / Status</th>
                <th scope="col" className="px-5 py-3">Address</th>
                <th scope="col" className="px-5 py-3">Deploy Tx Hash</th>
                <th scope="col" className="px-5 py-3">Source SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
              <tr className="hover:bg-zinc-800/30">
                <td className="px-5 py-3 font-bold text-white">AltCheck v1.0.1</td>
                <td className="px-5 py-3 text-emerald-400 font-bold">Active Ledger</td>
                <td className="px-5 py-3 text-amber-400">
                  <a href={`${NETWORK_CONFIG.explorerBaseUrl}/address/${ACTIVE_CONTRACT.address}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {ACTIVE_CONTRACT.address}
                  </a>
                </td>
                <td className="px-5 py-3 text-zinc-400 truncate max-w-xs">{ACTIVE_CONTRACT.deployTxHash}</td>
                <td className="px-5 py-3 text-zinc-400 truncate max-w-xs">{ACTIVE_CONTRACT.sourceSha256}</td>
              </tr>
              {SUPERSEDED_DEPLOYMENTS.map((s, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/20 text-zinc-400">
                  <td className="px-5 py-3 font-medium">AltCheck {s.version}</td>
                  <td className="px-5 py-3 text-zinc-400">{s.role}</td>
                  <td className="px-5 py-3 truncate max-w-xs">{s.address}</td>
                  <td className="px-5 py-3 truncate max-w-xs">{s.deployTxHash}</td>
                  <td className="px-5 py-3 truncate max-w-xs">{s.sourceSha256}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Positive Verification Scenarios */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Positive Consensus Scenarios</h2>
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/40">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">Scenario</th>
                <th scope="col" className="px-4 py-3">Fixture URL</th>
                <th scope="col" className="px-4 py-3">Register Tx</th>
                <th scope="col" className="px-4 py-3">Audit Tx</th>
                <th scope="col" className="px-4 py-3">Consensus Agreement</th>
                <th scope="col" className="px-4 py-3">Score & Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
              {evidenceData.positiveScenarios.map((s, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-sans font-medium text-white">{s.name}</td>
                  <td className="px-4 py-3 text-amber-400">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.fixture}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">
                    <a href={`${NETWORK_CONFIG.explorerBaseUrl}/tx/${s.reg}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.reg}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">
                    <a href={`${NETWORK_CONFIG.explorerBaseUrl}/tx/${s.audit}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.audit}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-emerald-400">{s.agree}</td>
                  <td className="px-4 py-3 font-bold text-white">{s.res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 15 Expected Reverts */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          15 expected reverts: validators agreed on the revert, state not applied
        </h2>
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/40">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">Negative Revert Test Case</th>
                <th scope="col" className="px-4 py-3">Invoked Method</th>
                <th scope="col" className="px-4 py-3">Transaction Hash</th>
                <th scope="col" className="px-4 py-3">Raw receipt status</th>
                <th scope="col" className="px-4 py-3">Consensus Outcome</th>
                <th scope="col" className="px-4 py-3">Decoded UserError</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
              {evidenceData.revertScenarios.map((r, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-sans font-medium text-white">{r.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{r.fn}</td>
                  <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">
                    <a href={`${NETWORK_CONFIG.explorerBaseUrl}/tx/${r.hash}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {r.hash}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 font-mono">`{r.rawStatus}`</td>
                  <td className="px-4 py-3 text-amber-400">
                    Reverted - state not applied ({r.votes} agreed)
                  </td>
                  <td className="px-4 py-3 text-rose-400 font-bold">{r.err}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live E2E Production Lifecycle Transactions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          End-to-End Production Lifecycle Transactions (13 of 13 Verified)
        </h2>
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/40">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">#</th>
                <th scope="col" className="px-4 py-3">Operation / Scenario</th>
                <th scope="col" className="px-4 py-3">Method</th>
                <th scope="col" className="px-4 py-3">Sender</th>
                <th scope="col" className="px-4 py-3">Transaction Hash</th>
                <th scope="col" className="px-4 py-3">Raw receipt status</th>
                <th scope="col" className="px-4 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
              {evidenceData.e2eLifecycle.map((e, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-zinc-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-sans font-medium text-white">{e.desc}</td>
                  <td className="px-4 py-3 text-amber-400">{e.fnName}</td>
                  <td className="px-4 py-3 text-zinc-400">{e.sender.slice(0, 8)}...{e.sender.slice(-4)}</td>
                  <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">
                    <a href={`${NETWORK_CONFIG.explorerBaseUrl}/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {e.txHash}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 font-mono">`{e.rawStatusName}`</td>
                  <td className="px-4 py-3">
                    {e.success ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted by validators ({e.votes} agreed) - state applied</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reverted - state not applied ({e.votes} agreed on revert)</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scope Separation: Unit-Tested Only */}
      <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-white">Separation of Scope: Unit-Tested Only Paths</h2>
        <p className="text-xs text-zinc-400">
          The following boundary behaviors are thoroughly validated through the local test harness (`tests/`) but do not have dedicated on-chain transactions to avoid unnecessary Studionet state bloat:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-300">
          <li><strong>Large HTML body truncation at boundary:</strong> Truncation of raw HTTP body payloads at exactly `MAX_BODY_BYTES = 300,000 bytes` with `partial: true` setting.</li>
          <li><strong>Extended Board Tie-Breaking:</strong> Comprehensive ranking permutations ordering full audits above partial audits at identical scores beyond the registered on-chain fixtures.</li>
          <li><strong>Model Layer Injection Fallback:</strong> Language model prompt injection edge cases bounded strictly by the 10-point maximum penalty cap.</li>
          <li><strong>Page Audit Cap:</strong> Enforcement of the `MAX_AUDITS_PER_PAGE = 12` rejection boundary.</li>
          <li><strong>Pagination Bounds:</strong> Negative offset and out-of-range limit view rejections (`offset &lt; 0`, `limit &gt; 50`).</li>
        </ul>
      </section>
    </div>
  );
};
