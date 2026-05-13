# ADR-0002: Phase A Modular Backend Boundaries

- Status: Accepted
- Date: 2026-05-13

## Context

`backend/main.py` currently concentrates route definitions and orchestration logic. Heavy AI/media tasks should not execute directly in request handlers long-term.

## Decision

Phase A introduces explicit module boundaries while keeping one deployable API:

- `backend/routers/` for route modules.
- `backend/usecases/` for application orchestration and job state.
- `backend/workers/` for heavy task execution adapters.

An initial async job API (`/jobs/*`) is added to establish queue-first execution patterns.

## Consequences

- Internal architecture now supports progressive extraction from the monolith.
- A stable boundary exists for migrating to Redis/Celery/Temporal later.
- Existing endpoints remain functional while heavy workloads can move to async jobs.

