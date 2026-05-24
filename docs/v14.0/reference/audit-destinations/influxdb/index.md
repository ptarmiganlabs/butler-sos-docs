---
outline: deep
---

# InfluxDB Destination

The InfluxDB destination stores audit event metadata as time-series data points.

Each accepted audit event is mapped to tags and fields and written to a single configured audit measurement.

## How It Is Enabled

Enable the InfluxDB audit destination by including `influxdb` in `Butler-SOS.auditEvents.destination.type` and configuring `Butler-SOS.auditEvents.destination.influxdb.metadata`.

```yaml
Butler-SOS:
  auditEvents:
    destination:
      enable: true
      type: influxdb
      influxdb:
        metadata:
          host: 10.11.12.13
          port: 8181
          version: 3
          maxBatchSize: 1000
          writeFrequency: 20000
          measurementName: audit_event
```

## Write Behavior

The InfluxDB destination is buffered.

- `maxBatchSize` controls how many points are written in one batch.
- `writeFrequency` controls how often buffered points are flushed.

If a batch write fails, Butler SOS retries with progressively smaller chunks before returning failed points to the buffer for later retry.

## What Is Stored

InfluxDB stores audit event metadata as tags and fields, including:

- envelope identifiers such as `eventId` and `correlationId`
- event type and timestamps
- app, sheet, and user context
- event-specific fields such as screenshot URLs or viewing duration

If `payload.event.objectData` is present, Butler SOS stores it as a JSON-stringified field in the InfluxDB event point.

## Object Data Note

InfluxDB does not create a separate dedicated object-data output.

If you need one JSON file per `objectData` payload, use the [JSON destination](/v14.0/reference/audit-destinations/json/) in addition to InfluxDB.

## Related Topics

- [Audit Event Destinations](/v14.0/reference/audit-destinations/)
- [JSON Destination](/v14.0/reference/audit-destinations/json/)