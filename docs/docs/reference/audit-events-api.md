---
outline: deep
---

# Audit Events API

Butler SOS exposes an HTTP API for receiving Audit.qs events and for testing client connectivity before sending live traffic.

This page documents the stable HTTP contract for that API: endpoints, authentication behavior, response semantics, and retry guidance.

## Endpoints

| Endpoint | Method | Purpose |
| -------- | ------ | ------- |
| `/api/v1/audit-event` | `POST` | Accept an audit event envelope from Audit.qs |
| `/api/v1/audit-event` | `OPTIONS` | Handle browser CORS preflight requests |
| `/api/v1/test-connection` | `GET` | Verify that Butler SOS is reachable and accepts the current credentials |

## Authentication And CORS

- If `Butler-SOS.auditEvents.apiToken` is configured, both `POST /api/v1/audit-event` and `GET /api/v1/test-connection` require `Authorization: Bearer <token>`.
- Browser-based callers must also match one of the origins listed in `Butler-SOS.auditEvents.cors.allowedOrigins`.
- `OPTIONS /api/v1/audit-event` is a CORS preflight request. It is handled before normal event processing and usually returns `204 No Content`.

## POST /api/v1/audit-event

Use this endpoint to send audit event envelopes from Audit.qs to Butler SOS.

### Required Top-Level Fields

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `schemaVersion` | number | Yes | Envelope schema version |
| `eventId` | string | Yes | UUID for the event |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `type` | string | Yes | Audit event type |
| `payload` | object | Yes | Event-specific payload |
| `correlationId` | string | No | Opaque grouping key used to connect related events |
| `source` | object | No | Client metadata such as source kind and name |

Audit.qs treats `correlationId` as an opaque string. When a selection transaction is active it usually matches `payload.event.selectionTxnId`. Otherwise, such as for `navigation.sheet.loaded`, it falls back to the stringified `currentDataStateId`. Butler SOS does not require UUID format for this field; it only enforces the documented maximum length.

### Accepted Response

If the request passes transport checks, authentication, and validation, Butler SOS returns `202 Accepted`.

```json
{
  "status": "accepted",
  "receivedAt": "2025-01-15T10:30:00.000Z",
  "outcome": "processed"
}
```

### Status Codes

| Status | Meaning | Retry? | Client Action |
| ------ | ------- | ------ | ------------- |
| `202` | Event accepted for processing | No | No further action needed |
| `400` | Envelope schema validation failed | No | Fix the request format |
| `401` | Missing or invalid bearer token | No | Fix the API token |
| `422` | Envelope content failed semantic or payload validation | No | Fix the event content |
| `429` | HTTP rate limit exceeded | Yes | Retry after the server-indicated delay |
| `500` | Internal server error while processing the event | Yes | Retry after a short delay |
| `503` | Internal audit queue is full | Yes | Retry after a short delay |

### Error Conditions

#### 400 Bad Request

Returned when the incoming JSON does not match the expected envelope schema.

Common causes:

- Missing required top-level fields such as `eventId` or `payload`
- Invalid field types
- Invalid `timestamp` format
- Invalid `source.kind` or `source.name` values

Typical response:

```json
{
  "status": "error",
  "receivedAt": "2025-01-15T10:30:00.000Z",
  "outcome": "dropped",
  "reason": "Schema validation failed",
  "details": {
    "errors": [
      {
        "instancePath": "/eventId",
        "message": "must have required property 'eventId'"
      }
    ]
  }
}
```

#### 401 Unauthorized

Returned when `Butler-SOS.auditEvents.apiToken` is configured and the request either omits the bearer token or sends the wrong token.

```json
{
  "status": "error",
  "receivedAt": "2025-01-15T10:30:00.000Z",
  "outcome": "dropped",
  "reason": "Unauthorized"
}
```

#### 422 Unprocessable Content

Returned when the envelope is structurally valid but the content cannot be accepted.

This page focuses on schema and payload semantics. Audit.qs and Butler SOS version mismatch handling is documented separately, even though it can also surface as `422`.

Common causes:

- `eventId` is not a valid UUID
- `correlationId` exceeds the allowed length
- `payload.context.appId` is not a valid UUID
- `type` is not recognized or the per-type payload schema is invalid

Typical response:

```json
{
  "status": "error",
  "receivedAt": "2025-01-15T10:30:00.000Z",
  "outcome": "dropped",
  "reason": "One or more constraint violations",
  "details": {
    "errors": [
      {
        "message": "eventId is not a valid UUID (\"not-a-uuid\")"
      }
    ]
  }
}
```

#### 429 Too Many Requests

Returned when the caller exceeds the per-IP HTTP rate limit.

Clients should treat the HTTP status code and the `Retry-After` header as authoritative. The exact JSON response body may vary depending on the rate-limit configuration.

#### 500 Internal Server Error

Returned when Butler SOS hits an unexpected server-side failure while handling the request.

This does not necessarily mean the event data itself was invalid. Retry after a short delay.

#### 503 Service Unavailable

Returned when the internal audit event queue is full and Butler SOS cannot accept more events at that time.

Retry after a short delay. If this persists, inspect queue capacity and downstream destinations.

## GET /api/v1/test-connection

Use this endpoint to verify connectivity before enabling live audit event delivery.

### 200 OK

Returned when Butler SOS is reachable and the provided token is accepted.

```json
{
  "status": "ok",
  "message": "Butler SOS Audit API is reachable",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

If the caller also sends version metadata such as `X-Audit-QS-Version`, the response may include additional compatibility fields. That behavior belongs in a separate version compatibility reference page.

### 401 Unauthorized

Returned when the endpoint requires a bearer token and the request omits it or provides the wrong value.

## OPTIONS /api/v1/audit-event

Browser clients typically send a CORS preflight request before the actual `POST`.

This request does not send an event payload. Butler SOS responds with the relevant `Access-Control-Allow-*` headers and usually returns `204 No Content`.

## Event Ingestion Response Format

Responses from `POST /api/v1/audit-event` follow a common structure:

```json
{
  "status": "accepted | error",
  "receivedAt": "2025-01-15T10:30:00.000Z",
  "outcome": "processed | dropped | error",
  "reason": "optional human-readable string",
  "details": {}
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `status` | string | `accepted` for successful ingestion, `error` for rejected or failed requests |
| `receivedAt` | string | ISO 8601 timestamp showing when Butler SOS received the request |
| `outcome` | string | `processed`, `dropped`, or `error` |
| `reason` | string | Human-readable explanation for an error condition |
| `details` | object | Optional structured details such as validation errors |

## Retry Guidance

| Status | Recommended Behavior |
| ------ | -------------------- |
| `202` | Do not retry |
| `400` | Fix the request before retrying |
| `401` | Fix authentication before retrying |
| `422` | Fix the event content before retrying |
| `429` | Retry after the `Retry-After` delay |
| `500` | Retry after 30-60 seconds |
| `503` | Retry after about 30 seconds |

## Security Notes

- Error responses do not expose internal stack traces or implementation details.
- Server-side logs contain the detailed failure information needed for debugging.

## Related Topics

- [Audit Events Rate Limiting](./audit-events-rate-limiting)
- [Audit.qs Version Compatibility](./audit-qs-version-compatibility)
- [JSON Object Data](./audit-destinations/json/object-data)
- [Screenshot Downloads](./audit-destinations/png/downloads)