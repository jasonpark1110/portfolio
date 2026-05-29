---
id: backend
sidebar_position: 2
---
# 바이너리 보안 플랫폼 — 백엔드 포트폴리오

> 바이너리 분석 보안 플랫폼을 위한 Ruby on Rails 8 REST API 서버

---

## 제품 개요

바이너리 분석 엔진의 REST 인터페이스를 제공하는 Rails API 서버. 소프트웨어 프로젝트를 스캔해 바이너리 컴포지션(컴포넌트, CVE, 라이선스)을 분석하고, 버전 관리된 OAuth 2.0 API로 결과를 노출한다. 회사 단위 데이터 격리를 갖춘 멀티테넌트 SaaS.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| **프레임워크** | Ruby 3.4.5, Rails 8.0.3, Puma |
| **데이터베이스** | PostgreSQL (주 DB + 백그라운드 작업 전용 DB 분리) |
| **인증** | Devise + Doorkeeper OAuth 2.0 |
| **권한 부여** | Pundit (리소스별 정책) |
| **백그라운드 작업** | Delayed Job (워커 8개) + Whenever (cron) |
| **직렬화** | Active Model Serializers (JSON-API) |
| **FFI** | PyCall, Fiddle (Ruby ↔ Python/C) |
| **파일 업로드** | CarrierWave |
| **페이지네이션** | Kaminari |
| **AWS** | Marketplace 미터링, SNS, SQS, S3 |
| **배포** | Kamal (Docker 기반) |

---

## 아키텍처

### 요청 처리 흐름

```
HTTP 요청
  → Doorkeeper OAuth 검증
  → Pundit 리소스 정책 검사
  → 컨트롤러 액션
  → 입력 유효성 검증
  → 서비스 레이어 (비즈니스 로직)
  → 레포지토리 레이어 (DB 쿼리)
  → Mapper → Serializer → JSON 응답
```

스캔, 보고서 생성 등 장시간 작업은 Delayed Job으로 비동기 큐잉.

### 레이어드 아키텍처

| 레이어 | 역할 |
|--------|------|
| Controllers | REST 엔드포인트, 인증 검증, 레이어 위임 |
| Services | 비즈니스 로직, 오케스트레이션 |
| Repositories | 복잡한 DB 쿼리를 모델에서 분리 |
| Mappers | 도메인 객체 → 직렬화 가능한 DTO 변환 |
| Serializers | JSON-API 응답 포맷팅 |
| Forms | 입력 파라미터 유효성 검증 |
| Policies | 리소스별 Pundit 권한 정책 |
| Adapters | 외부 시스템 연동 |
| Jobs | 비동기 작업 |

### 핵심 도메인 모델

멀티테넌트 구조로 모든 데이터는 테넌트(회사) 단위로 격리:
- 테넌트 — 모든 데이터, 설정, 멤버십 소유
- 프로젝트 — 테넌트 하위의 분석 대상 소프트웨어 제품
- 스캔 결과 — 바이너리 분석 엔진이 생성한 분석 결과
- 컴포넌트 — 스캔에서 탐지된 소프트웨어 구성요소
- 취약점 — 컴포넌트에 연결된 CVE/CNVD 정보
- 라이선스 — 컴포넌트의 라이선스 및 컴플라이언스 정보

### SBOM 다중 포맷 지원

Rails에서 PyCall FFI를 통해 Python 모듈을 호출하는 방식으로 다중 표준 포맷 내보내기/가져오기 구현:

| 포맷 |
|------|
| SPDX 2.x |
| SPDX 3.x |
| CycloneDX |
| VEX |
| CBOM |
| AI-BOM |

### 외부 연동

- **바이너리 분석 엔진** — PyCall / Fiddle FFI로 호출
- **AWS** — Marketplace 미터링, SNS 알림, SQS 큐, S3 파일 스토리지
- **LDAP** — 엔터프라이즈 SSO
- **Jira** — 이슈 트래커 연동

---

## 규모

| 지표 | 값 |
|------|-----|
| Rails 버전 | 8.0.3 |
| Ruby 버전 | 3.4.5 |
| 도메인 모델 수 | 150개+ |
| DB 마이그레이션 | 230개+ |
| API 엔드포인트 | 다수의 버전 관리된 REST 라우트 |
| 서비스 도메인 | 20개+ |
| 백그라운드 워커 | 8개 |

---

## 기여 내역

> *(직접 작성)*

-
-
-

---

> 독점 상용 제품입니다. 아키텍처와 기술적 의사결정을 포트폴리오 목적으로 기술한 문서이며 소스 코드는 포함하지 않습니다.
