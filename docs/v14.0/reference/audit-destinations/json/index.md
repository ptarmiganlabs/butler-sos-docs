---
outline: deep
---

# JSON Destination

The JSON destination writes dedicated JSON files for `payload.event.objectData`.

This is the only audit destination that currently produces a separate object-data artifact rather than storing `objectData` only as part of a metadata row or point.

## How It Is Enabled

The JSON destination is active when all of the following are true:

- `Butler-SOS.auditEvents.destination.enable` is `true`
- `Butler-SOS.auditEvents.destination.type` includes `json`
- `Butler-SOS.auditEvents.destination.json.objectdata.enable` is `true`

```yaml
Butler-SOS:
  auditEvents:
    destination:
      enable: true
      type: json
      json:
        objectdata:
          enable: true
          exportDirectory: ./audit-events/json
```

## Write Behavior

The JSON destination writes each event immediately.

It does not use buffered-destination settings such as `maxBatchSize` or `writeFrequency`.

## What It Stores

For each event that contains `payload.event.objectData`, Butler SOS writes one JSON file containing:

- event identifiers and timestamps
- app and object context
- optional screenshot correlation fields
- the raw `objectData` payload captured from the visualization

Events without `objectData` are skipped by this destination.

## Detailed Page

Use the detailed child page for file naming, example payload shape, and cross-destination correlation details:

- [Object Data](/v14.0/reference/audit-destinations/json/object-data)

## Related Topics

- [Audit Event Destinations](/v14.0/reference/audit-destinations/)
- [PNG Destination](/v14.0/reference/audit-destinations/png/)