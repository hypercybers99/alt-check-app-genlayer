import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { NETWORK_CONFIG } from "../config/chain";
import { Menu, X, Wallet as WalletIcon, ExternalLink } from "lucide-react";

interface HeaderProps {
  onOpenWallet: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenWallet }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { address, balance } = useWallet();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/board", label: "Ledger Board" },
    { to: "/register", label: "Register Page" },
    { to: "/method", label: "Methodology" },
    { to: "/evidence", label: "Evidence" },
    { to: "/wallet", label: "Wallet & Funds" },
  ];

  const formatAddr = (addr: string | null) => {
    if (!addr) return "Connect Wallet";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-[200]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-zinc-950 focus:font-bold focus:rounded"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1">
              <img src="/logo.svg" alt="AltCheck Logo" className="w-9 h-9" />
              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-tight">
                  AltCheck<span className="text-amber-500">.</span>Desk
                </span>
                <span className="text-[10px] tracking-wider uppercase text-zinc-400 block leading-none font-mono">
                  Consensus Accessibility
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-amber-400"
                      : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <button
              type="button"
              onClick={onOpenWallet}
              data-testid="open-wallet-modal"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-750 text-xs font-mono text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <WalletIcon className="w-4 h-4 text-amber-500" />
              <span>{formatAddr(address)}</span>
              {balance !== null && (
                <span className="text-zinc-400 border-l border-zinc-700 pl-2">
                  {balance === 0n ? "0 GEN" : `${(Number(balance) / 1e18).toFixed(3)} GEN`}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              data-testid="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-zinc-800 text-amber-400"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWallet();
              }}
              data-testid="open-wallet-modal-mobile"
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-mono text-zinc-200"
            >
              <WalletIcon className="w-4 h-4 text-amber-500" />
              <span>{formatAddr(address)}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
