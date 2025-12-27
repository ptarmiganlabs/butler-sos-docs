---
outline: deep
---

# Audit Events Setup

::: info
The **Butler SOS Audit Extension** is not yet publicly released. The server-side configuration described here prepares Butler SOS to receive data once the extension becomes available.
:::

This guide describes how to configure Butler SOS to receive and store audit events from the **Butler SOS Audit** Qlik Sense extension.

::: tip
The audit extension is designed for client-managed Qlik Sense, also known as **Qlik Sense Enterprise on Windows**.
:::

## Prerequisites

1.  **Butler SOS Audit Extension**: Imported into Qlik Sense and added to the relevant sheets.
2.  **HTTPS**: If your Qlik Sense environment uses HTTPS (which is standard), the audit API **must** be accessible via HTTPS. Browsers will block "mixed content" (HTTP calls from an HTTPS page). This can be achieved by:
    - Configuring Butler SOS to serve the API over HTTPS directly (see below).
    - Using a TLS-terminating reverse proxy (e.g., Nginx, Traefik, or an F5) in front of Butler SOS. In this case, Butler SOS can still use HTTP internally.

## 1. Enable the Audit API

In your `production.yaml` (or equivalent), enable the audit events feature:

```yaml
Butler-SOS:
  auditEvents:
    enable: true
    host: butler-sos-audit.mycompany.net # IP/FQDN to bind to. Use 0.0.0.0 to listen on all interfaces.
    port: 8181
    apiToken: "your-secure-token-here" # Recommended: set a strong token and configure the same token in the extension.
```

- **`apiToken`**: This token must match the one configured in the Qlik Sense extension. It is sent as a Bearer token in the `Authorization` header.

## 2. Configure CORS

Since the Qlik Sense extension makes calls from the Qlik Sense domain to the Butler SOS domain, you must configure Cross-Origin Resource Sharing (CORS).

```yaml
Butler-SOS:
  auditEvents:
    cors:
      allowedOrigins:
        - "https://qliksense.yourcompany.com" # Note: browsers send an unauthenticated OPTIONS preflight before the real POST.
```

::: warning
Using `allowedOrigins: ["*"]` is useful for initial testing but should be restricted to your actual Qlik Sense FQDN in production.
:::

## 3. Configure HTTPS (TLS)

If you are not using a reverse proxy to handle TLS termination, you can configure Butler SOS to serve the audit API over HTTPS directly:

```yaml
Butler-SOS:
  auditEvents:
    tls:
      enable: true
      cert: /path/to/server.crt # Path to the server certificate file
      key: /path/to/server.key # Path to the server private key file
```

::: tip
If you use a self-signed certificate, you must ensure the browser trusts it (e.g., by importing the CA into your OS trust store).
:::

## 4. Configure InfluxDB Destination

Audit data is stored in a dedicated InfluxDB destination, separate from the main metrics.

::: info Future Destinations
While InfluxDB is currently the only supported destination for audit data, support for other destinations (such as PostgreSQL, MongoDB, MQTT, or generic HTTP webhooks) may be added in the future.
:::

```yaml
Butler-SOS:
  auditEvents:
    destination:
      enable: true # Set to true to store incoming audit events in one or more destinations.
      type: influxdb # Future-proofing: additional destination types may be added later.
      influxdb:
        host: localhost
        port: 8086
        version: 2 # 1 | 2 | 3
        measurementName: audit_event # Single measurement for all audit events.
        v2Config:
          org: my-org
          bucket: butler-audit
          token: "your-influx-token"
```

## 5. Configure Screenshot Downloads

Butler SOS can download screenshots referenced in audit events and store them locally as image files.

The screen shots are stored both as they appear in the Sense app, and with added metadata (event ID, user ID, timestamp etc.).

```yaml
Butler-SOS:
  auditEvents:
    screenshots:
      enable: true # Optional: download screenshots referenced by screenshot.url.received events.
      storageTargets:
        - enable: true
          type: flat
          directory: screenshots/audit
      addInImageMetadata:
        date: true # Burn UTC and server-local time into the image
        eventId: true # Burn the audit event ID into the image
        correlationId: true # Burn the correlation ID into the image
        selectionTxnId: true # Burn the selection transaction ID into the image
        userId: true # Burn the user ID into the image
        appId: true # Burn the app ID into the image
        appName: true # Burn the app name into the image
        sheetName: true # Burn the sheet name into the image
```

### Authentication for Screenshots

If Qlik Sense requires authentication to download images, configure the QPS authentication:

```yaml
Butler-SOS:
  auditEvents:
    screenshots:
      auth:
        mode: qpsTicket # none | qpsTicket
        qps:
          host: qliksense.yourcompany.com # Qlik Proxy Service host for ticket requests
          port: 4243 # Qlik Proxy Service port (default: 4243)
          userDirectory: YOURDOMAIN # User directory for the ticket request
          userId: service-user # User ID for the ticket request
          ticketTimeoutMs: 5000 # Timeout for the ticket request
```

## 6. Message Queue & Rate Limiting

Butler SOS uses an internal message queue to handle incoming audit events. This ensures that a sudden burst of events doesn't overwhelm the server or the destination database.

```yaml
Butler-SOS:
  auditEvents:
    queue:
      messageQueue:
        maxConcurrent: 10 # Max number of messages being processed simultaneously (default: 10)
        maxSize: 200 # Max queue size before messages are dropped (default: 200)
        backpressureThreshold: 80 # Warn when queue utilization reaches this % (default: 80)
      rateLimit:
        enable: false # Enable rate limiting to prevent message flooding (default: false)
        maxMessagesPerMinute: 600 # Max messages per minute, ~10/sec (default: 600)
      queueMetrics:
        influxdb:
          enable: false # Store queue metrics in InfluxDB (default: false)
          writeFrequency: 20000 # How often to write metrics, milliseconds (default: 20000)
          measurementName: audit_events_queue # InfluxDB measurement name (default: audit_events_queue)
```

## Verification

Once configured, restart Butler SOS. You should see logs indicating the audit API is listening.

![Audit Setup Verification](/img/todo.svg)
_TODO: Add screenshot of Butler SOS logs showing audit API startup_
