# AltCheck Desk - Release Artifacts

This document records the official release artifacts for **AltCheck Desk v1.0.1**.

## Release Archive Details

- **Release Tag**: `v1.0.1`
- **Archive Filename**: `alt-check-desk-artifacts.zip`
- **Download URL**: https://github.com/hypercybers99/alt-check-app-genlayer/releases/download/v1.0.1/alt-check-desk-artifacts.zip
- **SHA-256 Checksum**: `4257f26c9d2666a6b6ce25f6913745d30c8404f202f019bb8cdfa9e4fdf50123`
- **Size**: 1,939,784 bytes (~1.85 MB)

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
3. **On-Chain Evidence (`docs/e2e_production_evidence.json`)**:
   - Full 13-transaction lifecycle run recorded on GenLayer Studionet (Preview)
   - Validated transactions: registration, full audit, cooldown revert, non-registrant note revert, maintainer note append, public page audit, non-registrant retire revert, registrant retire, duplicate revert, non-HTTPS revert, userinfo revert.
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
