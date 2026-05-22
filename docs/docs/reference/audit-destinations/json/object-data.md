---
outline: deep
---

# JSON Object Data

Butler SOS can write `payload.event.objectData` from Audit.qs events to individual JSON files on disk.

This page documents the current behavior of that destination: when files are created, how the destination is configured, and how it relates to the other audit destinations.

## What This Destination Writes

The JSON object-data destination writes one JSON file per accepted audit event when the event contains `payload.event.objectData`.

Events without `objectData` are skipped by this destination.

The resulting file contains the event context together with the raw `objectData` payload captured from the visualization.

## How To Enable It

The JSON object-data writer is configured under `Butler-SOS.auditEvents.destination.json.objectdata`.

It is active only when:

- `Butler-SOS.auditEvents.destination.enable` is `true`
- `Butler-SOS.auditEvents.destination.type` includes `json`
- `Butler-SOS.auditEvents.destination.json.objectdata.enable` is `true`

Example:

```yaml
Butler-SOS:
  auditEvents:
    destination:
      enable: true
      type: influxdb, parquet, qvd, json

      json:
        objectdata:
          enable: true
          exportDirectory: ./audit-events/json
          staticTags:
            - name: env
              value: production
            - name: datacenter
              value: eu-north-1
```

## Configuration Properties

| Property | Default | Description |
| -------- | ------- | ----------- |
| `enable` | none | Enable or disable the JSON object-data destination |
| `exportDirectory` | `audit-events/json` | Directory where JSON files are written |
| `staticTags` | `null` | Optional key-value tags added to each JSON file |

## Write Behavior

This destination writes each event immediately.

It does not use buffering settings such as `maxBatchSize` or `writeFrequency`. Those settings are not part of the JSON `objectdata` destination.

## File Naming And Correlation

JSON object-data files use the same correlation keys as the rest of the audit pipeline.

The file name is based on the event timestamp, `eventId`, and `correlationId`, for example:

```text
20260308T164626.181Z_165c9558-abcd-1234-a1b2-cc12e5aa9f01_cc12e5aa-beef-4321-9876-abcdef012345.json
```

This makes it easy to match the JSON file with:

- the original audit event
- related screenshot files
- metadata rows written to other audit destinations

## Relationship To Other Audit Destinations

The dedicated `objectdata` writer is currently implemented for the `json` destination.

Other audit destinations behave differently:

- `influxdb` stores `objectData` as a JSON-stringified metadata field when present
- `parquet` stores `objectData` in the metadata row when present
- `qvd` stores `objectData` in the metadata row when present

Those destinations do not create a separate dedicated object-data output file or dataset.

## Example File Shape

The file contains event metadata plus the raw object payload.

```json
{
  "eventId": "165c9558-abcd-1234-a1b2-cc12e5aa9f01",
  "correlationId": "cc12e5aa-beef-4321-9876-abcdef012345",
  "timestamp": "2026-03-08T16:46:26.181Z",
  "eventType": "screenshot.url.received",
  "appId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "objectId": "obj123",
  "objectType": "barchart",
  "screenshotUrl": "https://qliksense.company.com/.../screenshot.png",
  "objectData": {
    "schemaVersion": 1,
    "objectType": "barchart",
    "dimensions": [],
    "measures": []
  },
  "tags": {
    "env": "production"
  }
}
```

## Operational Notes

- If `payload.event.objectData` is absent, this destination produces no file for that event.
- If `objectData` is present, Butler SOS writes the received payload as-is for this destination.
- If you need the raw visualization payload in a dedicated file format, use the `json` destination rather than relying on metadata fields in the other destinations.

## Related Topics

- [Audit Events API](/docs/reference/audit-events-api)
- [Audit.qs Version Compatibility](/docs/reference/audit-qs-version-compatibility)
- [PNG Screenshot Downloads](/docs/reference/audit-destinations/png/downloads)