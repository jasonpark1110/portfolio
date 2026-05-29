---
id: frontend
slug: /
sidebar_position: 1
---
# Binary Security Platform — Frontend Portfolio

> React SPA for an enterprise binary code analysis & compliance SaaS platform.

---

## Product Overview

Enterprise security SaaS for PSIRT engineers and compliance officers to scan firmware and application binaries for known vulnerabilities (CVE/CNVD), open-source composition (SBOM), license violations, and custom policy breaches.

- Target users: PSIRT engineers, security compliance officers
- Design philosophy: data-dense, signal-first — modeled after Wiz/Snyk, not generic dashboard SaaS
- Current version: v5.0.452 (long-running product across 5 major versions)

---

## Tech Stack

| Category | Stack |
|----------|-------|
| **Framework** | React 19, React Router v7 (hash-based) |
| **State** | MobX (UI state) + TanStack React Query (server state) |
| **Build** | Webpack 5 + SWC (replaces Babel) + esbuild minifier + PurgeCSS |
| **UI Primitives** | Radix UI (accessibility), Semantic UI CSS (legacy base) |
| **Data Viz** | Chart.js + chartjs-plugin-zoom |
| **Virtualization** | @tanstack/react-virtual |
| **i18n** | react-i18next, browser language auto-detection |
| **DnD** | @hello-pangea/dnd |
| **Export** | jspdf (PDF), jszip, react-csv |
| **Integrations** | Jira, Redmine |

---

## Architecture

### Dual State Management

MobX and React Query coexist with strict role separation:

```
MobX stores     → UI state, navigation, user session, modal state
React Query     → API data fetching, caching, background sync, pagination
```

7 domain-specific MobX stores composed into a single root store, injected into the component tree via Context API. Store-reading components are wrapped with the `observer()` HOC.

### Centralized API Client

All HTTP calls funnel through a single entry point:
- Domain module aggregation (users, reports, projects, issues, settings, etc.)
- Browser fingerprint header auto-injected on every request
- 401 interception → login redirect
- Environment-based backend host switching (dev / prod)

### Route Architecture

40+ pages structured into 3 layout branches (unauthenticated / main / results detail). The results view contains deeply nested routes across 5 analysis domains (overview, component, security, license, policy). Protected route handles session validation and a 120-minute token-refresh cycle.

### Custom Build Pipeline

- **SWC**: Rust-based JS/JSX transpiler replacing Babel — significant build speed improvement
- **esbuild**: production bundle minification
- **PurgeCSS**: strips unused CSS at build time (bundle size reduction)
- Content-hashed asset filenames for cache-busting
- HMR configured for instant dev feedback

---

## Key Features

### Virtualized Large Lists
`@tanstack/react-virtual` renders thousands of CVE/component rows without DOM bloat. Applied across security, component, and license views.

### PDF Report Generation
Compliance report generator using jspdf. Designed a DOM clone pre-processing pipeline that strips computed styles for clean print output.

### SBOM Export / Import
Multi-format export (CSV, ZIP) and import pipeline with validation UI.

### Issue Tracker Integrations
Jira and Redmine sync — push CVE findings directly to issue trackers from the results view.

### Auto-logout
Inactivity detection hook handles session expiry, independent of the 401 intercept path.

### Knowledge Base (CVE Search)
Standalone full-text CVE search, queryable independently of scan results.

---

## Design System

4-tier severity color tokens defined as CSS variables:

```
Critical: #ff440c
High:     #ff7d00
Medium:   #ffae00
Low:      #ffde00
```

Severity always paired with shape + label for color-blind accessibility. Component-scoped CSS co-located with JS. No CSS-in-JS.

---

## Scale

| Metric | Value |
|--------|-------|
| Version | 5.0.452 |
| Screens | 40+ |
| API domain modules | 10+ |
| MobX stores | 7 |
| Supported languages | Multi (auto-detect) |

---

## Contributions

Sole designer and implementer of the entire frontend.

- **Architecture design**: Introduced dual state management — MobX for UI state, TanStack React Query for server state, with strict role separation. Designed 7-store composition into a root store with Context API injection
- **Custom build pipeline**: Assembled Webpack 5 + SWC + esbuild + PurgeCSS. Eliminated unused CSS at build time to reduce bundle size
- **Centralized API client**: Single entry point with domain module aggregation, fingerprint header injection, 401 interception, and environment-based host switching
- **Virtualized lists**: Built on `@tanstack/react-virtual` to render thousands of rows without DOM bloat, applied across security, component, and license views
- **PDF report generation**: jspdf-based compliance report generator with a DOM clone pre-processing pipeline that strips computed styles for clean print output
- **SBOM export/import**: Multi-format export (CSV, ZIP) and import pipeline with validation UI
- **Issue tracker integrations**: Jira and Redmine sync modules, enabling CVE findings to be pushed directly to issue trackers from the results view
- **Design system**: 4-tier severity token system (Critical/High/Medium/Low) with color + shape + label for color-blind accessibility
- **Session management**: 120-minute token refresh cycle and inactivity-based auto-logout implemented as independent, non-interfering paths
- **Internationalization**: react-i18next across all 40+ screens with zero hardcoded UI strings; browser language auto-detection on first load
- **Route architecture**: Structured 40+ pages into 3 layout branches with 5-domain nested routes under the results view

---

> Proprietary commercial product. This document describes architecture and technical decisions for portfolio purposes — no source code included.
