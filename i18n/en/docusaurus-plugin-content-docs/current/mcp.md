# Binary Security Platform MCP Server — Portfolio

> Go-based MCP server enabling AI agents to directly invoke a binary security scanner.

---

## Overview

Implements the [Model Context Protocol (MCP)](https://modelcontextprotocol.io) in Go, allowing AI agents (Claude, etc.) to interact directly with a binary analysis platform. Exposes binary upload, scan execution, SBOM export, and scan-completion polling as MCP tools.

MCP is an open protocol for AI assistants to call external services as tools. Through this server, security engineers can automate vulnerability scan workflows using natural language prompts.

---

## Tech Stack

| Category | Stack |
|----------|-------|
| **Language** | Go 1.25 |
| **MCP SDK** | `github.com/modelcontextprotocol/go-sdk` v1.4.1 |
| **HTTP Client** | `hashicorp/go-retryablehttp` (retry + backoff) |
| **Concurrency** | `golang.org/x/sync/errgroup` |
| **Rate Limiting** | `golang.org/x/time/rate` (token bucket) |
| **Logging** | `log/slog` (structured) + `lumberjack` (log rotation) |
| **JSON Schema** | `google/jsonschema-go` |
| **Testing** | `testify` |
| **Linting** | golangci-lint v2 (strict config, ~15 linters) |

---

## Architecture

### Two Binaries, One Module

```
Bootstrap CLI    → One-shot setup. Prompts for credentials, fetches tokens
                  from the platform API, writes auth file to OS data dir.

MCP Server       → Long-running stdio server. Reads auth file,
                  builds dependencies, registers tools, starts MCP server.
```

### Layer Structure

```
Entry points (server / bootstrap CLI)
    ↓
MCP tool layer           Tool registration, handler wrapping (audit log, rate limiter)
    ↓
Platform API client      REST client (scan, export, binary, token APIs)
Auth layer               Token file read/write, auto-refresh session
Filesystem layer         OS paths, zip-on-the-fly upload, atomic file writes
Config layer             App defaults + env-var overrides
Logging layer            Structured logger + audit logger
Middleware layer         Token-bucket rate limiter
```

### Key Design Decisions

**Dependency injection via struct**
All dependencies composed into a single struct, constructed once at startup:
- Platform API client — authenticated REST client backed by a session with automatic token refresh
- Export resource manager — registers downloaded SBOM files as temporary MCP resources with TTL-based sweep
- Scan wait manager — background polling worker for the scan wait tool; caches scan states to prevent agents from over-polling the backend
- Audit logger — writes structured audit entries for every MCP tool invocation

**Upload fan-out**
When uploading multiple binaries, fans out up to 10 concurrent goroutines via `errgroup`. Individual upload errors are stored per-result without aborting the batch.

**Token auto-refresh**
A mutex guards token refresh calls. If another caller already refreshed the token, subsequent refresh attempts are no-ops — prevents thundering herd on 401.

**Export resource TTL management**
Files downloaded from the platform are stored in an OS-specific directory, registered as MCP resources with a random ID. A background ticker sweeps expired files automatically.

**Scan polling management**
A single background goroutine polls scan status for all tracked binaries. Each binary has its own next-poll timestamp to avoid over-polling. Timed-out states are marked distinctly from scan failures.

### MCP Tools

| Tool | Function |
|------|----------|
| `upload_binary` | Upload binary file to the platform |
| `start_scan` | Start a scan on uploaded binaries |
| `wait_for_scan` | Poll until scan completes |
| `export_sbom` | Download SBOM/CBOM and register as MCP resource |

All tool handlers are wrapped with audit logging and rate limiter prechecks.

---

## Configuration (env vars)

| Variable | Default |
|----------|---------|
| `MCP_REQUEST_TIMEOUT_SECONDS` | 20 |
| `MCP_UPLOAD_TIMEOUT_SECONDS` | 1800 |
| `MCP_RETRY_MAX_ATTEMPTS` | 3 |
| `MCP_RETRY_BACKOFF_SECONDS` | 1 |
| `MCP_RESOURCE_TTL_SECONDS` | 900 |
| `MCP_RATE_LIMIT_RPS` | 5.0 |
| `MCP_RATE_LIMIT_BURST` | 10 |
| `MCP_SCAN_PROGRESS_POLL_AFTER_SECONDS` | 30 |

---

## Quality

- golangci-lint v2 strict config (~15 linters): no global vars, no init(), forced error wrapping on external packages, context threading enforcement, and more
- Tests across all layers
- Atomic auth file writes to prevent corruption
- Structured audit log — every MCP tool invocation traced

---

## Contributions

Collaborated with an external development team. Responsible for requirements definition, quality validation, and ongoing maintenance.

- **MCP tool spec definition and design**: Defined the specification for all 4 MCP tools (`upload_binary`, `start_scan`, `wait_for_scan`, `export_sbom`) — input/output schemas, behavioral contracts, and error scenarios. Authored technical requirements documentation for the external development team
- **Conformance testing**: Verified that the implemented MCP server matched the defined specs. Validated edge case behavior (upload failure, scan timeout, token expiry, etc.) and provided structured feedback
- **Maintenance and feature fixes**: Diagnosed and resolved issues in production. Re-defined specs for behavioral changes and oversaw their implementation
-

---

> Proprietary commercial product. This document describes architecture and technical decisions for portfolio purposes — no source code included.
