---
outline: deep
---

# Audit Screenshots

Use this page to enable Butler SOS screenshot downloads for Audit.qs.

This setup flow is mainly relevant for Qlik Sense Enterprise on Windows and other client-managed environments where Butler SOS must redeem screenshot URLs through QPS.

## What This Feature Does

When Audit.qs emits a `screenshot.url.received` event, Butler SOS can download the referenced image and store it alongside the rest of the audit data.

This is useful when you want the audit trail to include the actual rendered visualization image, not just the event metadata.

## Before You Start

Make sure all of the following are true:

1. Butler SOS is already connected to Qlik Sense.
2. Qlik client certificates are configured as described in [Sense Server Settings](./sense-server-settings).
3. Audit.qs sends a parseable Qlik user identity in `payload.context.user` if you plan to use `auth.mode: userTicket`.
4. You know every hostname that can appear in the screenshot download path, including reverse proxies and redirected backend hosts.

## Recommended Configuration

For client-managed Qlik Sense, `userTicket` is the recommended mode when screenshot access is tied to the actual end user.

```yaml
Butler-SOS:
  auditEvents:
    destination:
      screenshots:
        enable: true
        allowedImageDownloadHosts:
          - qlik.example.com
          - qlik-proxy.example.com
          - qlik-node-1.example.com
        auth:
          mode: userTicket
          qps:
            host: qlik.example.com
            port: 4243
            ticketTimeoutMs: 5000
          sessionCache:
            enable: true
            ttlSeconds: 120
            maxEntries: 100
```

## Choosing `userTicket`

Use `auth.mode: userTicket` when:

- the screenshot must be fetched as the end user who triggered the event
- the Qlik identity can be parsed into `userDirectory` and `userId`
- Butler SOS can call QPS using mutual TLS

Do not use `userTicket` when the event identity is only an email address or another non-QPS-compatible user format.

## Allowed Download Hosts

`allowedImageDownloadHosts` is mandatory for safe screenshot downloads.

Add:

- the hostname in the original `screenshotUrl`
- every hostname used by intermediate redirects
- each legitimate reverse proxy or Qlik backend node that may return the image

If Butler SOS logs `redirect blocked reason=host-not-allowed`, inspect the redirect `Location` header value and add that hostname if it belongs to your Qlik environment.

## Verification Checklist

After configuring screenshot downloads:

1. Trigger an audited screenshot event in Audit.qs.
2. Verify that Butler SOS writes the screenshot file to the expected destination.
3. Confirm that no redirect or auth warnings appear in the Butler SOS logs.
4. If redirects are involved, verify that all hosts in the chain are allow-listed.

## Common Failures

| Symptom | Likely Cause |
| ------- | ------------ |
| Screenshot skipped in `userTicket` mode | `payload.context.user` could not be parsed |
| Redirect blocked | Missing hostname in `allowedImageDownloadHosts` |
| QPS ticket request fails | Certificate or QPS connectivity problem |
| Blank or wrong screenshot with fixed credentials | The screenshot URL is user-scoped and should use `userTicket` |

## Next Step

For the detailed runtime rules, see [Screenshot Downloads](../../reference/audit-destinations/png/downloads).