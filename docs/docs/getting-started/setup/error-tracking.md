---
outline: deep
---

# Configuring Butler SOS Error Tracking

Butler SOS can track errors when communicating with Qlik Sense servers or writing to destination systems (InfluxDB, MQTT, New Relic).

::: info Optional
These settings are optional.

If you don't need this feature just disable it and leave the default values in the config as they are.

Do note though that Butler SOS expects the configuration properties below to exist in the config file, but will _ignore their values_ if the related features are disabled.
:::

## What's This?

Even with proper monitoring in place, things can and will fail:
- Qlik Sense APIs may be temporarily unreachable
- InfluxDB writes can fail due to network or auth issues
- MQTT brokers may be down
- New Relic API calls can timeout

Error tracking gives you **visibility into what's failing and why**, stored as time-series data in InfluxDB alongside all other Butler SOS metrics.

## Settings in Main Config File

```yaml
Butler-SOS:
  ...
  ...
  # Error tracking configuration
  errorTracking:
    enable: true                    # Master switch — disables all tracking when false
    logSummary:
      enable: true                  # Log daily error summary to console at midnight UTC
    influxdb:
      enable: true                  # Write individual error events to InfluxDB
      measurementName: butler_sos_errors
  ...
  ...
```

| Parameter | Description |
|-----------|-------------|
| `enable` | Master switch for all error tracking. `true`/`false` |
| `logSummary.enable` | Log daily error summary to console. `true`/`false` |
| `influxdb.enable` | Write individual error events to InfluxDB. `true`/`false` |
| `influxdb.measurementName` | InfluxDB measurement name (default: `butler_sos_errors`) |

## What Gets Tracked

Errors are automatically tracked for these scenarios:

| Error Type | Description | Source Module(s) |
|------------|-------------|-----------------|
| `HEALTH_API` | Health check API failures | `healthmetrics.js` |
| `PROXY_API` | Proxy session API failures | `proxysessionmetrics.js` |
| `APP_NAMES_EXTRACT` | App name extraction failures | `appnamesextract.js` |
| `INFLUXDB_V1_WRITE` | InfluxDB v1 write failures | `influxdb/v1/*.js` |
| `INFLUXDB_V2_WRITE` | InfluxDB v2 write failures | `influxdb/v2/*.js` |
| `INFLUXDB_V3_WRITE` | InfluxDB v3 write failures | `influxdb/v3/*.js` |
| `MQTT_PUBLISH` | MQTT publish failures | `post-to-mqtt.js` |
| `NEW_RELIC_POST` | New Relic API post failures | `post-to-new-relic.js` |
| `UDP_USER_EVENT` | UDP user event processing failures | `udp_handlers/user_events/` |
| `UDP_LOG_EVENT` | UDP log event processing failures | `udp_handlers/log_events/` |

## Verifying It Works

1. Start Butler SOS with `errorTracking.enable: true`
2. Set log level to `debug` to see per-error counter increments
3. Check console for messages like:
   ```
   ERROR TRACKER: Error counts today (UTC): Total=3, Details={...}
   ```
4. If `influxdb.enable: true`, query InfluxDB:
   ```sql
   SELECT * FROM "butler_sos_errors" WHERE time > NOW() - 1h
   ```
