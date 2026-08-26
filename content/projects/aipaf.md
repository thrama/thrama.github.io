---
title: "AIPAF — AI Project Assessment Framework"
date: 2026-08-26
draft: false
tags:
  [
    "python",
    "ai-governance",
    "eu-ai-act",
    "nist-ai-rmf",
    "iso-42001",
    "responsible-ai",
    "rag",
    "llm",
  ]
categories: ["projects"]
summary: "Python CLI and methodology for structured assessment of enterprise AI projects, grounded in NIST AI RMF 1.0, ISO/IEC 42001:2023, and the EU AI Act"
ShowToc: false
---

## Description

AIPAF is a Python CLI and an assessment methodology for evaluating enterprise AI projects against **NIST AI RMF 1.0**, **ISO/IEC 42001:2023**, and the **EU AI Act**.

It scores a project across six dimensions — strategic alignment, risk classification, data readiness, technical feasibility, ethical & responsible AI, and operational readiness — through a **deterministic scoring engine** that produces a GREEN / YELLOW / RED approval gate, sector-specific weighting, and pattern alerts.

The key architectural decision: **the numbers never come from the model**. An LLM (Anthropic Claude or a local Ollama model) is used only to structure interview answers and to write narratives; every score, gate, and flag is computed by an engine with zero AI dependencies, so the same input always yields the same output. An optional RAG layer (ChromaDB) injects the relevant regulatory text into prompts, which measurably improves the quality of local models.

The framework is conservative by design: a skipped criterion still weighs on its dimension, a not-applicable criterion leaves the denominator entirely, and a partial assessment never produces a definitive gate.

### Features

- **Deterministic scoring engine** — gates, weighted sector profiles, pattern alerts, and normative flags, fully reproducible
- **Pluggable LLM layer** — Claude via the Anthropic API or Ollama for fully local, on-premise runs; adding a provider is one class and one line
- **RAG over regulatory sources** — EU AI Act and NIST AI RMF indexed in ChromaDB, with incremental re-indexing based on document checksums
- **Interactive and batch modes** — guided interview, JSON batch scoring, and partial re-assessment of selected dimensions
- **Markdown reporting** — scorecard, per-dimension criteria tables, executive summary, remediation plan, and regulatory appendix
- **Traceability** — every session records the LLM provider, the model, and the AIPAF version that produced it
- **Jupyter notebook** for exploratory assessment alongside the CLI

### Privacy by choice of provider

Running with `--llm ollama` keeps the entire assessment — interview answers and RAG excerpts — on the local machine. This matters when the project under evaluation is itself confidential.

## Repository

🔗 [GitHub - AIPAF](https://github.com/thrama/aipaf)

Code released under **MIT**; framework documents under **CC BY 4.0**.

> AIPAF is a methodological support tool. Its scores and gates do not constitute legal advice, an AI Act conformity assessment, or an ISO/IEC 42001 certification.

## Skills

- Python (3.11+)
- Typer, Pydantic
- Anthropic API / Claude
- Ollama (local LLM)
- ChromaDB / RAG
- AI Governance (NIST AI RMF, ISO/IEC 42001, EU AI Act)
- pytest, ruff, GitHub Actions

---

_Last updated: August 2026_
