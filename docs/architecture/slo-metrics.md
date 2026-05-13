# KalaOS Scalability SLO Metrics (Phase A Baseline)

This file defines migration guardrail metrics that must be tracked as architecture evolves.

## Core SLOs

- API p95 latency (`http_server_duration_ms_p95`)
- Queue wait time p95 (`job_queue_wait_ms_p95`)
- Job success rate (`jobs_success_ratio`)
- GPU utilization (`gpu_utilization_ratio`)
- Cost per completed job (`job_cost_usd`)

## Operational Metrics

- Queue depth by class (`queue_depth{gpu_class=...}`)
- Job runtime p50/p95 (`job_runtime_ms`)
- Failed jobs by task type (`jobs_failed_total{task_type=...}`)
- Retry count (`jobs_retried_total`)
- WebSocket/session concurrency (`realtime_connections_active`)

## Initial Targets

- API p95 latency: `< 400ms` for synchronous CRUD routes
- Queue wait time p95: `< 5s` for normal priority
- Job success rate: `>= 99%`
- GPU utilization steady-state: `60–85%` on worker nodes
- Cost/job trend: non-increasing week-over-week for equivalent task classes

