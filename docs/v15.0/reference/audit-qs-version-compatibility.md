---
outline: deep
---

# Audit.qs Version Compatibility

Butler SOS and Audit.qs are released independently. Butler SOS therefore keeps a compatibility matrix so it can detect incompatible Audit.qs versions before accepting or processing events.

This page documents that compatibility behavior for both connection tests and live event ingestion.

> Applies to Butler SOS 15.0.0 and later.

## How Version Detection Works

Audit.qs sends its version to Butler SOS using the `X-Audit-QS-Version` header. For audit event ingestion, Butler SOS can also fall back to the version embedded in the event envelope.

Butler SOS compares that version to its internal compatibility matrix and responds accordingly.

If multiple `X-Audit-QS-Version` header values are received, Butler SOS normalizes them to a single value before compatibility evaluation.

## GET /api/v1/test-connection

When Audit.qs runs its connection test, Butler SOS can evaluate compatibility immediately.

If version metadata is included, the response may include these fields:

| Field | Type | Meaning |
| ----- | ---- | ------- |
| `butlerSosVersion` | string | Running Butler SOS version |
| `auditQsVersion` | string or `null` | Audit.qs version received from the client |
| `compatible` | boolean | Whether the two versions are considered compatible |

If the versions are incompatible, Audit.qs can warn the user even though the endpoint itself is reachable.

## POST /api/v1/audit-event

Butler SOS checks version compatibility before processing an incoming audit event.

Behavior:

- Compatible version: event is accepted and processed normally
- Incompatible version: event is dropped with `422 Unprocessable Content`
- No version provided: Butler SOS accepts the event for backward compatibility, but logs a warning recommending an upgrade

This means not every `422` is a payload validation error. Some `422` responses are caused by version incompatibility.

## When Version Metadata Is Missing

Older or misconfigured Audit.qs clients may omit `X-Audit-QS-Version`.

Butler SOS accepts those events for backward compatibility, but it also records the missing version information in the logs:

- each missing-version event can be logged at `debug` level for per-event troubleshooting
- `warn` messages are rate-limited to once per source IP per minute
- each aggregated warning includes a `missingVersionCount` counter so operators can see the volume of affected events

This keeps missing-version events visible without flooding the logs in high-volume environments.

## Compatibility Matrix

The matrix uses semver ranges.

| Butler SOS version range | Compatible Audit.qs version range |
| ------------------------ | --------------------------------- |
| `>=15.0.0 <16.0.0` | `>=0.3.0 <0.4.0` |

This allows patch and minor releases to stay compatible without updating the matrix for every release.

## Operational Guidance

If Butler SOS logs that events were dropped because of an incompatible Audit.qs version:

1. Check the Butler SOS version in use.
2. Check the deployed Audit.qs extension version.
3. Compare both versions to the compatibility matrix.
4. Upgrade the component that falls outside the supported range.

If the connection test in Audit.qs warns about compatibility:

1. Note the Butler SOS version shown by the server.
2. Note the Audit.qs version reported by the client.
3. Upgrade the out-of-range component.

## Backward Compatibility

Butler SOS accepts requests without version metadata to allow staged upgrades, but operators should still treat missing version information as something to investigate.

## Related Topics

- [Audit Events API](./audit-events-api)
- [Audit Events Rate Limiting](./audit-events-rate-limiting)
- [JSON Object Data](./audit-destinations/json/object-data)