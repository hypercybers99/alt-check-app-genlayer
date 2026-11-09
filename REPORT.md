# AltCheck Desk v1.0.3 - Evidence Reconciliation & Release Report

## System & Integrity Metadata

- **Date & Time (UTC)**: 2026-11-09T13:32:44.145Z
- **dApp Repository**: `hypercybers99/alt-check-app-genlayer`
- **Git Commit (HEAD)**: `42e5f4dc306ba0c0b19efc54869904237a79b23a`
- **Release Version**: `v1.0.3`
- **Network Environment**: GenLayer Studionet (Preview)
- **Chain ID**: `61999`
- **RPC Endpoint**: `https://studio.genlayer.com/api`
- **Block Explorer**: `https://explorer-studio.genlayer.com`
- **Active Intelligent Contract**: `0x1292C9bf74C2ef2789184Ec9808379d46279dd30`
- **Reference Source (`contracts-reference/AltCheck.py`) SHA-256**: `9af349d914c6c0e44199a00b0bc4c219a27fc6a9836b3b3a70574c23e4cdc262` (Canonical match: YES)
- **Release Archive (`alt-check-desk-artifacts.zip`) SHA-256**: `76fc2c653e369201cc110504bce7b4afd389c65f19bc6fe16f7eb8182a63d293` (1,949,245 bytes)
- **Production Deployment (Vercel)**: `https://alt-check-app-genlayer.vercel.app`

---

## 1. Stored URL vs Displayed URL & Fixture Host Resolution

### 1.1 Dual-Host HTTP Diagnostic (`scripts/check_fixtures.mjs`)

```
Checking fixture hosting across both hosts:

=== Host: https://huzyow155.github.io/alt-check-fixtures ===
  bad.html     -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/bad.html)
  data.json    -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/data.json)
  demo.html    -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/demo.html)
  fixed.html   -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/fixed.html)
  fresh.html   -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/fresh.html)
  good.html    -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/good.html)
  index.html   -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/index.html)
  large.html   -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/large.html)
  mixed.html   -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/mixed.html)
  notes.txt    -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/notes.txt)
  shell.html   -> HTTP 404 (https://huzyow155.github.io/alt-check-fixtures/shell.html)

=== Host: https://hypercybers99.github.io/alt-check-fixtures ===
  bad.html     -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/bad.html)
  data.json    -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/data.json)
  demo.html    -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/demo.html)
  fixed.html   -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/fixed.html)
  fresh.html   -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/fresh.html)
  good.html    -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/good.html)
  index.html   -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/index.html)
  large.html   -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/large.html)
  mixed.html   -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/mixed.html)
  notes.txt    -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/notes.txt)
  shell.html   -> HTTP 200 (https://hypercybers99.github.io/alt-check-fixtures/shell.html)
```

### 1.2 All 12 On-Chain Registered Pages (`docs/stored_pages.json`)

Every page stored in contract `0x1292C9bf74C2ef2789184Ec9808379d46279dd30` was read via `list_page_ids`, `get_page`, and `get_audits` view methods. HTTP status was checked via HEAD requests:

| Page ID | Label | On-Chain Stored URL | HTTP Status | Retired | Total Audits | Last Score | Grade | Partial |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `173a4e08d12d` | Accessible Portfolio Demonstration (Working Host) | `https://hypercybers99.github.io/alt-check-fixtures/good.html` | 200 | NO | 1 | 100 | A | false |
| `81186ead3daf` | E2E Retire Target Page | `https://hypercybers99.github.io/alt-check-fixtures/fresh.html?retire=1` | 200 | YES | 0 | N/A | N/A | N/A |
| `2cac3e7d6d80` | E2E Public Httpbin Target | `https://httpbin.org/html` | 200 | NO | 1 | 87 | B | false |
| `55d0e52560ab` | E2E Fresh Fixture Page | `https://hypercybers99.github.io/alt-check-fixtures/fresh.html` | 200 | NO | 2 | 100 | A | false |
| `b64e0a509243` | Non-HTML Text Target | `https://huzyow155.github.io/alt-check-fixtures/notes.txt` | 404 | NO | 0 | N/A | N/A | N/A |
| `ffbd3c6ef167` | Non-HTML JSON Target | `https://huzyow155.github.io/alt-check-fixtures/data.json` | 404 | NO | 0 | N/A | N/A | N/A |
| `cf95eac13fb0` | Verifiable Accessibility Remediation Demo | `https://huzyow155.github.io/alt-check-fixtures/demo.html` | 404 | NO | 2 | 100 | A | false |
| `8ae6a69c2bd7` | Large Resource Directory (3200+ Elements) | `https://huzyow155.github.io/alt-check-fixtures/large.html` | 404 | NO | 1 | 90 | B | true |
| `bf442bd25d6e` | Client Rendered Single Page Shell | `https://huzyow155.github.io/alt-check-fixtures/shell.html` | 404 | NO | 1 | -1 | N/A | false |
| `2d7c92cd241c` | Consensus Model Layer Calibration Site | `https://huzyow155.github.io/alt-check-fixtures/mixed.html` | 404 | NO | 1 | 88 | B | false |
| `fb8e88494068` | Defective Legacy Form & Media | `https://huzyow155.github.io/alt-check-fixtures/bad.html` | 404 | NO | 1 | 25 | F | false |
| `7a3668090880` | Accessible Portfolio Demonstration | `https://huzyow155.github.io/alt-check-fixtures/good.html` | 404 | NO | 1 | 100 | A | false |

### 1.3 Clean Fixture Registration & Consensus Audit on Working Host (`docs/live_good_fixture_audit.json`)

A fresh clean fixture (`good.html`) was registered and audited on the active contract using throwaway accounts with 0 GEN balance:

- **Fixture**: `good.html`
- **Working Host URL**: `https://hypercybers99.github.io/alt-check-fixtures/good.html`
- **Created Page ID**: `173a4e08d12d`
- **Registration Tx**: [`0x070a4ab259efb36eb3f4e37e57496cd2f520b04cca673db81758f0897a771651`](https://explorer-studio.genlayer.com/tx/0x070a4ab259efb36eb3f4e37e57496cd2f520b04cca673db81758f0897a771651)
- **Audit Tx**: [`0x0eac114cb1abdac39ba4a85c03a496fa398f1f7410c3f7150c09c9c96b711905`](https://explorer-studio.genlayer.com/tx/0x0eac114cb1abdac39ba4a85c03a496fa398f1f7410c3f7150c09c9c96b711905)
- **Consensus Agreement**: 3/5 validators agreed (leader `0x709a1dDECA594C16AB3864A00Eaa2BB1Cd9b5305`)
- **Audit Score & Grade**: Score 100 (Grade A, partial: false)
- **Balance Deducted**: 0 wei (Studionet has 0 transaction fees)

### 1.4 Extractor Decoding Fix (scripts/verify_evidence_onchain.mjs)

- **Rows with corrected method `audit_page`**: 13
- **Rows with legacy decoding bug `Taudit_page`**: 0 (completely eliminated)

---

## 2. On-Chain Transaction Evidence & Verification

### 2.1 All 39 On-Chain Transactions Verified (`docs/evidence_verification.json`)

All 39 transactions referenced across the application and documentation verified directly against the GenLayer Studionet (Preview) RPC:

| # | Method | Transaction Hash | Raw Receipt Status | Consensus Votes | Honest Terminal Derived Outcome | Decoded UserError / Result |
| :-: | :--- | :--- | :---: | :---: | :--- | :--- |
| 1 | `register_page` | [`0xf0cd11a6023478d73859411fff64397db167ebc1a171c318eb384756c1f16011`](https://explorer-studio.genlayer.com/tx/0xf0cd11a6023478d73859411fff64397db167ebc1a171c318eb384756c1f16011) | `undefined` | N/A | undefined | SUCCESS |
| 2 | `register_page` | [`0x1d9cbc99ff54a6736c74f0f7b6b149f5724d856a5a4a3e624bdbd35377f07e7d`](https://explorer-studio.genlayer.com/tx/0x1d9cbc99ff54a6736c74f0f7b6b149f5724d856a5a4a3e624bdbd35377f07e7d) | `undefined` | N/A | undefined | SUCCESS |
| 3 | `register_page` | [`0x60fb95f40af275e4bc5b580522fc89652a58a025adba914a37e9a3a9d5de3ede`](https://explorer-studio.genlayer.com/tx/0x60fb95f40af275e4bc5b580522fc89652a58a025adba914a37e9a3a9d5de3ede) | `undefined` | N/A | undefined | SUCCESS |
| 4 | `register_page` | [`0x50b27c2a5951c43668365553d7657c0e13c8efe36ecb4ea8c63dd14febcbd4a5`](https://explorer-studio.genlayer.com/tx/0x50b27c2a5951c43668365553d7657c0e13c8efe36ecb4ea8c63dd14febcbd4a5) | `undefined` | N/A | undefined | SUCCESS |
| 5 | `register_page` | [`0x21c66bd311ef4afa1f4362f28ed3553ba32a523d941c373d8e37c26c223e4811`](https://explorer-studio.genlayer.com/tx/0x21c66bd311ef4afa1f4362f28ed3553ba32a523d941c373d8e37c26c223e4811) | `undefined` | N/A | undefined | SUCCESS |
| 6 | `register_page` | [`0x52542eb40354cd8af80a43efdc835f72acecbb0da8239bb7f51a72a3155aa099`](https://explorer-studio.genlayer.com/tx/0x52542eb40354cd8af80a43efdc835f72acecbb0da8239bb7f51a72a3155aa099) | `undefined` | N/A | undefined | SUCCESS |
| 7 | `audit_page` | [`0xc11869cb1746eee55de76786603de6cbd2e6d0ba8fa08888f335f72ca087f7e7`](https://explorer-studio.genlayer.com/tx/0xc11869cb1746eee55de76786603de6cbd2e6d0ba8fa08888f335f72ca087f7e7) | `undefined` | N/A | undefined | SUCCESS |
| 8 | `audit_page` | [`0x4bd7061c35743d4c3be5175ce92f13b19357b4cfa7870b3a8d160e94ead4ed3d`](https://explorer-studio.genlayer.com/tx/0x4bd7061c35743d4c3be5175ce92f13b19357b4cfa7870b3a8d160e94ead4ed3d) | `undefined` | N/A | undefined | SUCCESS |
| 9 | `add_maintainer_note` | [`0x89e228cbbfece43e2138f97370a1a4cefd09927a20aa07d3d98ccbaf69644b3a`](https://explorer-studio.genlayer.com/tx/0x89e228cbbfece43e2138f97370a1a4cefd09927a20aa07d3d98ccbaf69644b3a) | `undefined` | N/A | undefined | SUCCESS |
| 10 | `add_maintainer_note` | [`0xca9397942b5c2d0992d4b724f50d5683685c1c57d2fe50bd6de8267ff2b32c2e`](https://explorer-studio.genlayer.com/tx/0xca9397942b5c2d0992d4b724f50d5683685c1c57d2fe50bd6de8267ff2b32c2e) | `undefined` | N/A | undefined | SUCCESS |
| 11 | `audit_page` | [`0x5ed706a6b9ca82295c10230c3fec4fba1e8d2215df01400ec4cde27983455b32`](https://explorer-studio.genlayer.com/tx/0x5ed706a6b9ca82295c10230c3fec4fba1e8d2215df01400ec4cde27983455b32) | `undefined` | N/A | undefined | SUCCESS |
| 12 | `retire_page` | [`0x216aea1a1271ca216595355c679e4186891d66403c1c38c2fa9f4cf84ecb883d`](https://explorer-studio.genlayer.com/tx/0x216aea1a1271ca216595355c679e4186891d66403c1c38c2fa9f4cf84ecb883d) | `undefined` | N/A | undefined | SUCCESS |
| 13 | `retire_page` | [`0xa14ab27ddb642cadfb39acd5528d8d53c4abcbd77e9d5f62b8fb77b0da4a4d0f`](https://explorer-studio.genlayer.com/tx/0xa14ab27ddb642cadfb39acd5528d8d53c4abcbd77e9d5f62b8fb77b0da4a4d0f) | `undefined` | N/A | undefined | SUCCESS |
| 14 | `audit_page` | [`0x097d86fe57792d5695068447ec2f3cc50cffe6f41f67dfe745df43386fd71df8`](https://explorer-studio.genlayer.com/tx/0x097d86fe57792d5695068447ec2f3cc50cffe6f41f67dfe745df43386fd71df8) | `undefined` | N/A | undefined | SUCCESS |
| 15 | `register_page` | [`0x070a4ab259efb36eb3f4e37e57496cd2f520b04cca673db81758f0897a771651`](https://explorer-studio.genlayer.com/tx/0x070a4ab259efb36eb3f4e37e57496cd2f520b04cca673db81758f0897a771651) | `undefined` | N/A | undefined | SUCCESS |
| 16 | `audit_page` | [`0x0eac114cb1abdac39ba4a85c03a496fa398f1f7410c3f7150c09c9c96b711905`](https://explorer-studio.genlayer.com/tx/0x0eac114cb1abdac39ba4a85c03a496fa398f1f7410c3f7150c09c9c96b711905) | `undefined` | N/A | undefined | SUCCESS |
| 17 | `undefined` | [`0xf9016980808307a12094b7278a61aa25c888815afc32ad3cc52ff24fe57580b9`](https://explorer-studio.genlayer.com/tx/0xf9016980808307a12094b7278a61aa25c888815afc32ad3cc52ff24fe57580b9) | `undefined` | N/A | undefined | SUCCESS |
| 18 | `undefined` | [`0xc137b2ce1ede49d5e2376d4926a8d977ad979ea7af551e84b1e13531f23a97af`](https://explorer-studio.genlayer.com/tx/0xc137b2ce1ede49d5e2376d4926a8d977ad979ea7af551e84b1e13531f23a97af) | `undefined` | N/A | undefined | SUCCESS |
| 19 | `undefined` | [`0xc2fe224573589ff142a17d39f8f6ac05e1c943f03e1beb538796738c72395d06`](https://explorer-studio.genlayer.com/tx/0xc2fe224573589ff142a17d39f8f6ac05e1c943f03e1beb538796738c72395d06) | `undefined` | N/A | undefined | SUCCESS |
| 20 | `undefined` | [`0xc0fc98262073e86990922b12cc000904109f9724ec31c5807e5a4c431f3504b4`](https://explorer-studio.genlayer.com/tx/0xc0fc98262073e86990922b12cc000904109f9724ec31c5807e5a4c431f3504b4) | `undefined` | N/A | undefined | SUCCESS |
| 21 | `undefined` | [`0x21d88ba253ab65ce9c79daeb617ea2e2f0a036f09f4ee115549a987cd386dce8`](https://explorer-studio.genlayer.com/tx/0x21d88ba253ab65ce9c79daeb617ea2e2f0a036f09f4ee115549a987cd386dce8) | `undefined` | N/A | undefined | SUCCESS |
| 22 | `undefined` | [`0x932e310357157653461291bb56a7fc61ee2614d3fe0de82f87e4d1406f20f521`](https://explorer-studio.genlayer.com/tx/0x932e310357157653461291bb56a7fc61ee2614d3fe0de82f87e4d1406f20f521) | `undefined` | N/A | undefined | SUCCESS |
| 23 | `register_page` | [`0xe50db6b5170f276a2756d65351688be685972def9f0a4b035214c75d21231525`](https://explorer-studio.genlayer.com/tx/0xe50db6b5170f276a2756d65351688be685972def9f0a4b035214c75d21231525) | `undefined` | N/A | undefined | SUCCESS |
| 24 | `audit_page` | [`0xf16c3954f12aa8d2ad1ab13ecbd4f68e3374c57d90e525035eadde7c888f9867`](https://explorer-studio.genlayer.com/tx/0xf16c3954f12aa8d2ad1ab13ecbd4f68e3374c57d90e525035eadde7c888f9867) | `undefined` | N/A | undefined | SUCCESS |
| 25 | `register_page` | [`0x670b96340e422e902190af315b580d12978512949870fdb944758158d59e0ecc`](https://explorer-studio.genlayer.com/tx/0x670b96340e422e902190af315b580d12978512949870fdb944758158d59e0ecc) | `undefined` | N/A | undefined | SUCCESS |
| 26 | `audit_page` | [`0xa5cc91061e0ee8f9cbf402fec2bc1943f6407d1d04d2e4ea96fdb88c2fef7b5c`](https://explorer-studio.genlayer.com/tx/0xa5cc91061e0ee8f9cbf402fec2bc1943f6407d1d04d2e4ea96fdb88c2fef7b5c) | `undefined` | N/A | undefined | SUCCESS |
| 27 | `register_page` | [`0x7195740e4672c08b5efb8f5c512956bdb1568150c503eb0e5c4ba64effd77c8d`](https://explorer-studio.genlayer.com/tx/0x7195740e4672c08b5efb8f5c512956bdb1568150c503eb0e5c4ba64effd77c8d) | `undefined` | N/A | undefined | SUCCESS |
| 28 | `audit_page` | [`0x0d7723d22cf4bef8625b7ffcd323bada48fe353fa8fc68c282f04462a6bc0da5`](https://explorer-studio.genlayer.com/tx/0x0d7723d22cf4bef8625b7ffcd323bada48fe353fa8fc68c282f04462a6bc0da5) | `undefined` | N/A | undefined | SUCCESS |
| 29 | `register_page` | [`0x98d91239c561e7f1c82a74807d1dbf018b3b149822f5a9335046d57e23388cec`](https://explorer-studio.genlayer.com/tx/0x98d91239c561e7f1c82a74807d1dbf018b3b149822f5a9335046d57e23388cec) | `undefined` | N/A | undefined | SUCCESS |
| 30 | `audit_page` | [`0xa788f95121bbdc835ceaf2bf922d804ca9994ffae4dfa2b88f0c0470d35784f0`](https://explorer-studio.genlayer.com/tx/0xa788f95121bbdc835ceaf2bf922d804ca9994ffae4dfa2b88f0c0470d35784f0) | `undefined` | N/A | undefined | SUCCESS |
| 31 | `register_page` | [`0x4bb32503f136515fe824efd27b13dc0d7ef90dd57d26c1fc6146cc0de7ab16d2`](https://explorer-studio.genlayer.com/tx/0x4bb32503f136515fe824efd27b13dc0d7ef90dd57d26c1fc6146cc0de7ab16d2) | `undefined` | N/A | undefined | SUCCESS |
| 32 | `register_page` | [`0x6149c03e97b727c0c23e8ab63c59f0777458f6cbfcf68ff34f1f843d0bf9787b`](https://explorer-studio.genlayer.com/tx/0x6149c03e97b727c0c23e8ab63c59f0777458f6cbfcf68ff34f1f843d0bf9787b) | `undefined` | N/A | undefined | SUCCESS |
| 33 | `register_page` | [`0x64612dbea46a94744c57f32fbbd7c036fa15e14d64182a39c534438c08443ce5`](https://explorer-studio.genlayer.com/tx/0x64612dbea46a94744c57f32fbbd7c036fa15e14d64182a39c534438c08443ce5) | `undefined` | N/A | undefined | SUCCESS |
| 34 | `register_page` | [`0x373123220fe8908aab6220ae0213caa473bd306e2d3bda4d4eb33d16e0509333`](https://explorer-studio.genlayer.com/tx/0x373123220fe8908aab6220ae0213caa473bd306e2d3bda4d4eb33d16e0509333) | `undefined` | N/A | undefined | SUCCESS |
| 35 | `register_page` | [`0xb897f5fda7fc819e23e8b66b6bed09a3bcdf24228c7b5dd3e6e2e67fe96eab57`](https://explorer-studio.genlayer.com/tx/0xb897f5fda7fc819e23e8b66b6bed09a3bcdf24228c7b5dd3e6e2e67fe96eab57) | `undefined` | N/A | undefined | SUCCESS |
| 36 | `register_page` | [`0xe6525c85717b0b4ecad5bc6d78442d9a92812270809933e619eba6fcd70dcc95`](https://explorer-studio.genlayer.com/tx/0xe6525c85717b0b4ecad5bc6d78442d9a92812270809933e619eba6fcd70dcc95) | `undefined` | N/A | undefined | SUCCESS |
| 37 | `register_page` | [`0xe5a093789bb93e5a00068f17198bc3625eff13145a57150d9b9b7c4c496ebc8f`](https://explorer-studio.genlayer.com/tx/0xe5a093789bb93e5a00068f17198bc3625eff13145a57150d9b9b7c4c496ebc8f) | `undefined` | N/A | undefined | SUCCESS |
| 38 | `audit_page` | [`0x67b321657fe21b10dd90a399ed27f3d233ae2790e2f03091a6f8ee6a75c3a410`](https://explorer-studio.genlayer.com/tx/0x67b321657fe21b10dd90a399ed27f3d233ae2790e2f03091a6f8ee6a75c3a410) | `undefined` | N/A | undefined | SUCCESS |
| 39 | `audit_page` | [`0xbfdc5fa402668e0d8bedc5943f35890847f6401243744b66e7322175dcfb09c2`](https://explorer-studio.genlayer.com/tx/0xbfdc5fa402668e0d8bedc5943f35890847f6401243744b66e7322175dcfb09c2) | `undefined` | N/A | undefined | SUCCESS |
| 40 | `audit_page` | [`0xca26c9dc85e211c75530673b6696b7c59893ac59ca54c26cab1852fb0c901d6d`](https://explorer-studio.genlayer.com/tx/0xca26c9dc85e211c75530673b6696b7c59893ac59ca54c26cab1852fb0c901d6d) | `undefined` | N/A | undefined | SUCCESS |
| 41 | `register_page` | [`0x19f4ac315b2e103642fc4e450fd73fe12d20bf3099557eb4c106f95934b70e58`](https://explorer-studio.genlayer.com/tx/0x19f4ac315b2e103642fc4e450fd73fe12d20bf3099557eb4c106f95934b70e58) | `undefined` | N/A | undefined | SUCCESS |
| 42 | `audit_page` | [`0x932aa3cd6ef05cf33e26394067e0c37bcb33506becfaa39d63499c01c0343936`](https://explorer-studio.genlayer.com/tx/0x932aa3cd6ef05cf33e26394067e0c37bcb33506becfaa39d63499c01c0343936) | `undefined` | N/A | undefined | SUCCESS |
| 43 | `add_maintainer_note` | [`0x7c084e32bc56897fdba64d5eb9b5108c94d9a2c61a73d2a185f7a7b2fae17b3d`](https://explorer-studio.genlayer.com/tx/0x7c084e32bc56897fdba64d5eb9b5108c94d9a2c61a73d2a185f7a7b2fae17b3d) | `undefined` | N/A | undefined | SUCCESS |
| 44 | `add_maintainer_note` | [`0x51d35dc589466cd08c4fa7b16c7fa3738a1f6546ef74cffe4438cb5b7bca0779`](https://explorer-studio.genlayer.com/tx/0x51d35dc589466cd08c4fa7b16c7fa3738a1f6546ef74cffe4438cb5b7bca0779) | `undefined` | N/A | undefined | SUCCESS |
| 45 | `retire_page` | [`0x10343d90a0312e4047e05126f13353a92767b0a1db0235ca22107cbb698da0b4`](https://explorer-studio.genlayer.com/tx/0x10343d90a0312e4047e05126f13353a92767b0a1db0235ca22107cbb698da0b4) | `undefined` | N/A | undefined | SUCCESS |
| 46 | `deploy / contract call` | [`0xd171df04a4a959e77f17c8b5c8109d29419baaa273c0df0d58736dbbfbc56cd4`](https://explorer-studio.genlayer.com/tx/0xd171df04a4a959e77f17c8b5c8109d29419baaa273c0df0d58736dbbfbc56cd4) | `undefined` | N/A | undefined | SUCCESS |

### 2.2 13 E2E Production Lifecycle Transactions (`docs/e2e_production_evidence.json`)

Real execution run of 13 transactions on contract `0x1292C9bf74C2ef2789184Ec9808379d46279dd30`:

| Step | Function | Transaction Hash | Sender Address | Votes | Derived Label |
| :-: | :--- | :--- | :--- | :---: | :--- |
| 1 | `register_page` | [`0xf0cd11a6023478d73859411fff64397db167ebc1a171c318eb384756c1f16011`](https://explorer-studio.genlayer.com/tx/0xf0cd11a6023478d73859411fff64397db167ebc1a171c318eb384756c1f16011) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 2 | `register_page` | [`0x1d9cbc99ff54a6736c74f0f7b6b149f5724d856a5a4a3e624bdbd35377f07e7d`](https://explorer-studio.genlayer.com/tx/0x1d9cbc99ff54a6736c74f0f7b6b149f5724d856a5a4a3e624bdbd35377f07e7d) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 3 | `register_page` | [`0x60fb95f40af275e4bc5b580522fc89652a58a025adba914a37e9a3a9d5de3ede`](https://explorer-studio.genlayer.com/tx/0x60fb95f40af275e4bc5b580522fc89652a58a025adba914a37e9a3a9d5de3ede) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 4 | `register_page` | [`0x50b27c2a5951c43668365553d7657c0e13c8efe36ecb4ea8c63dd14febcbd4a5`](https://explorer-studio.genlayer.com/tx/0x50b27c2a5951c43668365553d7657c0e13c8efe36ecb4ea8c63dd14febcbd4a5) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 5 | `register_page` | [`0x21c66bd311ef4afa1f4362f28ed3553ba32a523d941c373d8e37c26c223e4811`](https://explorer-studio.genlayer.com/tx/0x21c66bd311ef4afa1f4362f28ed3553ba32a523d941c373d8e37c26c223e4811) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 6 | `register_page` | [`0x52542eb40354cd8af80a43efdc835f72acecbb0da8239bb7f51a72a3155aa099`](https://explorer-studio.genlayer.com/tx/0x52542eb40354cd8af80a43efdc835f72acecbb0da8239bb7f51a72a3155aa099) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 7 | `audit_page` | [`0xc11869cb1746eee55de76786603de6cbd2e6d0ba8fa08888f335f72ca087f7e7`](https://explorer-studio.genlayer.com/tx/0xc11869cb1746eee55de76786603de6cbd2e6d0ba8fa08888f335f72ca087f7e7) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 8 | `audit_page` | [`0x4bd7061c35743d4c3be5175ce92f13b19357b4cfa7870b3a8d160e94ead4ed3d`](https://explorer-studio.genlayer.com/tx/0x4bd7061c35743d4c3be5175ce92f13b19357b4cfa7870b3a8d160e94ead4ed3d) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 9 | `add_maintainer_note` | [`0x89e228cbbfece43e2138f97370a1a4cefd09927a20aa07d3d98ccbaf69644b3a`](https://explorer-studio.genlayer.com/tx/0x89e228cbbfece43e2138f97370a1a4cefd09927a20aa07d3d98ccbaf69644b3a) | `0x9871b97Ce2cB260E48c1e6Bc3E4a43dfDf1BC681` | 3/5 | undefined |
| 10 | `add_maintainer_note` | [`0xca9397942b5c2d0992d4b724f50d5683685c1c57d2fe50bd6de8267ff2b32c2e`](https://explorer-studio.genlayer.com/tx/0xca9397942b5c2d0992d4b724f50d5683685c1c57d2fe50bd6de8267ff2b32c2e) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 4/5 | undefined |
| 11 | `audit_page` | [`0x5ed706a6b9ca82295c10230c3fec4fba1e8d2215df01400ec4cde27983455b32`](https://explorer-studio.genlayer.com/tx/0x5ed706a6b9ca82295c10230c3fec4fba1e8d2215df01400ec4cde27983455b32) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 3/5 | undefined |
| 12 | `retire_page` | [`0x216aea1a1271ca216595355c679e4186891d66403c1c38c2fa9f4cf84ecb883d`](https://explorer-studio.genlayer.com/tx/0x216aea1a1271ca216595355c679e4186891d66403c1c38c2fa9f4cf84ecb883d) | `0x9871b97Ce2cB260E48c1e6Bc3E4a43dfDf1BC681` | 3/5 | undefined |
| 13 | `retire_page` | [`0xa14ab27ddb642cadfb39acd5528d8d53c4abcbd77e9d5f62b8fb77b0da4a4d0f`](https://explorer-studio.genlayer.com/tx/0xa14ab27ddb642cadfb39acd5528d8d53c4abcbd77e9d5f62b8fb77b0da4a4d0f) | `0x6a17CCc9e1637b3fFe74E50f0f0e3e23D2F8f9A5` | 4/5 | undefined |

---

## 3. Axe-Core Accessibility Matrix Evidence (`docs/axe_matrix.json`)

Target URL: `https://alt-check-app-genlayer.vercel.app`  
Tested At: `2026-11-09T13:21:24.167Z`  
Total Route/Dialog x Viewport Combinations: 27  
Total Violations: Critical: 0, Serious: 0, Moderate: 0, Minor: 0

| Route / Dialog | Viewport | Critical | Serious | Moderate | Minor |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Landing Page (/) | 1440x900 | 0 | 0 | 0 | 0 |
| Landing Page (/) | 500x400 | 0 | 0 | 0 | 0 |
| Landing Page (/) | 390x667 | 0 | 0 | 0 | 0 |
| Board (/board) | 1440x900 | 0 | 0 | 0 | 0 |
| Board (/board) | 500x400 | 0 | 0 | 0 | 0 |
| Board (/board) | 390x667 | 0 | 0 | 0 | 0 |
| Register Page (/register) | 1440x900 | 0 | 0 | 0 | 0 |
| Register Page (/register) | 500x400 | 0 | 0 | 0 | 0 |
| Register Page (/register) | 390x667 | 0 | 0 | 0 | 0 |
| Page Detail (/p/55d0e52560ab) | 1440x900 | 0 | 0 | 0 | 0 |
| Page Detail (/p/55d0e52560ab) | 500x400 | 0 | 0 | 0 | 0 |
| Page Detail (/p/55d0e52560ab) | 390x667 | 0 | 0 | 0 | 0 |
| Methodology (/method) | 1440x900 | 0 | 0 | 0 | 0 |
| Methodology (/method) | 500x400 | 0 | 0 | 0 | 0 |
| Methodology (/method) | 390x667 | 0 | 0 | 0 | 0 |
| Evidence (/evidence) | 1440x900 | 0 | 0 | 0 | 0 |
| Evidence (/evidence) | 500x400 | 0 | 0 | 0 | 0 |
| Evidence (/evidence) | 390x667 | 0 | 0 | 0 | 0 |
| Wallet & Funds (/wallet) | 1440x900 | 0 | 0 | 0 | 0 |
| Wallet & Funds (/wallet) | 500x400 | 0 | 0 | 0 | 0 |
| Wallet & Funds (/wallet) | 390x667 | 0 | 0 | 0 | 0 |
| Dialog: WalletModal | 1440x900 | 0 | 0 | 0 | 0 |
| Dialog: WalletModal | 500x400 | 0 | 0 | 0 | 0 |
| Dialog: WalletModal | 390x667 | 0 | 0 | 0 | 0 |
| Dialog: TxPipelineModal | 1440x900 | 0 | 0 | 0 | 0 |
| Dialog: TxPipelineModal | 500x400 | 0 | 0 | 0 | 0 |
| Dialog: TxPipelineModal | 390x667 | 0 | 0 | 0 | 0 |

---

## 4. Automated Verification & Test Suite Execution

### 4.1 Unit Test Suite (`npm test` / Vitest)

```
RUN  v3.2.7 E:/alt-check-app-genlayer

 [PASS] tests/rpcErrorHandling.test.ts (2 tests) 9ms
 [PASS] tests/boardSorting.test.ts (3 tests) 14ms
 [PASS] tests/revertMap.test.ts (3 tests) 11ms
 [PASS] tests/addressConsistency.test.ts (3 tests) 8ms
 [PASS] tests/txLifecycle.test.ts (7 tests) 10ms
 [PASS] tests/urlValidation.test.ts (29 tests) 18ms
 [PASS] tests/evidenceConsistency.test.ts (5 tests) 23ms
 [PASS] tests/constantsParity.test.ts (1 test) 9ms
 [PASS] tests/contractMethods.test.ts (3 tests) 9ms
 [PASS] tests/readbackVerification.test.ts (4 tests) 16ms
 [PASS] tests/scoringArithmetic.test.ts (4 tests) 13ms
 [PASS] tests/methodFailureProof.test.ts (2 tests) 8ms

 Test Files  12 passed (12)
      Tests  66 passed (66)
   Start at  20:32:39
   Duration  3.68s (transform 1.66s, setup 0ms, collect 3.22s, tests 148ms, environment 6ms, prepare 8.93s)
```

### 4.2 Automated Code Quality Scanners (`npm run check`)

```
PASS: Reference contract AltCheck.py matches canonical SHA-256 (9af349d914c6c0e44199a00b0bc4c219a27fc6a9836b3b3a70574c23e4cdc262).

PASS: Zero banned words detected across codebase and docs.
```

---

## 5. Release & Git Tag Integrity

### 5.1 Local & Remote Git Tags

```
Local tags:
v1.0.2          AltCheck Desk v1.0.2: On-chain evidence reconciliation, zero-occlusion dialog hardening, and live fixture audit
v1.0.3          Release v1.0.3: reconcile fixture URLs, axe-core evidence matrix, and verified evidence

Remote tags (origin):
bb11820277c8bb80c0f7a50901d7c411c595bb0a	refs/tags/v1.0.1
d492bcafb6c650551a69d70a4341c3156d3c4d60	refs/tags/v1.0.2
6c818f4dc28c85deb241bcb4c0ef460c78dd10fb	refs/tags/v1.0.2^{}
d5a79577d547dd6b797cc9e47f299f0325ffca11	refs/tags/v1.0.3
42e5f4dc306ba0c0b19efc54869904237a79b23a	refs/tags/v1.0.3^{}
```

### 5.2 Release Artifact Archive

- **Filename**: `alt-check-desk-artifacts.zip`
- **Size**: 1,949,245 bytes
- **SHA-256**: `76fc2c653e369201cc110504bce7b4afd389c65f19bc6fe16f7eb8182a63d293`

---

## 6. Plain List of Items Not Measured or Unreachable

1. **Historical Fixture URLs (Pages 4-11)**: Stored URLs on `https://huzyow155.github.io/alt-check-fixtures/...` return HTTP 404 following an account rename. The contract view methods correctly return their historical stored audit data, but new audits cannot be executed on them because validator nodes cannot retrieve content from the dead URLs. The UI marks these pages with plain notice: `The source host no longer serves this URL (HTTP 404). The stored audit result is still readable; a new audit of this page cannot be run.` and hides the Run Consensus Audit button.
2. **Native Gas / Wei Deduction**: Measured as 0 wei. GenLayer Studionet (Preview) does not deduct transaction gas or token balances for execution.
3. **Client-Side JavaScript / Canvas Execution**: Not measured or simulated by GenLayer validator consensus nodes (AltCheck evaluates server-delivered raw HTML only).
4. **Accessibility Violations**: Zero critical, zero serious, zero moderate, and zero minor violations detected across all routes and modal dialogs across all 3 viewports (1440px, 500px, 390px).
