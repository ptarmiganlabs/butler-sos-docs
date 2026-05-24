---
outline: deep
---

# Audit Events Rate Limiting

Butler SOS applies HTTP rate limiting to the Audit Events API to protect the service from excessive request volume.

This page documents how that rate limiting works, how to configure it, and what Audit.qs clients should do when they receive `429 Too Many Requests`.

## Scope

The HTTP rate limiter applies to these endpoints:

- `POST /api/v1/audit-event`
- `GET /api/v1/test-connection`

The limit is tracked per client IP address.

## Configuration

Configure HTTP rate limiting under `Butler-SOS.auditEvents.rateLimit`:

```yaml
Butler-SOS:
  auditEvents:
    rateLimit:
      enable: true
      maxPerMinute: 300
```

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `enable` | `true` | Enable or disable HTTP rate limiting |
| `maxPerMinute` | `300` | Maximum requests per minute per client IP |

## Behavior

The rate limit is enforced at the HTTP transport layer.

Requests are checked in this order:

1. HTTP rate limit check
2. Authentication
3. Schema validation
4. Internal queue processing

This means a request can be rejected with `429` before Butler SOS evaluates authentication or request payload content.

## 429 Too Many Requests

If a client exceeds the configured limit, Butler SOS returns `429 Too Many Requests`.

Clients should treat the HTTP status code and the response headers as authoritative. The exact JSON body should not be relied on unless the deployment explicitly uses a custom rate-limit response format.

### Relevant Headers

| Header | Meaning |
| ------ | ------- |
| `x-ratelimit-limit` | Configured max requests per minute |
| `x-ratelimit-remaining` | Requests remaining in the current window |
| `x-ratelimit-reset` | Unix timestamp when the current window resets |
| `retry-after` | Seconds to wait before retrying, present on `429` responses |

### Retry Guidance

- On `429`, wait for the `Retry-After` value before retrying.
- With the current 1-minute window, the delay is typically `60` seconds.
- Do not retry immediately on every `429`, or the client will continue to be rate limited.

## Per-IP Semantics

Rate limiting is isolated per client IP address.

Example with `maxPerMinute: 300`:

- Client A sends 300 requests in one minute: request 301 receives `429`
- Client B sends its first request during the same minute: it is evaluated against Client B's own counter, not Client A's

If Butler SOS is deployed behind a reverse proxy or load balancer, verify which source IP Butler SOS sees. That IP is what the rate limiter uses.

## Relationship To Queue Rate Limiting

The HTTP rate limiter is separate from the internal queue throughput limiter.

| Layer | Mechanism | Config Path | Scope |
| ----- | --------- | ----------- | ----- |
| HTTP | Fastify rate-limit plugin | `Butler-SOS.auditEvents.rateLimit` | Per IP |
| Queue | `UdpQueueManager.RateLimiter` | `Butler-SOS.auditEvents.queue.rateLimit` | Global |

The HTTP limiter controls how quickly clients can call the API. The queue limiter controls how quickly Butler SOS processes accepted audit events internally.

## Disabling The HTTP Rate Limiter

To disable HTTP rate limiting:

```yaml
Butler-SOS:
  auditEvents:
    rateLimit:
      enable: false
      maxPerMinute: 300
```

This is generally not recommended for production deployments.

## Tuning Guidance

Increase `maxPerMinute` if:

- Multiple users share the same public IP
- Multiple browser tabs or test clients legitimately burst traffic
- You observe expected usage patterns hitting `429`

Decrease `maxPerMinute` if:

- You need stricter abuse protection
- The Audit Events API is exposed to a wider network surface

## Related Topics

- [Audit Events API](./audit-events-api)
- [Audit.qs Version Compatibility](./audit-qs-version-compatibility)