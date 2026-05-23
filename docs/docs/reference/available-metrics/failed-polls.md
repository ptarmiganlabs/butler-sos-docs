---
outline: deep
---

# Failed Poll Metrics

Failed poll metrics are the subset of Butler SOS error-tracking events that indicate Butler SOS could not poll a Qlik Sense server successfully.

These events are stored in InfluxDB only. They are written to the same measurement as other Butler SOS error events, but can be isolated by filtering on the `error_type` tag.

## Measurement

| Property | Value |
|----------|-------|
| Measurement name | `butler_sos_errors` by default |
| Config setting | `Butler-SOS.errorTracking.influxdb.measurementName` |
| Write condition | `Butler-SOS.errorTracking.enable: true` and `Butler-SOS.errorTracking.influxdb.enable: true` |
| Granularity | One point per failed poll attempt |

## Failed poll types

| `error_type` value | Source poller | Trigger |
|--------------------|---------------|---------|
| `HEALTH_API` | Health metrics polling | Failed call to Qlik Sense health check API |
| `PROXY_API` | User session polling | Failed call to Qlik Sense proxy session API |
| `APP_NAMES_EXTRACT` | App name extraction | Failed QRS poll when retrieving app names |

## Tags

| Tag | Present when | Description |
|-----|--------------|-------------|
| `error_type` | Always | Distinguishes health, proxy-session, and app-name poll failures |
| `server_name` | Always | Poll target name. For `HEALTH_API` and `PROXY_API` this is the configured server name; for `APP_NAMES_EXTRACT` it is the configured `appNames.hostIP` value |
| `host` | Usually | Hostname or IP that Butler SOS tried to poll |
| `virtual_proxy` | `PROXY_API` only | Virtual proxy prefix associated with the failed session poll |

`module` and `destination_host` are generally not present for failed-poll events, because these points describe source polling failures rather than destination write failures.

## Fields

| Field | Type | Present when | Description |
|-------|------|--------------|-------------|
| `error_count` | integer | Always | Always `1` |
| `error_category` | string | Always | Derived failure category such as `timeout`, `connection_refused`, or `auth_error` |
| `error_code` | string | When present | Library or OS error code, for example `ECONNREFUSED` or `ETIMEDOUT` |
| `http_status` | integer | HTTP failures | HTTP status code returned by the failed poll request |
| `request_url` | string | Axios-based polls | Request URL with query string removed |
| `request_timeout_ms` | integer | Timed requests | Configured timeout for the failed request |
| `remote_address` | string | TCP connection failures | Remote IP that Butler SOS attempted to reach |
| `remote_port` | integer | TCP connection failures | Remote TCP port that Butler SOS attempted to reach |
| `syscall` | string | TCP connection failures | Failed syscall, usually `connect` |

## Example line protocol

```text
butler_sos_errors,error_type=HEALTH_API,server_name=sense1,host=sense1.example.com error_count=1i,error_category="timeout",error_code="ECONNABORTED",request_url="https://sense1.example.com:4747/engine/healthcheck",request_timeout_ms=5000i

butler_sos_errors,error_type=PROXY_API,server_name=sense2,host=sense2.example.com,virtual_proxy=/sales error_count=1i,error_category="connection_refused",error_code="ECONNREFUSED",request_url="https://sense2.example.com:4243/qps/session",request_timeout_ms=5000i,remote_address="192.168.1.20",remote_port=4243i,syscall="connect"

butler_sos_errors,error_type=APP_NAMES_EXTRACT,server_name=qrs1.example.com,host=qrs1.example.com error_count=1i,error_category="auth_error",http_status=403i
```

## Example queries

### Count all failed polls in the last hour

```sql
SELECT SUM("error_count")
FROM "butler_sos_errors"
WHERE "error_type" =~ /HEALTH_API|PROXY_API|APP_NAMES_EXTRACT/
  AND time > NOW() - 1h
```

### Show failed proxy-session polls by server and virtual proxy

```sql
SELECT SUM("error_count")
FROM "butler_sos_errors"
WHERE "error_type" = 'PROXY_API'
  AND time > NOW() - 24h
GROUP BY "server_name", "virtual_proxy"
```

## Related docs

- [Failed Polls](/docs/concepts/monitoring/failed-polls) for the operational monitoring use case
- [InfluxDB Metrics](./influxdb) for the full Butler SOS InfluxDB schema
- [Config File Format](/docs/reference/config-file-format) for `errorTracking` configuration details