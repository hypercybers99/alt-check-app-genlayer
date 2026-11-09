# AltCheck Desk - Release Artifacts

This document records the release artifacts for **AltCheck Desk v1.0.3**.

## Release Archive Details

- **Release Tag**: `v1.0.3`
- **Archive Filename**: `alt-check-desk-artifacts.zip`
- **Download URL**: https://github.com/hypercybers99/alt-check-app-genlayer/releases/download/v1.0.3/alt-check-desk-artifacts.zip
- **SHA-256 Checksum**: `76fc2c653e369201cc110504bce7b4afd389c65f19bc6fe16f7eb8182a63d293`
- **Size**: 1,949,245 bytes (~1.86 MB)

## Archive Contents

1. **Curated Responsive Screenshots (`docs/screenshots/`)**:
   - `home-desktop.png` (1440px) & `home-390px.png` (390px)
   - `board-desktop.png` (1440px) & `board-390px.png` (390px)
   - `register-desktop.png` (1440px) & `register-390px.png` (390px)
   - `page-detail-desktop.png` (1440px) & `page-detail-390px.png` (390px)
   - `method-desktop.png` (1440px) & `method-390px.png` (390px)
   - `evidence-desktop.png` (1440px) & `evidence-390px.png` (390px)
   - `wallet-desktop.png` (1440px) & `wallet-390px.png` (390px)
   - `modal-wallet-desktop.png` (1440px) & `modal-wallet-390px.png` (390px)
2. **Brand Identity Assets (`docs/logo/`)**:
   - `logo.svg` (Dark slate shield with amber eye emblem)
   - `logo-transparent.svg` (Transparent background vector)
   - `logo-1024.png` (1024x1024 high-resolution raster master)
3. **On-Chain Evidence (`docs/e2e_production_evidence.json`, `docs/evidence_verification.json`, `docs/live_fixture_audit.json`)**:
   - `e2e_production_evidence.json`: Full 13-transaction lifecycle run recorded on GenLayer Studionet (Preview).
   - `evidence_verification.json`: On-chain RPC verification of all 39 transactions referenced across the application, with raw method names, transaction receipts, validator consensus votes, and execution outcomes.
   - `live_fixture_audit.json`: Live on-chain audit run of fixture `fresh.html` with a 0 GEN account, demonstrating consensus agreement (3/5), 0 wei balance deducted, and audit persistence.
4. **Pinned Contract Reference (`contracts-reference/AltCheck.py`)**:
   - Pinned reference contract AltCheck v1.0.1
   - Canonical SHA-256: `9af349d914c6c0e44199a00b0bc4c219a27fc6a9836b3b3a70574c23e4cdc262`

## Verification Instructions

```bash
# Verify the archive checksum on Linux / macOS
sha256sum alt-check-desk-artifacts.zip

# Verify on Windows PowerShell
Get-FileHash -Algorithm SHA256 alt-check-desk-artifacts.zip
```
