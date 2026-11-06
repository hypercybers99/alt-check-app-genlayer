import React from "react";
import { useWallet } from "../context/WalletContext";
import { WALLET_DISCLAIMER, NETWORK_CONFIG } from "../config/chain";
import { Wallet, Key, RefreshCw, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";

export const WalletPage: React.FC = () => {
  const { address, privateKey, balance, refreshBalance, resetWallet, importKey } = useWallet();
  const [importInput, setImportInput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!importInput.trim()) {
      setError("Please provide a valid private key.");
      return;
    }
    const ok = importKey(importInput.trim());
    if (ok) {
      setSuccess(true);
      setImportInput("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError("Failed to parse private key. Must be a 32-byte hex string (with or without 0x).");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Wallet & Studionet Test Funds
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Manage your local throwaway test keys, inspect live GEN balance, and review measured execution funding requirements.
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start space-x-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-200 block text-sm font-bold">
            {WALLET_DISCLAIMER}
          </strong>
          <p className="text-amber-200/80 leading-relaxed">
            Never import private keys that control real funds on Ethereum mainnet or any other production network. All accounts generated or imported here operate exclusively on {NETWORK_CONFIG.name}.
          </p>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-amber-500" />
            <span>Active Account Overview</span>
          </h2>
          <button
            type="button"
            onClick={refreshBalance}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Balance</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-zinc-400 block uppercase tracking-wider text-[10px]">Active Address</span>
            <span className="text-amber-400 font-bold break-all block">{address || "None"}</span>
          </div>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-zinc-400 block uppercase tracking-wider text-[10px]">GEN Balance</span>
            <span className="text-white font-black text-base block">
              {balance === null ? "Loading..." : `${(Number(balance) / 1e18).toFixed(4)} GEN`}
            </span>
          </div>
        </div>

        {/* Private Key Display */}
        <div className="p-4 bg-zinc-950/70 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-xs font-semibold text-zinc-300 block">Current Private Key</span>
          <div className="font-mono text-xs text-zinc-400 break-all p-2.5 bg-zinc-900 rounded-xl border border-zinc-800/80 select-all">
            {privateKey}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={resetWallet}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Generate Fresh Key
          </button>
          <a
            href="https://studio.genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <span>Open Studionet Faucet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Import / Switch Form */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Key className="w-5 h-5 text-amber-500" />
          <span>Switch or Import Secondary Key</span>
        </h2>
        <p className="text-xs text-zinc-400">
          To test non-registrant permission checks (such as verifying that non-registrants cannot add maintainer notes or retire pages), switch between two distinct throwaway accounts below.
        </p>

        <form onSubmit={handleImport} className="space-y-3">
          <input
            type="password"
            value={importInput}
            onChange={(e) => setImportInput(e.target.value)}
            placeholder="Enter 32-byte hex private key (0x...)"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          {success && <p className="text-xs text-emerald-400">Key successfully imported and activated!</p>}
          <button
            type="submit"
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Import Key
          </button>
        </form>
      </div>

      {/* Funding Guide & Empirical Measurements */}
      <section className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4 text-xs leading-relaxed text-zinc-300">
        <h2 className="text-lg font-bold text-white">Empirical Funding & Gas Measurement</h2>
        <p>
          Measured on 2026-10-31: 13 transactions from 2 keys with 0 GEN, balance 0 before and after, no GEN deducted. Studionet Preview behavior may change.
        </p>
        <div tabIndex={0} role="region" aria-label="Funding measurements table" className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-950/70 focus:outline-none focus:ring-1 focus:ring-amber-500">
          <table className="min-w-full divide-y divide-zinc-800 text-left font-mono text-[11px]">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-2.5">Contract Write Method</th>
                <th className="px-4 py-2.5">Initial Account Balance</th>
                <th className="px-4 py-2.5">Final Account Balance</th>
                <th className="px-4 py-2.5">GEN Deducted</th>
                <th className="px-4 py-2.5">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr>
                <td className="px-4 py-2 font-bold text-white">register_page</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400 font-bold">Accepted by validators (3/5 agreed)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-white">audit_page</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400 font-bold">Accepted by validators (3/5 agreed)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-white">add_maintainer_note</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400 font-bold">Accepted by validators (4/5 agreed)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-white">retire_page</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400">0 GEN</td>
                <td className="px-4 py-2 text-emerald-400 font-bold">Accepted by validators (4/5 agreed)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-zinc-400 italic">
          *Note: Studionet Preview behavior may change. An account with 0 GEN balance broadcasts writes without balance deduction.
        </p>
      </section>
    </div>
  );
};
