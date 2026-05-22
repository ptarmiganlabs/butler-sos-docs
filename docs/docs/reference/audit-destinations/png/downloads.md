---
outline: deep
---

# Screenshot Downloads

Butler SOS can download screenshot URLs emitted by Audit.qs and save the resulting image files to enabled destinations.

This page documents the runtime contract for screenshot downloads: authentication, user identity parsing, redirect handling, session reuse, and failure behavior.

## Scope

This page applies to audit events of type `screenshot.url.received`.

It focuses on the screenshot-specific configuration under `Butler-SOS.auditEvents.destination.screenshots`.

## Authentication Modes

Screenshot downloads support the same general download flow regardless of destination, but the authentication behavior depends on the configured mode.

### `auth.mode: userTicket`

Use `userTicket` when:

- Audit.qs runs against Qlik Sense Enterprise on Windows or another client-managed deployment
- `payload.context.user` contains a parseable Qlik identity
- Butler SOS has Qlik client certificates for mutual TLS to QPS
- The screenshot URL uses the same Qlik route that the browser used to render the image

Do not use `userTicket` for Qlik Cloud-only identities that resolve to email addresses without `userDirectory` and `userId`.

### `auth.mode: qpsTicket`

Fixed QPS ticket mode follows the same redirect and session-cache rules described on this page where noted, but it does not derive the ticket from the event user identity.

## Minimal Configuration

```yaml
Butler-SOS:
  auditEvents:
    destination:
      screenshots:
        enable: true
        allowedImageDownloadHosts:
          - qlik.example.com
          - qlik-proxy.example.com
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

## User Identity Contract

For `userTicket`, Butler SOS expects the full Qlik identity in `payload.context.user`.

Example event fragment:

```json
{
  "payload": {
    "context": {
      "user": "UserDirectory=LAB; UserId=john.doe"
    },
    "event": {
      "screenshotUrl": "https://qlik.example.com/analytics/tempcontent/abc/screenshot.png"
    }
  }
}
```

Butler SOS keeps these values distinct:

| Field | Meaning |
| ----- | ------- |
| `user` | Full identity string from Qlik Sense |
| `userDirectory` | Parsed directory component |
| `userId` | Parsed user ID component |

If `userTicket` cannot parse the user identity, Butler SOS logs a warning and skips that screenshot download. It does not fall back to fixed `qpsTicket` credentials.

## Virtual Proxy Derivation

For `userTicket`, Butler SOS derives the QPS virtual proxy from the screenshot URL path.

Examples:

- `https://qlik.example.com/analytics/tempcontent/abc/screenshot.png` maps to `/qps/analytics/ticket`
- `https://qlik.example.com/tempcontent/abc/screenshot.png` maps to `/qps/ticket`

The original screenshot URL is the authoritative source for route selection.

## Redirect Handling And Allowed Hosts

Butler SOS handles screenshot redirects manually. It does not let the HTTP client follow redirects automatically.

Redirects are followed only when all of the following are true:

- The response status is `301`, `302`, `303`, `307`, or `308`
- A valid `Location` header is present
- The redirected URL resolves to `http:` or `https:`
- Every hostname in the redirect chain is listed in `allowedImageDownloadHosts`
- The redirect chain does not exceed the configured redirect limit

### Allowed Host Rule

The original screenshot host and every redirected hostname must appear in `allowedImageDownloadHosts`.

Example:

```text
https://qlik.example.com/screenshot.png
  -> https://proxy.example.com/redirected/screenshot.png
  -> https://node1.example.com/tempcontent/screenshot.png
```

Required configuration:

```yaml
Butler-SOS:
  auditEvents:
    destination:
      screenshots:
        allowedImageDownloadHosts:
          - qlik.example.com
          - proxy.example.com
          - node1.example.com
```

Use hostnames only. Do not include schemes, ports, paths, or full URLs.

If a redirect is relative, the hostname does not change and no extra host entry is needed.

## Session Cache

`auth.sessionCache` works with both `userTicket` and `qpsTicket`.

Butler SOS does not cache one-use QPS tickets. It caches only the redeemed Qlik session cookie returned by the screenshot download flow.

On cache hit, Butler SOS sends the cached session cookie directly. On cache miss, it requests a fresh ticket and stores the returned session cookie when caching is enabled.

Cache entries are separated by:

- auth mode
- QPS host and port
- virtual proxy
- user directory
- user ID

For `userTicket`, this means each end user gets an isolated cached session.

If Qlik Sense rejects a cached session with `401` or `403`, Butler SOS removes that session from memory and retries with a fresh QPS ticket.

## Redirects With Qlik Session Cookies

When the first request redeems a QPS ticket, Qlik Sense may return a session cookie such as `X-Qlik-Session-*`.

If that happens on a redirect response, Butler SOS carries that cookie forward to the next allowed hop. This matters because QPS tickets are single-use and should not be reused on the redirected request.

For `userTicket`, redirect targets are checked against `allowedImageDownloadHosts`, but redirect targets are not used to choose a different QPS ticket endpoint.

## Runtime Flow

1. Butler SOS receives a `screenshot.url.received` event.
2. It parses `payload.context.user` when `auth.mode` is `userTicket`.
3. It checks the session cache for the current auth mode, virtual proxy, and user.
4. On cache miss, it requests a QPS ticket over mutual TLS.
5. It redeems that ticket against the screenshot URL or sends the cached session cookie.
6. It validates each redirect hop before continuing.
7. It downloads the screenshot and writes the file to enabled destinations.
8. It stores or invalidates the resulting Qlik session cookie according to cache behavior.

## Troubleshooting

If screenshot downloads fail, check these first:

- The original screenshot hostname is listed in `allowedImageDownloadHosts`
- All redirect hosts are listed in `allowedImageDownloadHosts`
- The user identity in `payload.context.user` is parseable
- Butler SOS has working Qlik client certificates for QPS access
- The screenshot URL uses the expected virtual proxy path

Common warning patterns:

- `redirect blocked reason=host-not-allowed`: add the redirected hostname if it is a legitimate Qlik or reverse-proxy host
- user parsing warnings in `userTicket` mode: verify that Audit.qs sends a full Qlik identity string
- repeated `401` or `403` after cache hits: inspect session expiry and QPS connectivity

## Related Topics

- [Audit Events API](/docs/reference/audit-events-api)
- [Audit Screenshots Setup](/docs/getting-started/setup/audit-screenshots)
- [Connecting to a Qlik Sense Server](/docs/getting-started/setup/sense-server-settings)