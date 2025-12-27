---
outline: deep
---

# Audit Events

::: info
The **Butler SOS Audit Extension** is currently in development and has not yet been publicly released. The audit-related APIs and storage features in Butler SOS server are the first step towards this upcoming release.
:::

Butler SOS can receive audit events from the **Butler SOS Audit** Qlik Sense extension and (optionally) store those events in a dedicated destination.

::: tip
The audit extension is designed for client-managed Qlik Sense, also known as **Qlik Sense Enterprise on Windows**.
:::

Audit events are intended for questions like:

- Who looked at what, when?
- For how long was an object visible?
- Which screenshots on disk belong to a specific audit event?

## How it works

1. The Qlik Sense extension sends audit event envelopes to Butler SOS over HTTP (Butler SOS audit API `/api/v1/audit-event` endpoint).
2. Butler SOS validates and queues the events.
3. Butler SOS optionally writes the event to the configured audit storage destination.
   - Audit data is stored in a dedicated destination, separate from the main metrics.
   - InfluxDB is currently the only supported destination, but others (PostgreSQL, MongoDB, MQTT, webhooks etc.) may be added in the future.
4. For screenshot events, Butler SOS can download screenshots to disk and store the saved file paths alongside the audit event. This screen shot shows _EXACTLY_ what the user saw in their browser at that moment in time.

## Correlation & Forensics

A key feature of the audit system is the ability to correlate user actions (selections) with the resulting visual state (screenshots).

### `selectionTxnId`

The Qlik Sense extension generates a unique `selectionTxnId` for every logical selection transaction. This ID is included in:

- `selection.state.changed` events.
- `app.model.validated` events (when Qlik finishes calculating the new state).
- `screenshot.url.received` events.

In InfluxDB, this is stored as the `selectionTxnId` tag, allowing you to query all events related to a single user interaction.

### Deterministic Screenshots

When Butler SOS downloads a screenshot, it uses a deterministic naming convention:
`[timestamp]_[eventId]_[correlationId].png`

The `correlationId` in the filename usually matches the `selectionTxnId`, making it easy to find the exact image on disk that corresponds to a record in InfluxDB.

## Screenshot Examples

Butler SOS can optionally burn metadata directly into the downloaded screenshots. This makes the images self-documenting and tamper-evident.

### Without Metadata

![Screenshot without metadata](/img/audit/20251227T054606.919Z_db277423-1291-456e-8333-aa772e50703b_0346f48f-0abb-4786-b1ce-52f8672f6a1b.png)

### With Metadata

![Screenshot with metadata](/img/audit/20251227T054606.919Z_db277423-1291-456e-8333-aa772e50703b_0346f48f-0abb-4786-b1ce-52f8672f6a1b_metadata.png)

## Visualizing Audit Data in Grafana

You can use Grafana to build a forensic trail of user activity.

### Sample Flux Query (InfluxDB v2/v3)

This query retrieves all audit events for a specific selection transaction, showing the sequence from selection to validation to screenshot.

```flux
from(bucket: "butler-audit")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "audit_event")
  |> filter(fn: (r) => r["selectionTxnId"] == "your-transaction-id-here")
  |> sort(columns: ["_time"])
```

![Grafana Audit Dashboard](/img/todo.svg)
_TODO: Add screenshot of a Grafana dashboard showing the audit trail_

## Configuration

Audit events are configured under `Butler-SOS.auditEvents`.

::: tip
Audit events use a dedicated destination config under `Butler-SOS.auditEvents.destination.*`.
This is separate from user/log events destinations (for example `Butler-SOS.userEvents.*`, `Butler-SOS.logEvents.*`) and separate from metrics destinations such as `Butler-SOS.influxdbConfig`.
:::

### Enable the audit events API

```yaml
Butler-SOS:
  auditEvents:
    enable: true
    host: butler-sos-audit.mycompany.net
    port: 3000
    apiToken: "replace-with-strong-token"
```

### Store audit events in InfluxDB

Audit data is intentionally configured **separately** from `Butler-SOS.influxdbConfig`, so you can store audit data in a different InfluxDB instance/version/bucket/database than other Butler SOS metrics.

```yaml
Butler-SOS:
  auditEvents:
    destination:
      enable: true
      type: influxdb
      influxdb:
        host: 127.0.0.1
        port: 8086
        version: 2
        measurementName: audit_event
        auditEventSchemaVersion: "1"
        staticTags:
          - name: env
            value: prod

        v2Config:
          org: my-org
          bucket: butler-audit
          description: "Audit events bucket"
          token: "replace-with-token"
          retentionDuration: 0s

        # v1Config/v3Config are used when version is 1/3
```

| Setting                                           | Description                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| `destination.enable`                              | Enable/disable writing audit events to destinations                   |
| `destination.type`                                | Destination type (`influxdb`)                                         |
| `destination.influxdb.version`                    | InfluxDB version (1, 2, or 3)                                         |
| `destination.influxdb.measurementName`            | Single measurement used for all audit events (default: `audit_event`) |
| `destination.influxdb.auditEventSchemaVersion`    | Written as tag `auditEventSchemaVersion`                              |
| `destination.influxdb.staticTags`                 | Optional static tags added to every point                             |
| `destination.influxdb.v2Config.description`       | InfluxDB v2 bucket description (used when auto-creating the bucket)   |
| `destination.influxdb.v2Config.retentionDuration` | InfluxDB v2 bucket retention duration                                 |

## InfluxDB measurement schema

Audit events are written to a single measurement (default: `audit_event`).

### Tags

- `appId`
- `appName`
- `eventType`
- `eventId`
- `correlationId`
- `selectionTxnId` (when present)
- `userId` (when present)
- `auditEventSchemaVersion`

### Fields

- `sheetId` (when present)
- `sheetName` (when present)
- `objectId` (when present)
- `durationMs` (when present)
- `visible` (when present)
- `screenshotUrl` (when present)
- `screenshotSavedPaths` (JSON string array, when screenshots were saved)

## Screenshot correlation

Screenshot files are saved using a deterministic filename that includes both `eventId` and `correlationId`.

When screenshots are downloaded by Butler SOS, the saved file paths are also written into InfluxDB as `screenshotSavedPaths` (field). This makes it possible to jump from an audit event in Grafana to the corresponding screenshot file on disk.
