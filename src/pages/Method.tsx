import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, BookOpen, Layers, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const Method: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Audit Methodology & Scoring Architecture
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          An honest, transparent breakdown of what AltCheck evaluates, what it intentionally excludes, and how consensus is reached.
        </p>
      </div>

      {/* Honest Scope Callout */}
      <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
        <div className="flex items-center space-x-2.5 text-amber-500 font-bold text-base">
          <ShieldAlert className="w-5 h-5" />
          <h2>Honest Scope: Raw Server-Delivered HTML Only</h2>
        </div>
        <div className="text-xs text-zinc-300 space-y-2 leading-relaxed">
          <p>
            AltCheck evaluates only the raw server-rendered HTML payload delivered by the HTTP server. It is engineered with specific, transparent boundaries:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li><strong>No JavaScript Engine:</strong> AltCheck does not execute client JavaScript bundles (V8, SpiderMonkey).</li>
            <li><strong>No CSS Layout Engine:</strong> It does not parse stylesheets, compute cascading styles, or calculate visual color contrast ratios.</li>
            <li><strong>No Pixel Sight:</strong> The contract cannot see or process image pixel data. Image alt attributes are evaluated purely for text descriptive clarity out of context.</li>
            <li><strong>No Screen Reader Hardware:</strong> AltCheck does not physically simulate assistive technology screen readers or test keyboard navigation.</li>
            <li><strong>Automated Signal Only:</strong> The audited rule set is a deterministic subset of WCAG criteria and does not constitute a formal legal compliance certificate.</li>
          </ul>
        </div>
      </section>

      {/* Audit Modes */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Audit Execution Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono text-xs font-bold">
              FULL AUDIT
            </span>
            <h3 className="text-sm font-bold text-white">Complete Document Audit</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard mode for pages within 300 KB and 3,000 DOM elements. Evaluates all deterministic rules R1-R12 and the bounded model layer. Grades range from A to F.
            </p>
          </div>

          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
              PARTIAL AUDIT
            </span>
            <h3 className="text-sm font-bold text-white">Boundary Guard Audit</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Triggered when body exceeds 300,000 bytes or DOM exceeds 3,000 elements. Grade is strictly capped at B. Rules requiring full-document scope (R5, R8, R11) are marked &quot;unverified (partial)&quot;.
            </p>
          </div>

          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-xs font-bold">
              SHELL_ONLY
            </span>
            <h3 className="text-sm font-bold text-white">Client SPA Shell Detected</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Triggered when visible text is under 200 characters and client script bundles are present. Score is -1, Grade is &quot;N/A&quot;, and body rules are honestly bypassed without inventing false scores.
            </p>
          </div>
        </div>
      </section>

      {/* Rules Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">The Deterministic Rules Subset (R1 to R12)</h2>
        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
          <table className="min-w-full divide-y divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">Rule</th>
                <th scope="col" className="px-4 py-3">Criterion</th>
                <th scope="col" className="px-4 py-3">WCAG Reference</th>
                <th scope="col" className="px-4 py-3">Weight / Cap</th>
                <th scope="col" className="px-4 py-3">Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-sans">
              {[
                { id: "R1", name: "Image Alt Text (Missing/Empty)", wcag: "1.1.1 Non-text Content", weight: "5 pts / finding", cap: "Cap: 25", scope: "Element" },
                { id: "R2", name: "Uninformative Alt Filename/Placeholder", wcag: "1.1.1 Non-text Content", weight: "3 pts / finding", cap: "Cap: 15", scope: "Element" },
                { id: "R3", name: "Form Inputs Missing Accessible Name", wcag: "1.3.1 Info & Relationships", weight: "5 pts / finding", cap: "Cap: 25", scope: "Element" },
                { id: "R4", name: "Buttons Missing Accessible Name", wcag: "4.1.2 Name, Role, Value", weight: "4 pts / finding", cap: "Cap: 20", scope: "Element" },
                { id: "R5", name: "Skipped Heading Levels", wcag: "1.3.1 Info & Relationships", weight: "3 pts / finding", cap: "Cap: 12", scope: "Whole-Document" },
                { id: "R6", name: "Missing or Empty <html lang>", wcag: "3.1.1 Language of Page", weight: "8 pts", cap: "Cap: 8", scope: "Document Head" },
                { id: "R7", name: "Missing or Empty <title>", wcag: "2.4.2 Page Titled", weight: "8 pts", cap: "Cap: 8", scope: "Document Head" },
                { id: "R8", name: "Duplicate Element IDs", wcag: "4.1.1 Parsing", weight: "2 pts / duplicate", cap: "Cap: 10", scope: "Whole-Document" },
                { id: "R9", name: "Viewport Disables User Zooming", wcag: "1.4.4 Resize Text", weight: "10 pts", cap: "Cap: 10", scope: "Document Head" },
                { id: "R10", name: "Empty or Broken Link Text", wcag: "2.4.4 Link Purpose", weight: "4 pts / link", cap: "Cap: 20", scope: "Element" },
                { id: "R11", name: "Missing <main> Landmark", wcag: "1.3.1 Info & Relationships", weight: "5 pts", cap: "Cap: 5", scope: "Whole-Document" },
                { id: "R12", name: "Meta Refresh / Auto-Redirect", wcag: "2.2.1 Timing Adjustable", weight: "10 pts", cap: "Cap: 10", scope: "Document Head" },
              ].map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/20">
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{r.name}</td>
                  <td className="px-4 py-3 text-zinc-400 font-mono text-[11px]">{r.wcag}</td>
                  <td className="px-4 py-3 font-mono text-zinc-300 text-[11px]">{r.weight} ({r.cap})</td>
                  <td className="px-4 py-3 font-mono text-zinc-400 text-[11px]">{r.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Model Ambiguity Penalty */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Bounded Model Layer Consensus</h2>
        <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3 text-xs leading-relaxed text-zinc-300">
          <p>
            Subjective clarity of image alts and link labels is evaluated using multi-validator language model consensus. To preserve determinism:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Samples are limited to at most 8 alts and 8 links that passed deterministic checks.</li>
            <li>The model returns a strict closed enum: <code className="text-emerald-400 font-mono">CLEAR</code> or <code className="text-amber-400 font-mono">VAGUE</code>.</li>
            <li>Each vague description deducts 2 points: <code className="text-zinc-200 font-mono">min(10, 2 * vague_count)</code>.</li>
            <li>The total penalty is hard-capped at 10 points. Prompts cannot turn a failing document into a passing one or override deterministic deductions.</li>
          </ul>
        </div>
      </section>

      {/* Grade Thresholds */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Grade Thresholds & Arithmetic</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center text-xs">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-2xl font-black text-emerald-400 block">A</span>
            <span className="text-zinc-400 text-[11px]">90 - 100</span>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-2xl font-black text-blue-400 block">B</span>
            <span className="text-zinc-400 text-[11px]">80 - 89</span>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-2xl font-black text-amber-400 block">C</span>
            <span className="text-zinc-400 text-[11px]">65 - 79</span>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-2xl font-black text-orange-400 block">D</span>
            <span className="text-zinc-400 text-[11px]">50 - 64</span>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-2xl font-black text-rose-500 block">F</span>
            <span className="text-zinc-400 text-[11px]">0 - 49</span>
          </div>
        </div>
      </section>
    </div>
  );
};
