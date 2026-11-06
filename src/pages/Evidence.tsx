import React from "react";
import { ACTIVE_CONTRACT, SUPERSEDED_DEPLOYMENTS, NETWORK_CONFIG } from "../config/chain";
import { ShieldCheck, ExternalLink, AlertTriangle, Layers } from "lucide-react";

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
          The positive verification scenarios and remediation demonstrations below utilize static HTML test fixtures hosted by this project repository at <a href="https://github.com/huzyow155/alt-check-fixtures" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">huzyow155/alt-check-fixtures</a> (served over HTTPS via GitHub Pages). Transactions were executed under multi-validator consensus on GenLayer Studionet (Preview).
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
              {[
                {
                  name: "Scenario 1: Clean Accessible Page",
                  fixture: "good.html",
                  reg: "0x5a59ffa105fea05acc3a2484df4f31ce7cae318e23321221e8b0b4f98405a4ca",
                  audit: "0x0005962924374a3c606671862b2757133733f6af62a7075cbaf655788f0f5302",
                  agree: "Accepted by validators (3/5 agreed)",
                  res: "Score 100 (Grade A)",
                },
                {
                  name: "Scenario 2: Defective Page Across R1-R12",
                  fixture: "bad.html",
                  reg: "0x98d91239c561e7f1c82a74807d1dbf018b3b149822f5a9335046d57e23388cec",
                  audit: "0xa788f95121bbdc835ceaf2bf922d804ca9994ffae4dfa2b88f0c0470d35784f0",
                  agree: "Accepted by validators (3/5 agreed)",
                  res: "Score 25 (Grade F)",
                },
                {
                  name: "Scenario 3: Model Ambiguity Evaluation",
                  fixture: "mixed.html",
                  reg: "0x670b96340e422e902190af315b580d12978512949870fdb944758158d59e0ecc",
                  audit: "0xa5cc91061e0ee8f9cbf402fec2bc1943f6407d1d04d2e4ea96fdb88c2fef7b5c",
                  agree: "Accepted by validators (3/5 agreed)",
                  res: "Score 88 (Grade B)",
                },
                {
                  name: "Scenario 4: SPA Shell Detection",
                  fixture: "shell.html",
                  reg: "0x7195740e4672c08b5efb8f5c512956bdb1568150c503eb0e5c4ba64effd77c8d",
                  audit: "0x0d7723d22cf4bef8625b7ffcd323bada48fe353fa8fc68c282f04462a6bc0da5",
                  agree: "Accepted by validators (3/5 agreed)",
                  res: "Score -1 (SHELL_ONLY)",
                },
                {
                  name: "Scenario 4B: Large Doc Partial Audit",
                  fixture: "large.html",
                  reg: "0xe50db6b5170f276a2756d65351688be685972def9f0a4b035214c75d21231525",
                  audit: "0xf16c3954f12aa8d2ad1ab13ecbd4f68e3374c57d90e525035eadde7c888f9867",
                  agree: "Accepted by validators (3/5 agreed)",
                  res: "Score 90 (Grade B capped)",
                },
              ].map((s, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-sans font-medium text-white">{s.name}</td>
                  <td className="px-4 py-3 text-amber-400">{s.fixture}</td>
                  <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">{s.reg}</td>
                  <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">{s.audit}</td>
                  <td className="px-4 py-3 text-emerald-400">{s.agree}</td>
                  <td className="px-4 py-3 font-bold text-white">{s.res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 15 of 15 Reverts */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          15 of 15 Reverts Accepted by Validators with Majority Agreement (3/5 each)
        </h2>
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/40">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">Negative Revert Test Case</th>
                <th scope="col" className="px-4 py-3">Invoked Method</th>
                <th scope="col" className="px-4 py-3">Transaction Hash</th>
                <th scope="col" className="px-4 py-3">Status (Raw Receipt)</th>
                <th scope="col" className="px-4 py-3">Consensus Outcome</th>
                <th scope="col" className="px-4 py-3">Decoded UserError</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
              {[
                { name: "Reject HTTP Scheme", fn: "register_page", hash: "0x4bb32503f136515fe824efd27b13dc0d7ef90dd57d26c1fc6146cc0de7ab16d2", raw: "FINALIZED", votes: "3/5", err: "url must use https" },
                { name: "Reject Localhost Hostname", fn: "register_page", hash: "0x6149c03e97b727c0c23e8ab63c59f0777458f6cbfcf68ff34f1f843d0bf9787b", raw: "FINALIZED", votes: "3/5", err: "url host not allowed" },
                { name: "Reject IPv4 Literal", fn: "register_page", hash: "0x64612dbea46a94744c57f32fbbd7c036fa15e14d64182a39c534438c08443ce5", raw: "FINALIZED", votes: "3/5", err: "url host not allowed" },
                { name: "Reject Private IP Range", fn: "register_page", hash: "0x373123220fe8908aab6220ae0213caa473bd306e2d3bda4d4eb33d16e0509333", raw: "FINALIZED", votes: "3/5", err: "url host not allowed" },
                { name: "Reject Userinfo Credentials", fn: "register_page", hash: "0xb897f5fda7fc819e23e8b66b6bed09a3bcdf24228c7b5dd3e6e2e67fe96eab57", raw: "FINALIZED", votes: "4/5", err: "url contains credentials" },
                { name: "Reject Explicit Non-443 Port", fn: "register_page", hash: "0xe6525c85717b0b4ecad5bc6d78442d9a92812270809933e619eba6fcd70dcc95", raw: "FINALIZED", votes: "4/5", err: "url port not allowed" },
                { name: "Reject Over-Length URL", fn: "register_page", hash: "0xe5a093789bb93e5a00068f17198bc3625eff13145a57150d9b9b7c4c496ebc8f", raw: "FINALIZED", votes: "3/5", err: "url too long" },
                { name: "Reject Non-HTML MIME (data.json)", fn: "audit_page", hash: "0x67b321657fe21b10dd90a399ed27f3d233ae2790e2f03091a6f8ee6a75c3a410", raw: "FINALIZED", votes: "3/5", err: "not an html page" },
                { name: "Reject Non-HTML MIME (notes.txt)", fn: "audit_page", hash: "0xbfdc5fa402668e0d8bedc5943f35890847f6401243744b66e7322175dcfb09c2", raw: "FINALIZED", votes: "3/5", err: "not an html page" },
                { name: "Audit Nonexistent Page ID", fn: "audit_page", hash: "0xca26c9dc85e211c75530673b6696b7c59893ac59ca54c26cab1852fb0c901d6d", raw: "FINALIZED", votes: "5/5", err: "page not found" },
                { name: "Duplicate Page Registration", fn: "register_page", hash: "0x19f4ac315b2e103642fc4e450fd73fe12d20bf3099557eb4c106f95934b70e58", raw: "FINALIZED", votes: "3/5", err: "page already registered" },
                { name: "Audit Cooldown Active", fn: "audit_page", hash: "0x932aa3cd6ef05cf33e26394067e0c37bcb33506becfaa39d63499c01c0343936", raw: "FINALIZED", votes: "3/5", err: "audit cooldown active" },
                { name: "Non-Registrant Maintainer Note", fn: "add_maintainer_note", hash: "0x7c084e32bc56897fdba64d5eb9b5108c94d9a2c61a73d2a185f7a7b2fae17b3d", raw: "FINALIZED", votes: "3/5", err: "only the registrant can do this" },
                { name: "Maintainer Note Too Short (< 5 chars)", fn: "add_maintainer_note", hash: "0x51d35dc589466cd08c4fa7b16c7fa3738a1f6546ef74cffe4438cb5b7bca0779", raw: "FINALIZED", votes: "3/5", err: "note length out of range" },
                { name: "Non-Registrant Retire Page", fn: "retire_page", hash: "0x10343d90a0312e4047e05126f13353a92767b0a1db0235ca22107cbb698da0b4", raw: "FINALIZED", votes: "3/5", err: "only the registrant can do this" },
              ].map((r, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-sans font-medium text-white">{r.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{r.fn}</td>
                  <td className="px-4 py-3 text-zinc-400 truncate max-w-xs">{r.hash}</td>
                  <td className="px-4 py-3 text-zinc-400 font-mono">`{r.raw}`</td>
                  <td className="px-4 py-3 text-amber-400">Accepted by validators ({r.votes} agreed) - expected revert</td>
                  <td className="px-4 py-3 text-rose-400 font-bold">{r.err}</td>
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
