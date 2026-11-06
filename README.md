# AltCheck Desk

> Multi-validator consensus accessibility ledger interface on **GenLayer Studionet (Preview)**.

[![Production Deployment](https://img.shields.io/badge/Vercel-Live_Production-emerald.svg)](https://alt-check-app-genlayer.vercel.app)
[![Contract](https://img.shields.io/badge/Contract-0x1292C9...dd30-amber.svg)](https://explorer-studio.genlayer.com/address/0x1292C9bf74C2ef2789184Ec9808379d46279dd30)
[![Network](https://img.shields.io/badge/Network-GenLayer_Studionet_(Preview)-blue.svg)](https://studio.genlayer.com)
[![Tests](https://img.shields.io/badge/Tests-61_passed-brightgreen.svg)]()
[![Playwright E2E](https://img.shields.io/badge/Playwright-36_passed-brightgreen.svg)]()

AltCheck Desk is the official web dApp for **AltCheck**, an intelligent accessibility ledger deployed on **GenLayer Studionet (Preview)**. Multiple independent consensus validators independently fetch server-delivered HTML, parse document structure, execute deterministic accessibility rules (R1–R12), sample ambiguous image alt text and link text for non-deterministic LLM grading, and commit verifiable accessibility progress on-chain.

---

## 1. Network & Intelligent Contract

- **Network**: GenLayer Studionet (Preview)
- **Chain ID**: `61999`
- **RPC Endpoint**: `https://studio.genlayer.com/api`
- **Block Explorer**: `https://explorer-studio.genlayer.com`
- **Active Contract**: [`0x1292C9bf74C2ef2789184Ec9808379d46279dd30`](https://explorer-studio.genlayer.com/address/0x1292C9bf74C2ef2789184Ec9808379d46279dd30)
- **Deploy Transaction**: [`0xd171df04a4a959e77f17c8b5c8109d29419baaa273c0df0d58736dbbfbc56cd4`](https://explorer-studio.genlayer.com/tx/0xd171df04a4a959e77f17c8b5c8109d29419baaa273c0df0d58736dbbfbc56cd4)
- **Reference Source Hash (SHA-256)**: `9af349d914c6c0e44199a00b0bc4c219a27fc6a9836b3b3a70574c23e4cdc262`

### Deployment History (Superseded)

| Version | Contract Address | Status | Notes |
| :--- | :--- | :--- | :--- |
| **v1.0.1** (Active) | `0x1292C9bf74C2ef2789184Ec9808379d46279dd30` | Active | Element-cap reporting (`elements_seen`/`analyzed`), partial audit flag, grade capped at B, unverified rules tracking |
| **v1.0.0** (Superseded) | `0xBA2D886E76b87feD8dCd5be61fccFA2A4e1D388A` | Superseded | Initial Studionet release (silent 1000 element drop on large pages) |
| **Diagnostic Probe** (Superseded) | `0xC40bf93bA9c3f1cf9A1088087C4c7156E538FB95` | Superseded | Diagnostic contract for non-HTML MIME validator consensus behavior |

---

## 2. Production Deployment

- **Live URL**: [https://alt-check-app-genlayer.vercel.app](https://alt-check-app-genlayer.vercel.app)
- **Deployment Platform**: Vercel (Production)
- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS + GenLayer JS SDK

---

## 3. Honest Automated Signal Scope

AltCheck Desk is an **automated accessibility signal**, not an official legal compliance certificate.
- Audits examine server-delivered HTML up to 300 KB or 3,000 DOM elements.
- Documents cut at the limit are flagged `partial: true` with grades capped at B. Whole-document rules (R5 heading order, R8 duplicate IDs, R11 main landmark) are marked `unverified (partial)`.
- Client-side single page applications (SPAs) serving empty containers are classified honestly as `SHELL_ONLY`.
- AltCheck does not execute client JavaScript, calculate runtime color contrast, or simulate screen readers.

---

## 4. Key dApp Features & Routes

- **Landing (`/`)**: 3-step audit overview, real on-chain stats, direct link to audit inspection.
- **Ledger Board (`/board`)**: Best Scores and Most Improved pages tabs. Full audits strictly rank above partial audits on score ties.
- **Register (`/register`)**: Page onboarding with client-side URL policy mirroring contract rules (HTTPS only, valid IPv4/FQDN, forbidden localhost/private IP/userinfo/ports).
- **Page Detail (`/p/:id`)**: Comprehensive audit breakdown, rule-by-rule checklist (R1–R12), unverified indicators, delta progression, and maintainer notes ledger.
- **Methodology (`/method`)**: Transparent documentation of deterministic rules, LLM penalty scoring, and grade thresholds.
- **Evidence (`/evidence`)**: Empirical validator agreement scenarios (3/5 consensus), 15 of 15 consensus reverts table, and unit-tested boundary tests.
- **Wallet & Test Funds (`/wallet`)**: In-app throwaway key management, balance refresh, faucet link, and 0-balance measurement table.

---

## 5. Verification & Testing

### Unit Test Suite
```bash
# Run Vitest unit tests (61 tests across 11 suites)
npm run test
```

### Automated Code Quality Scanners
```bash
# Clean ASCII scan
npm run scan:ascii

# Terminology conformance check
npm run scan:banned

# Secrets scan
npm run scan:secrets

# Dialog check (zero alert, confirm, prompt)
npm run scan:dialogs

# Contract address consistency
npm run check:address

# Canonical contract source match (SHA-256)
npm run check:reference

# Bundle integrity check
npm run verify:bundle

# Complete check suite
npm run check
```

### End-to-End & Accessibility Tests
```bash
# Run Playwright E2E and axe-core accessibility tests (36 tests)
npm run test:e2e
```

---

## 6. Release Artifacts

Official bulk release archive containing curated screenshots, brand identity vectors, and raw transaction logs:
- **Archive**: `alt-check-desk-artifacts.zip`
- **Release Tag**: `v1.0.2`
- **Download**: [alt-check-desk-artifacts.zip](https://github.com/hypercybers99/alt-check-app-genlayer/releases/download/v1.0.2/alt-check-desk-artifacts.zip)
- **SHA-256**: `452672ec57fdae989ade6763a1d4cec9c93c6eec1a77f56731fd8520c31a6e5a`
- Full inventory documented in [docs/ARTIFACTS.md](docs/ARTIFACTS.md).

---

## License

Open source under the [MIT License](LICENSE).
