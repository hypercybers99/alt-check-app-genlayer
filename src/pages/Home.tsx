import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBoard, BoardData, fetchContractMeta, ContractMeta } from "../services/contractService";
import { SkeletonLoader } from "../components/SkeletonLoader";
import {
  ShieldCheck,
  FileCheck2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Layers,
} from "lucide-react";

export const Home: React.FC = () => {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [meta, setMeta] = useState<ContractMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchBoard(5), fetchContractMeta()])
      .then(([b, m]) => {
        if (mounted) {
          setBoard(b);
          setMeta(m);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(String(err));
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 py-10">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Multi-Validator Accessibility Ledger</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Web Accessibility <br />
          <span className="text-amber-500">Audited by Validator Consensus</span>
        </h1>

        <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          AltCheck fetches raw server-delivered HTML, computes deterministic WCAG rules in code, validates qualitative image alt and link descriptions via language model consensus, and records score improvement on-chain.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/p/55d0e52560ab"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <span>See a Real Audit Record</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-semibold rounded-xl text-sm transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Register a Web Page
          </Link>
        </div>

        {/* Honest Signal Disclaimer Box */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-left text-xs text-zinc-400 max-w-2xl mx-auto flex items-start space-x-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-zinc-200">Honest Automated Signal:</strong> AltCheck analyzes server-rendered markup only. It is an automated accessibility signal, never a certificate that a page is accessible. Single-page apps returning empty shells are flagged honestly as <span className="text-amber-400 font-mono">SHELL_ONLY</span>.
          </p>
        </div>
      </section>

      {/* 3 Short Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-bold text-white">How AltCheck Operates in 3 Steps</h2>
          <p className="text-sm text-zinc-400">Pure deterministic execution paired with bounded qualitative consensus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Raw HTML Web Fetch</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Consensus validator nodes independently fetch the target URL over HTTPS, enforce strict host/IP policies, inspect the body up to 300 KB / 3,000 DOM elements, and detect SPA shells.
            </p>
          </div>

          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Deterministic Rules (R1 - R12)</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Rules evaluate missing alts, unlabeled form controls, broken heading hierarchies, empty links, and zoom lockdowns. Verbatim HTML snippets are stored for all findings.
            </p>
          </div>

          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Bounded Model Consensus</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Language models evaluate descriptive clarity for up to 8 alts and 8 links out of context. Penalty is capped at 10 points. Validators compare closed-count equality.
            </p>
          </div>
        </div>
      </section>

      {/* Featured On-Chain Demo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/50">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>On-Chain Clean Fixture Demo (Score 100 / Grade A)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Accessible Page Demonstration: Grade A (100)
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Page <code className="text-amber-400 font-mono bg-zinc-800 px-1 py-0.5 rounded">173a4e08d12d</code> on the working host (<span className="font-mono text-xs text-zinc-400">https://hypercybers99.github.io/alt-check-fixtures/good.html</span>) demonstrates multi-validator consensus evaluation: 0 violations across rules R1-R12, full element traversal, and descriptive clarity accepted by validators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center w-36">
              <span className="text-xs text-zinc-400 block font-mono">Consensus</span>
              <span className="text-2xl font-black text-amber-400">3/5 Agree</span>
            </div>
            <div className="text-amber-400 font-mono font-bold text-lg">&rarr;</div>
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center w-36">
              <span className="text-xs text-zinc-400 block font-mono">Score</span>
              <span className="text-3xl font-black text-emerald-400">100 (A)</span>
            </div>
            <Link
              to="/p/173a4e08d12d"
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-colors"
            >
              Inspect Details
            </Link>
          </div>
        </div>
      </section>

      {/* Mini Board Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Top Audited Pages</h2>
            <p className="text-xs text-zinc-400">Ranked by audit score with full audits prioritized over partial audits</p>
          </div>
          <Link
            to="/board"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
          >
            <span>View Full Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : error ? (
          <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl text-xs text-rose-300">
            Failed to load on-chain board: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(board?.best_pages || []).slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/p/${item.id}`}
                className="p-5 bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all block space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-zinc-400">ID: {item.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      item.grade === "A"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                        : item.grade === "B"
                        ? "bg-blue-950/60 text-blue-400 border border-blue-800/60"
                        : "bg-rose-950/60 text-rose-400 border border-rose-800/60"
                    }`}
                  >
                    Grade {item.grade} ({item.score})
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm truncate">{item.label}</h3>
                <p className="font-mono text-xs text-zinc-400 truncate">{item.url}</p>
                {item.partial && (
                  <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] rounded border border-amber-500/20 font-mono">
                    PARTIAL AUDIT
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
