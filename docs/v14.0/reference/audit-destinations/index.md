---
outline: deep
---

# Audit Event Destinations

Butler SOS can write accepted Audit.qs events to one or more destinations.

Some destinations store event metadata. Others store richer artifacts such as raw object data or rendered screenshots.

## Destination Overview

| Destination | What It Stores | How It Is Enabled | Best For |
| ----------- | -------------- | ----------------- | -------- |
| [InfluxDB](/v14.0/reference/audit-destinations/influxdb/) | Audit event metadata as time-series points | `auditEvents.destination.type` includes `influxdb` | Dashboards, alerting, and operational analysis |
| [JSON](/v14.0/reference/audit-destinations/json/) | Dedicated JSON files for `payload.event.objectData` | `auditEvents.destination.type` includes `json` and `json.objectdata.enable=true` | Searchable raw object data and event correlation |
| [Parquet](/v14.0/reference/audit-destinations/parquet/) | Audit event metadata as columnar Parquet files | `auditEvents.destination.type` includes `parquet` | Batch analytics with DuckDB, Spark, or Pandas |
| [PNG](/v14.0/reference/audit-destinations/png/) | Screenshot image files downloaded from Qlik Sense URLs | `auditEvents.destination.screenshots.enable=true` | Visual audit trails and screenshot retention |
| [QVD](/v14.0/reference/audit-destinations/qvd/) | Audit event metadata as QVD files | `auditEvents.destination.type` includes `qvd` | Loading audit data into Qlik Sense apps |

## Destination Model

Audit destinations use two patterns:

- **Metadata destinations** write one logical row or point per event. This includes InfluxDB, Parquet, and QVD.
- **Artifact destinations** write dedicated files derived from the event payload. This includes JSON object-data files and PNG screenshots.

## Buffering Model

Not all destinations write data the same way:

- **Buffered destinations**: InfluxDB, Parquet, and QVD use `maxBatchSize` and `writeFrequency` settings in their metadata config.
- **Immediate-write destinations**: JSON object-data files and PNG screenshots are written per event and do not use buffered destination settings.

## Object Data Behavior Across Destinations

`payload.event.objectData` is handled differently depending on destination:

- The [JSON destination](/v14.0/reference/audit-destinations/json/) can write a dedicated JSON file for the raw object-data payload.
- InfluxDB, Parquet, and QVD store `objectData` in their metadata output when it is present, but do not create a separate dedicated object-data dataset.

## Screenshot Behavior

Screenshot downloads are configured separately from `auditEvents.destination.type`.

The [PNG destination](/v14.0/reference/audit-destinations/png/) uses `auditEvents.destination.screenshots` settings such as authentication mode, allowed download hosts, and storage targets.

## Related Topics

- [Audit Events API](/v14.0/reference/audit-events-api)
- [Audit Events Rate Limiting](/v14.0/reference/audit-events-rate-limiting)
- [Audit.qs Version Compatibility](/v14.0/reference/audit-qs-version-compatibility)