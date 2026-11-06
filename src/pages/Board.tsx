import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBoard, BoardData } from "../services/contractService";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { Award, TrendingUp, AlertCircle, RefreshCw, Layers } from "lucide-react";

export const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"best" | "improved">("best");

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchBoard(30)
      .then((data) => {
        setBoard(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderBadge = (grade: string, score: number) => {
    if (grade === "N/A" || score === -1) {
      return (
        <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 font-mono text-xs border border-zinc-700">
          SHELL_ONLY (N/A)
        </span>
      );
    }
    const colorClass =
      grade === "A"
        ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
        : grade === "B"
        ? "bg-blue-950/60 text-blue-400 border-blue-800/60"
        : grade === "C"
        ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
        : "bg-rose-950/60 text-rose-400 border-rose-800/60";

    return (
      <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold border ${colorClass}`}>
        Grade {grade} &bull; {score}/100
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Verified Accessibility Board
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Autonomous consensus rankings computed entirely on-chain by GenLayer Studionet validator nodes.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs text-zinc-300 hover:text-white hover:bg-zinc-750 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-zinc-800" role="tablist" aria-label="Board categories">
        <button
          type="button"
          role="tab"
          id="tab-best"
          aria-controls="panel-best"
          aria-selected={activeTab === "best"}
          onClick={() => setActiveTab("best")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "best"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Best Latest Scores</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-improved"
          aria-controls="panel-improved"
          aria-selected={activeTab === "improved"}
          onClick={() => setActiveTab("improved")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "improved"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Most Improved Pages (Delta)</span>
        </button>
      </div>

      {/* Board Ordering Explanation Notice */}
      <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-start space-x-2.5">
        <Layers className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-zinc-300">Board Tie-Breaking Order:</strong> As enforced by the intelligent contract, full audits strictly rank above partial audits (<code className="text-amber-400">partial: true</code>) whenever scores are equal. Partial audits analyzed up to the 300 KB / 3,000 element boundary and have their grade capped at B.
        </p>
      </div>

      <div id={activeTab === "best" ? "panel-best" : "panel-improved"} role="tabpanel" aria-labelledby={activeTab === "best" ? "tab-best" : "tab-improved"}>
      {loading ? (
        <SkeletonLoader count={5} />
      ) : error ? (
        <div className="p-6 bg-rose-950/20 border border-rose-900/40 rounded-2xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="text-sm font-bold text-white">RPC Network Call Failed</h2>
          <p className="text-xs text-zinc-400">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-white"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/50">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider font-mono text-[11px]">
              <tr>
                <th scope="col" className="px-6 py-3.5 font-semibold">Rank</th>
                <th scope="col" className="px-6 py-3.5 font-semibold">Page / Label</th>
                <th scope="col" className="px-6 py-3.5 font-semibold">URL</th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  {activeTab === "best" ? "Latest Grade & Score" : "Progress Delta"}
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">Audit Mode</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-sans">
              {(activeTab === "best" ? board?.best_pages || [] : board?.most_improved || []).map(
                (item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-zinc-300">#{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{item.label}</div>
                      <div className="font-mono text-zinc-400 text-[11px]">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-mono text-zinc-400 text-xs">
                      {item.url}
                    </td>
                    <td className="px-6 py-4">
                      {activeTab === "best" ? (
                        renderBadge(item.grade, item.score)
                      ) : (
                        <div className="flex items-center space-x-2 font-mono">
                          <span className="text-emerald-400 font-bold text-sm">
                            +{item.delta || 0} pts
                          </span>
                          <span className="text-zinc-400 text-xs">
                            (Grade {item.grade})
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.partial ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px]">
                          PARTIAL AUDIT
                        </span>
                      ) : item.mode === "SHELL_ONLY" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-[10px]">
                          SHELL_ONLY
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-emerald-400 font-mono text-[10px]">
                          FULL AUDIT
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/p/${item.id}`}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 font-semibold rounded-lg text-xs transition-colors inline-block"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};
