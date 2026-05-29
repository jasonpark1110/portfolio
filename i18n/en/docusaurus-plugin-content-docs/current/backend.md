---
id: backend
sidebar_position: 2
---
# Binary Security Platform — Backend Portfolio

> Ruby on Rails 8 REST API server for a binary code analysis & compliance SaaS platform.

---

## Product Overview

Rails API server exposing a binary analysis engine as a versioned REST API. Scans software projects for binary composition (components, CVEs, licenses) and provides results via an OAuth 2.0-secured API. Multi-tenant SaaS with company-scoped data isolation.

---

## Tech Stack

| Category | Stack |
|----------|-------|
| **Framework** | Ruby 3.4.5, Rails 8.0.3, Puma |
| **Database** | PostgreSQL (primary + dedicated background job DB) |
| **Auth** | Devise + Doorkeeper OAuth 2.0 |
| **Authorization** | Pundit (per-resource policies) |
| **Background Jobs** | Delayed Job (8 workers) + Whenever (cron) |
| **Serialization** | Active Model Serializers (JSON-API) |
| **FFI** | PyCall, Fiddle (Ruby ↔ Python/C) |
| **File Uploads** | CarrierWave |
| **Pagination** | Kaminari |
| **AWS** | Marketplace metering, SNS, SQS, S3 |
| **Deployment** | Kamal (Docker) |

---

## Architecture

### Request Lifecycle

```
HTTP Request
  → Doorkeeper OAuth validation
  → Pundit resource policy check
  → Controller action
  → Input validation layer
  → Service layer (business logic)
  → Repository layer (DB queries)
  → Mapper → Serializer → JSON response
```

Long-running operations (scans, exports, report generation) are enqueued as async Delayed Jobs.

### Layered Architecture

| Layer | Purpose |
|-------|---------|
| Controllers | REST endpoints, auth validation, layer delegation |
| Services | Business logic, orchestration |
| Repositories | Complex DB queries isolated from models |
| Mappers | Domain objects → serializable DTOs |
| Serializers | JSON-API response formatting |
| Forms | Input parameter validation |
| Policies | Per-resource Pundit authorization |
| Adapters | External system integrations |
| Jobs | Async background tasks |

### Core Domain Model

All data is tenant-scoped in a multi-tenant architecture:
- Tenant — owns all data, settings, and memberships
- Project — software product under analysis, belongs to tenant
- Scan result — analysis output produced by the binary analysis engine
- Component — software component detected in a scan
- Vulnerability — CVE/CNVD data linked to a component
- License — license and compliance data for a component

### SBOM Multi-Format Support

Python modules called from Rails via PyCall FFI, enabling multi-standard SBOM export and import:

| Format |
|--------|
| SPDX 2.x |
| SPDX 3.x |
| CycloneDX |
| VEX |
| CBOM |
| AI-BOM |

### External Integrations

- **Binary analysis engine** — invoked via PyCall / Fiddle FFI
- **AWS** — Marketplace metering, SNS notifications, SQS queues, S3 file storage
- **LDAP** — enterprise SSO
- **Jira** — issue tracker sync

---

## Scale

| Metric | Value |
|--------|-------|
| Rails version | 8.0.3 |
| Ruby version | 3.4.5 |
| Domain models | 150+ |
| DB migrations | 230+ |
| API endpoints | Many versioned REST routes |
| Service domains | 20+ |
| Background workers | 8 |

---

## Contributions

> *(Fill in your specific contributions)*

-
-
-

---

> Proprietary commercial product. This document describes architecture and technical decisions for portfolio purposes — no source code included.
