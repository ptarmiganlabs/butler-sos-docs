---
outline: deep
---

# Parquet Destination

The Parquet destination stores audit event metadata as columnar Parquet files.

This format is useful when audit events should be analyzed with tools such as DuckDB, Pandas, or Spark.

## How It Is Enabled

Enable the Parquet destination by including `parquet` in `Butler-SOS.auditEvents.destination.type` and configuring `Butler-SOS.auditEvents.destination.parquet.metadata`.

```yaml
Butler-SOS:
  auditEvents:
    destination:
      enable: true
      type: parquet
      parquet:
        metadata:
          exportDirectory: ./audit-events/parquet
          maxBatchSize: 1000
          writeFrequency: 20000
```

## Write Behavior

The Parquet destination is buffered.

- `maxBatchSize` flushes the buffer when enough rows have accumulated.
- `writeFrequency` flushes the buffer on a timer.

Rows are written to date-partitioned Parquet files with incrementing part numbers.

## What Is Stored

Each Parquet row represents one accepted audit event and includes:

- envelope identifiers and timestamps
- context fields such as app, sheet, and user
- event-specific fields such as screenshot URLs, durations, or selection details
- optional static tags from the destination config

If `payload.event.objectData` is present, Butler SOS stores it in the metadata row. It does not create a separate dedicated object-data dataset for Parquet.

## Related Topics

- [Audit Event Destinations](/docs/reference/audit-destinations/)
- [JSON Object Data](/docs/reference/audit-destinations/json/object-data)