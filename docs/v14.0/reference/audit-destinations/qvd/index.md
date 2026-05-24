---
outline: deep
---

# QVD Destination

The QVD destination stores audit event metadata as QVD files.

This makes it possible to load audit data directly into Qlik Sense apps for analysis and reporting.

## How It Is Enabled

Enable the QVD destination by including `qvd` in `Butler-SOS.auditEvents.destination.type` and configuring `Butler-SOS.auditEvents.destination.qvd.metadata`.

```yaml
Butler-SOS:
  auditEvents:
    destination:
      enable: true
      type: qvd
      qvd:
        metadata:
          exportDirectory: ./audit-events/qvd
          maxBatchSize: 1000
          writeFrequency: 20000
```

## Write Behavior

The QVD destination is buffered.

- `maxBatchSize` flushes the buffer when enough rows have accumulated.
- `writeFrequency` flushes the buffer on a timer.

Rows are written to date-partitioned QVD files with incrementing part numbers.

## What Is Stored

Each QVD row represents one accepted audit event and includes envelope, context, and event-specific fields.

If `payload.event.objectData` is present, Butler SOS stores it in the metadata row. It does not create a separate dedicated object-data dataset for QVD.

## Related Topics

- [Audit Event Destinations](/v14.0/reference/audit-destinations/)
- [JSON Object Data](/v14.0/reference/audit-destinations/json/object-data)