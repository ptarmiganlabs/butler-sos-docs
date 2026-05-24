---
outline: deep
---

# PNG Destination

The PNG destination downloads screenshot images referenced by `screenshot.url.received` events and stores them on disk.

Unlike the metadata destinations, PNG screenshots are configured under `Butler-SOS.auditEvents.destination.screenshots` rather than through `auditEvents.destination.type`.

## How It Is Enabled

Enable screenshot downloads with `Butler-SOS.auditEvents.destination.screenshots.enable=true` and configure at least the storage targets and allowed download hosts.

```yaml
Butler-SOS:
  auditEvents:
    destination:
      screenshots:
        enable: true
        allowedImageDownloadHosts:
          - qliksense.company.com
```

## What It Stores

The PNG destination stores screenshot image files downloaded from the screenshot URLs carried by audit events.

These files can be correlated with:

- the original audit event via `eventId`
- JSON object-data files via the shared file-naming model
- metadata rows written to InfluxDB, Parquet, or QVD

## Authentication And Security

Screenshot downloads support the following authentication modes:

- `none`
- `qpsTicket`
- `userTicket`

Downloads are also protected by `allowedImageDownloadHosts`, which constrains which hostnames Butler SOS may contact when retrieving screenshots.

## Detailed Page

Use the detailed child page for authentication, redirect handling, session reuse, and troubleshooting:

- [Screenshot Downloads](/v15.0/reference/audit-destinations/png/downloads)

## Related Topics

- [Audit Event Destinations](/v15.0/reference/audit-destinations/)
- [JSON Destination](/v15.0/reference/audit-destinations/json/)
- [Audit Screenshots Setup](/v15.0/getting-started/setup/audit-screenshots)