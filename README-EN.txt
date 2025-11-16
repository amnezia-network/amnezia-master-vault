AMNEZIA MASTER VAULT — MVP (Minimum Viable Protocol)

Amnezia Master Vault is a minimalist system for identity, traceability, and cryptographic signing of musical works, designed as the foundation for a future tokenization and smart-contract framework.

The current MVP runs 100% locally, without blockchain dependencies, keeping everything simple, auditable, and transparent.
It already implements the essential pipeline:

Asset creation → SyncToken generation → Signing → Verification

🔹 System Components
vault-cli.js

A command-line interface where an artist can:

Create tokens (one per work)

Sign them using their private RSA key

Verify signatures using the public key

View the operation history (audit trail)

createsynctoken.js

Generates SyncTokens designed for future blockchain interoperability.

Uses stable serialization → the exact bytes written are the bytes being signed.

Ensures deterministic hashing and versioning, aligning with future NFT-like structures.

verifysync.js and verify.js

Standalone verification scripts that allow anyone to validate a token outside the Vault system.

This demonstrates portability, trust, and a future where verification can happen on:

Blockchain nodes

Smart contracts

Third-party tools

Marketplaces

🔹 SyncToken Structure (.synctoken.json)

Each token includes:

token_id — globally unique identifier

vault_version — protocol versioning

assets + asset hashes — integrity and traceability

rights — basic ownership structure

issued_at — timestamp

This functions similarly to NFT metadata, but locally generated and verifiable before ever touching a blockchain.

Scalability Toward Blockchain

The MVP is intentionally minimal but already structured to evolve into:

On-chain token minting

Deterministic SyncToken → NFT mapping

Smart contracts for revenue sharing

Artist identity registry

Marketplaces with verifiable provenance

Audit logs anchored on-chain (Merkle trees, hashes, etc.)

The SyncToken becomes the source of truth that gets tokenized later, ensuring:

Transparent provenance

Cross-platform interoperability

Immutable artist signatures

Trustless verification

Vision

Amnezia Master Vault is the first layer of a broader ecosystem:

Identity & Signature Layer (MVP you’ve built)

Metadata + Vault History Layer

Tokenization Layer (smart contracts, royalties, licensing)
