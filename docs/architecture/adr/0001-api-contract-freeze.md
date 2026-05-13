# ADR-0001: API Contract Freeze During Scalability Migration

- Status: Accepted
- Date: 2026-05-13

## Context

KalaOS is migrating from a monolithic FastAPI backend to a modular, queue-driven architecture. Breaking existing client contracts during this migration would create high rollout risk.

## Decision

1. Existing public REST paths remain backward-compatible during Phase A/B.
2. New scalability primitives are introduced via additive endpoints (for example `/jobs/*`).
3. Schema changes in existing endpoints must remain backward-compatible (additive fields only).
4. Route modularization must preserve endpoint path, method, and response semantics.

## Consequences

- Migration can proceed incrementally without blocking frontend and integration clients.
- Temporary internal duplication may exist while routes are extracted from `backend/main.py`.
- Contract tests become a required gate for later phases.

