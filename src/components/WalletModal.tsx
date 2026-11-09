import React, { useEffect, useRef } from "react";
import { ModalPortal } from "./ModalPortal";
import { modalManager } from "../lib/modalManager";
import { useWallet } from "../context/WalletContext";
import { WALLET_DISCLAIMER } from "../config/chain";
import { X, Key, RefreshCw, Copy, Check, AlertTriangle, ShieldCheck } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const modalId = "wallet-modal";
  const { address, privateKey, balance, refreshBalance, resetWallet, importKey } = useWallet();
  const [importInput, setImportInput] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showKey, setShowKey] = React.useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!importInput.trim()) {
      setError("Please enter a private key.");
      return;
    }
    const success = importKey(importInput.trim());
    if (success) {
      setImportInput("");
      setShowKey(false);
    } else {
      setError("Invalid private key format. Must be a 32-byte hex string (with or without 0x).");
    }
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[900] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        data-testid="wallet-modal-overlay"
      >
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative z-[1000] my-8 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
            <div className="flex items-center space-x-2.5">
              <Key className="w-5 h-5 text-amber-500" />
              <h2 id="wallet-modal-title" data-testid="wallet-modal-title" className="text-lg font-bold text-white">
                Account & Wallet Settings
              </h2>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              data-testid="wallet-modal-close"
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div data-testid="wallet-modal-body" className="p-5 overflow-y-auto space-y-5 text-sm">
            {/* Disclaimer pill */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200/90 text-xs leading-relaxed">
                {WALLET_DISCLAIMER}
              </p>
            </div>

            {/* Active Account Details */}
            <div className="space-y-3 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Current Address</span>
                <button
                  type="button"
                  onClick={refreshBalance}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Balance</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-xs">
                <span className="truncate text-zinc-200">{address || "No account"}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white shrink-0"
                  aria-label="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-400">Balance:</span>
                <span className="font-mono font-semibold text-white">
                  {balance === null ? "Loading..." : `${(Number(balance) / 1e18).toFixed(4)} GEN`}
                </span>
              </div>
            </div>

            {/* Faucet Link */}
            <div className="p-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Need Studionet Test Funds?</span>
                <span className="text-xs text-zinc-400">Request GEN tokens from the network faucet</span>
              </div>
              <a
                href="https://studio.genlayer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors"
              >
                Faucet Link
              </a>
            </div>

            {/* Export Private Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">Account Private Key</span>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-xs text-zinc-400 hover:text-zinc-200 underline"
                >
                  {showKey ? "Hide Key" : "Reveal Key"}
                </button>
              </div>
              {showKey && (
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs break-all text-amber-300">
                  {privateKey}
                </div>
              )}
            </div>

            {/* Import Key Form */}
            <form onSubmit={handleImport} className="space-y-2 pt-2 border-t border-zinc-800">
              <label htmlFor="import-key-input" className="text-xs font-medium text-zinc-300 block">
                Switch or Import Key (32-byte hex)
              </label>
              <div className="flex gap-2">
                <input
                  id="import-key-input"
                  type="password"
                  value={importInput}
                  onChange={(e) => setImportInput(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold rounded-lg transition-colors"
                >
                  Import
                </button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </form>

            {/* Generate Fresh Key Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={resetWallet}
                className="w-full py-2 bg-zinc-800/80 hover:bg-red-950/40 hover:text-red-300 border border-zinc-700 hover:border-red-900/50 rounded-xl text-xs font-medium text-zinc-300 transition-colors"
              >
                Generate Fresh Throwaway Account
              </button>
            </div>
          </div>

          {/* Footer */}
          <div data-testid="wallet-modal-footer" className="p-4 border-t border-zinc-800 bg-zinc-950/60 shrink-0 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              data-testid="wallet-modal-footer-close"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
